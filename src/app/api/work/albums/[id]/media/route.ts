import { NextRequest, NextResponse } from 'next/server';
import { clientIp, rateLimitRequest } from '@/lib/rate-limit';
import { MAX_IMAGE_BYTES, MAX_VIDEO_BYTES } from '@/lib/upload-rules';
import {
  containsMarkup,
  detectContentType,
  hasAllowedExtension,
  isAllowedUploadType,
  safeUploadName,
} from '@/lib/validate';
import {
  addWorkAlbumMedia,
  getWorkAlbumById,
  reorderWorkAlbumMedia,
  removeWorkAlbumMedia,
  uploadMediaFile,
} from '@/lib/storage';
import type { WorkAlbumMedia } from '@/lib/work-types';
import { ValidationError } from '@/lib/validate';
import {
  readJsonBody,
  readRouteParam,
  requireAdmin,
  toErrorResponse,
} from '@/lib/api-guard';
import { recordAdminAction } from '@/lib/audit';

const MAX_UPLOADS_PER_HOUR = 240;

/**
 * Photos and videos added to one album by hand, as opposed to pulled from Drive.
 *
 * POST   add files (multipart, may repeat `file`)
 * PATCH  persist a new display order
 * DELETE remove one item
 *
 * Files pass the same checks as /api/upload — real type sniffing rather than
 * trusting the extension or the browser's Content-Type — because this is a
 * second way into the same public bucket.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  const ip = clientIp(request);
  const limit = await rateLimitRequest(`album-media:${ip}`, MAX_UPLOADS_PER_HOUR, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many uploads. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const albumId = readRouteParam((await params).id);
    const album = await getWorkAlbumById(albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const files = formData.getAll('file').filter((item): item is File => item instanceof File);
    if (files.length === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const uploaded = [];
    const rejected: string[] = [];

    for (const file of files) {
      if (file.size === 0) {
        rejected.push(`${file.name}: empty file`);
        continue;
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const detected = detectContentType(buffer);

      if (!detected || !isAllowedUploadType(detected)) {
        rejected.push(`${file.name}: unsupported file type`);
        continue;
      }
      if (containsMarkup(buffer)) {
        rejected.push(`${file.name}: contains markup or script content`);
        continue;
      }
      if (!hasAllowedExtension(file.name, detected)) {
        rejected.push(`${file.name}: extension does not match the contents`);
        continue;
      }

      const isVideo = detected.startsWith('video/');
      const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
      if (buffer.byteLength > maxBytes) {
        rejected.push(
          `${file.name}: over ${Math.round(maxBytes / (1024 * 1024))}MB`
        );
        continue;
      }

      const stored = await uploadMediaFile({
        buffer,
        contentType: detected,
        filename: `${Date.now()}-${safeUploadName(file.name)}`,
        directory: 'albums',
      });

      uploaded.push({
        driveFileId: '',
        filename: file.name,
        kind: isVideo ? ('video' as const) : ('image' as const),
        mimeType: detected,
        sizeBytes: buffer.byteLength,
        storagePath: stored.storagePath,
        publicUrl: stored.url,
        sortOrder: 0,
      });
    }

    if (uploaded.length === 0) {
      return NextResponse.json(
        { error: 'Nothing was uploaded', rejected },
        { status: 400 }
      );
    }

    const media = await addWorkAlbumMedia(album.id, uploaded);

    recordAdminAction(request, 'media.upload', 'album', albumId, {
      uploaded: media.length,
      rejected: rejected?.length ?? 0,
    });

    /* One bad file in a batch of twenty should not throw away the nineteen that
       were fine, so partial success is the normal case and `rejected` is
       reported rather than treated as a failure. */
    return NextResponse.json({ media, rejected }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error, 'Failed to upload to album');
  }
}

/**
 * Save the order the admin arranged. `orderedIds` is the full list, front to
 * back; anything omitted keeps its position at the end.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  try {
    const albumId = readRouteParam((await params).id);
    const album = await getWorkAlbumById(albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    const body = (await readJsonBody(request)) as { orderedIds?: unknown };
    if (!Array.isArray(body.orderedIds) || body.orderedIds.length === 0) {
      throw new ValidationError('Send the new order as a non-empty orderedIds array');
    }

    const orderedIds = body.orderedIds.map(String);
    if (new Set(orderedIds).size !== orderedIds.length) {
      throw new ValidationError('The same photo was listed twice');
    }

    const media = await reorderWorkAlbumMedia(album.id, orderedIds);
    recordAdminAction(request, 'media.reorder', 'album', album.id, { count: orderedIds.length });
    return NextResponse.json({ media });
  } catch (error) {
    return toErrorResponse(error, 'Failed to reorder album');
  }
}

/**
 * Remove one photo or video. The stored file goes with it; a Drive-hosted photo
 * has no file of ours, so only its row disappears.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  try {
    const albumId = readRouteParam((await params).id);
    const album = await getWorkAlbumById(albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    const body = (await readJsonBody(request)) as { mediaId?: unknown };
    if (!body.mediaId) {
      return NextResponse.json({ error: 'Which item? Send mediaId.' }, { status: 400 });
    }

    const media: WorkAlbumMedia[] = await removeWorkAlbumMedia(album.id, String(body.mediaId));
    recordAdminAction(request, 'media.delete', 'album', album.id, { mediaId: body.mediaId });
    return NextResponse.json({ media });
  } catch (error) {
    return toErrorResponse(error, 'Failed to remove item');
  }
}
