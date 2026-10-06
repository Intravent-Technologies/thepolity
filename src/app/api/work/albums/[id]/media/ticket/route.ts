import { NextRequest, NextResponse } from 'next/server';
import { clientIp, rateLimitRequest } from '@/lib/rate-limit';
import { MAX_IMAGE_BYTES, MAX_VIDEO_BYTES } from '@/lib/upload-rules';
import { hasAllowedExtension, safeUploadName } from '@/lib/validate';
import { createAlbumUploadTicket, getWorkAlbumById, isSupabaseConfigured } from '@/lib/storage';
import { readJsonBody, readRouteParam, requireAdmin, toErrorResponse } from '@/lib/api-guard';

const MAX_TICKETS_PER_HOUR = 500;

/**
 * Step 1 of a direct upload: hand the browser a URL it may PUT one file to.
 *
 * The body here is a few dozen bytes of JSON, so this request is nowhere near
 * the request-size ceiling that makes the old multipart route fail. The bytes
 * themselves go straight from the browser to Supabase Storage.
 *
 * Nothing about the destination is chosen by the client. The path and filename
 * are built here and a signed URL grants write access to exactly that one
 * object, so a tampered request cannot write elsewhere in the bucket.
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
  const limit = await rateLimitRequest(`album-ticket:${ip}`, MAX_TICKETS_PER_HOUR, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many upload attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  try {
    /* Without Supabase there is no storage to upload to, so the caller is told
       to use the multipart route instead, which writes to local disk. */
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Direct upload is unavailable on this server.', direct: false },
        { status: 501 }
      );
    }

    const albumId = readRouteParam((await params).id);
    const album = await getWorkAlbumById(albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    const body = (await readJsonBody(request)) as {
      filename?: unknown;
      contentType?: unknown;
      sizeBytes?: unknown;
    };

    const filename = typeof body.filename === 'string' ? body.filename.trim() : '';
    const sizeBytes = Number(body.sizeBytes);

    if (!filename) {
      return NextResponse.json({ error: 'Which file? Send a filename.' }, { status: 400 });
    }
    if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
      return NextResponse.json({ error: 'That file is empty.' }, { status: 400 });
    }

    const contentType = typeof body.contentType === 'string' ? body.contentType : '';

    /* The extension and the declared size are checked now so an oversized file
       is refused before anything is transferred. The real type is proved later
       by reading the uploaded bytes back, so nothing here is taken on trust for
       the purpose of deciding what the file is. */
    if (!hasAllowedExtension(filename, contentType)) {
      return NextResponse.json(
        { error: `${safeUploadName(filename)}: unsupported file type` },
        { status: 400 }
      );
    }

    const looksLikeVideo = /^video\//.test(contentType) || /\.(mp4|mov|webm)$/i.test(filename);
    const maxBytes = looksLikeVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (sizeBytes > maxBytes) {
      return NextResponse.json(
        { error: `${safeUploadName(filename)}: over ${Math.round(maxBytes / (1024 * 1024))}MB` },
        { status: 400 }
      );
    }

    const ticket = await createAlbumUploadTicket({
      filename: safeUploadName(filename),
      contentType: contentType || 'application/octet-stream',
      directory: 'albums',
    });

    return NextResponse.json({
      signedUrl: ticket.signedUrl,
      token: ticket.token,
      storagePath: ticket.storagePath,
      maxBytes,
      albumId: album.id,
    });
  } catch (error) {
    return toErrorResponse(error, 'Could not prepare the upload');
  }
}
