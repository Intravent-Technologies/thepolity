import { NextRequest, NextResponse } from 'next/server';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { MAX_IMAGE_BYTES, MAX_VIDEO_BYTES } from '@/lib/upload-rules';
import { safeUploadName } from '@/lib/validate';
import {
  addWorkAlbumMedia,
  confirmUploadedObject,
  getPublicMediaUrl,
  getWorkAlbumById,
  removeStoredObject,
} from '@/lib/storage';
import { readJsonBody, readRouteParam, requireAdmin, toErrorResponse } from '@/lib/api-guard';

const MAX_CONFIRMS_PER_HOUR = 500;

/**
 * Step 2 of a direct upload: the bytes are in the bucket, now record them.
 *
 * The row is only written once the stored object has been read back and shown to
 * be a real allowed file of the size actually stored. If the insert fails the
 * object is removed again, so a failed upload cannot leave an orphan sitting in
 * public storage that nothing links to.
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
  const limit = rateLimit(`album-confirm:${ip}`, MAX_CONFIRMS_PER_HOUR, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many upload attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const albumId = readRouteParam((await params).id);
    const album = await getWorkAlbumById(albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    const body = (await readJsonBody(request)) as {
      storagePath?: unknown;
      filename?: unknown;
      kind?: unknown;
      sizeBytes?: unknown;
    };

    const storagePath = typeof body.storagePath === 'string' ? body.storagePath : '';
    const filename = typeof body.filename === 'string' ? body.filename : '';

    if (!storagePath) {
      return NextResponse.json({ error: 'Which file? Send storagePath.' }, { status: 400 });
    }

    /* The path is echoed back by the browser, but it still came from the
       client, so it is re-checked against the one directory uploads are allowed
       to occupy before anything is read or deleted using it. */
    if (!/^albums\/[A-Za-z0-9.\-_/]+$/.test(storagePath)) {
      return NextResponse.json({ error: 'That is not a valid upload path.' }, { status: 400 });
    }

    const declaredKind = body.kind === 'video' ? 'video' : 'image';
    const maxBytes = declaredKind === 'video' ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;

    let stored: { sizeBytes: number; contentType: string };
    try {
      stored = await confirmUploadedObject({
        storagePath,
        expectedSizeBytes: Number(body.sizeBytes) || 0,
        maxBytes,
      });
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'That file could not be verified.' },
        { status: 400 }
      );
    }

    // The stored type decides the kind, so a "video" that is really a JPEG is
    // filed as an image rather than as a video that will not play.
    const isVideo = stored.contentType.startsWith('video/');
    if (isVideo !== (declaredKind === 'video')) {
      await removeStoredObject(storagePath);
      return NextResponse.json(
        { error: `${safeUploadName(filename)}: that file is a ${isVideo ? 'video' : 'photograph'}, not a ${declaredKind}.` },
        { status: 400 }
      );
    }

    try {
      const media = await addWorkAlbumMedia(album.id, [
        {
          driveFileId: '',
          filename,
          kind: isVideo ? ('video' as const) : ('image' as const),
          mimeType: stored.contentType,
          sizeBytes: stored.sizeBytes,
          storagePath,
          publicUrl: getPublicMediaUrl(storagePath),
          sortOrder: 0,
        },
      ]);

      return NextResponse.json({ media }, { status: 201 });
    } catch (error) {
      /* Nothing references the object if the row did not land, and the bucket is
         public, so leave nothing behind. */
      await removeStoredObject(storagePath);
      throw error;
    }
  } catch (error) {
    return toErrorResponse(error, 'Failed to add the upload to this album');
  }
}
