import { NextRequest, NextResponse } from 'next/server';
import {
  getWorkAlbumById,
  getWorkAlbumMedia,
  saveWorkAlbumMedia,
  updateWorkAlbum,
  uploadMediaFile,
  deleteStoredAsset,
} from '@/lib/storage';
import { downloadDriveFile, listFolderFiles } from '@/lib/google-drive';
import { MAX_VIDEO_BYTES } from '@/lib/upload-rules';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { readRouteParam, requireAdmin, toErrorResponse } from '@/lib/api-guard';
import type { WorkAlbumMedia } from '@/lib/work-types';
import { ValidationError } from '@/lib/validate';

/**
 * A sync lists the Drive folder and records what it finds. Sync is manual so
 * this runs only when an admin asks for it, which keeps Google's anonymous
 * per-IP quota out of everyday use.
 */
const MAX_SYNCS_PER_HOUR = 30;

/** Refuse pathological folders rather than stalling the function on them. */
const MAX_ITEMS_PER_SYNC = 2000;

/**
 * Alphabetical ordering is what Drive returns and what an editor expects, but
 * `Array.prototype.sort` orders by code unit, so "IMG_2.jpg" sorts before
 * "IMG_10.jpg". Compare runs of digits numerically.
 */
function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

interface SyncOutcome {
  photos: number;
  videosAdded: number;
  videosReused: number;
  videosSkipped: { name: string; reason: string }[];
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  const ip = clientIp(request);
  const limit = rateLimit(`album-sync:${ip}`, MAX_SYNCS_PER_HOUR, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many syncs. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const id = readRouteParam((await params).id);
    const album = await getWorkAlbumById(id);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    // One listing request per 200 files. Cheap, and the only Drive call that
    // touches every item.
    const files = await listFolderFiles(album.driveFolderId);
    if (files.length > MAX_ITEMS_PER_SYNC) {
      throw new ValidationError(
        `That folder has ${files.length} items, over the ${MAX_ITEMS_PER_SYNC} limit for one sync. Split it into smaller albums.`
      );
    }

    const existing = await getWorkAlbumMedia(album.id);
    const existingByFileId = new Map(existing.map((item) => [item.driveFileId, item]));

    const images = files.filter((file) => file.isImage).sort((a, b) => naturalCompare(a.name, b.name));
    const videos = files.filter((file) => file.isVideo).sort((a, b) => naturalCompare(a.name, b.name));

    // Photos are never downloaded. Only the file id is stored and the browser
    // loads the image from Google's CDN, so a large album costs one API call.
    const incoming: Omit<WorkAlbumMedia, 'id' | 'albumId'>[] = images.map((file, index) => ({
      driveFileId: file.id,
      filename: file.name,
      kind: 'image' as const,
      mimeType: file.mimeType,
      sizeBytes: file.sizeBytes,
      storagePath: '',
      publicUrl: '',
      sortOrder: index,
    }));

    const outcome: SyncOutcome = {
      photos: images.length,
      videosAdded: 0,
      videosReused: 0,
      videosSkipped: [],
    };

    let nextSortOrder = images.length;

    for (const file of videos) {
      const sortOrder = nextSortOrder;
      nextSortOrder += 1;

      // An oversized video is reported rather than silently dropped, so the
      // admin knows why it is missing from the album.
      if (file.sizeBytes > MAX_VIDEO_BYTES) {
        outcome.videosSkipped.push({
          name: file.name,
          reason: `larger than the ${Math.round(MAX_VIDEO_BYTES / 1024 / 1024)} MB limit`,
        });
        continue;
      }

      const previous = existingByFileId.get(file.id);

      // Already mirrored and unchanged: reuse the stored copy. This is what
      // makes re-syncing a settled album cost nothing.
      if (previous && previous.kind === 'video' && previous.publicUrl && previous.sizeBytes === file.sizeBytes) {
        incoming.push({
          driveFileId: file.id,
          filename: file.name,
          kind: 'video',
          mimeType: file.mimeType || previous.mimeType,
          sizeBytes: file.sizeBytes,
          storagePath: previous.storagePath,
          publicUrl: previous.publicUrl,
          sortOrder,
        });
        outcome.videosReused += 1;
        continue;
      }

      // Videos are mirrored, because Drive serves media uncacheable and a
      // live-proxied video would re-fetch from Google on every play.
      const { buffer, mimeType } = await downloadDriveFile(file.id, file.sizeBytes);
      const uploaded = await uploadMediaFile({
        buffer,
        contentType: mimeType || file.mimeType || 'application/octet-stream',
        // Prefixing the Drive id keeps the stored name unique even when two
        // files in a folder share a name and sync within the same millisecond.
        filename: `${file.id.slice(0, 8)}-${file.name || 'video.mp4'}`,
        directory: 'albums',
      });

      // Only drop the replaced file once the new one is safely stored, so a
      // failure mid-sync cannot leave the album with no video at all.
      if (previous?.publicUrl && previous.publicUrl !== uploaded.url) {
        await deleteStoredAsset(previous.publicUrl);
      }

      incoming.push({
        driveFileId: file.id,
        filename: file.name,
        kind: 'video',
        mimeType: mimeType || file.mimeType,
        sizeBytes: file.sizeBytes,
        storagePath: uploaded.storagePath,
        publicUrl: uploaded.url,
        sortOrder,
      });
      outcome.videosAdded += 1;
    }

    const saved = await saveWorkAlbumMedia(album.id, incoming);

    // `saveWorkAlbumMedia` has already refreshed the album's counts from the
    // rows that survived, so admin uploads remain counted without this repeating
    // the arithmetic.

    /* Give a fresh album a sensible cover instead of an empty tile. A cover the
       admin chose by hand is never overwritten, in either form: `coverMediaId`
       means they picked an uploaded photo, `coverDriveFileId` a Drive one. */
    const coverDriveFileId =
      album.coverMediaId || album.coverDriveFileId ? album.coverDriveFileId : images[0]?.id || '';

    await updateWorkAlbum(album.id, {
      lastSyncedAt: new Date().toISOString(),
      coverDriveFileId,
    });

    console.log(
      `[api:albums] synced "${album.title}": ${outcome.photos} photos, ` +
        `${outcome.videosAdded} videos added, ${outcome.videosReused} reused, ` +
        `${outcome.videosSkipped.length} skipped`
    );

    return NextResponse.json({
      ...outcome,
      mediaCount: saved.length,
      coverDriveFileId,
      lastSyncedAt: new Date().toISOString(),
    });
  } catch (error) {
    return toErrorResponse(error, 'Failed to sync album');
  }
}