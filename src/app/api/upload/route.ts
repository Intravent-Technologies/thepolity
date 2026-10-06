import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-guard';
import { clientIp, rateLimitRequest } from '@/lib/rate-limit';
import {
  containsMarkup,
  detectContentType,
  hasAllowedExtension,
  isAllowedUploadType,
  safeUploadName,
} from '@/lib/validate';
import { uploadMediaFile, saveHomepageImage } from '@/lib/storage';

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const MAX_UPLOADS_PER_HOUR = 120;
/**
 * Showcase uploads are all 'work' now that portfolio and gallery share one
 * entity. 'homepage' stays separate because those images are filed into the
 * long-standing 'gallery' storage directory, which existing uploads rely on.
 */
const UPLOAD_TYPES = ['work', 'homepage'] as const;

type UploadType = (typeof UPLOAD_TYPES)[number];

function isUploadType(value: unknown): value is UploadType {
  return typeof value === 'string' && (UPLOAD_TYPES as readonly string[]).includes(value);
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const limit = await rateLimitRequest(`upload:${ip}`, MAX_UPLOADS_PER_HOUR, 60 * 60 * 1000);

  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many uploads. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } }
    );
  }

  const denied = requireAdmin(request);
  if (denied) {
    return denied;
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid upload request' }, { status: 400 });
  }

  const file = formData.get('file');
  const type = formData.get('type');
  const section = formData.get('section');
  const multi = formData.get('multi') === 'true';

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!isUploadType(type)) {
    return NextResponse.json({ error: 'Invalid upload type' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const detected = detectContentType(buffer);
  if (!detected || !isAllowedUploadType(detected)) {
    return NextResponse.json(
      { error: 'Unsupported file type. Allowed: JPEG, PNG, WebP, GIF, AVIF, TIFF, MP4, WebM, MOV.' },
      { status: 400 }
    );
  }

  if (containsMarkup(buffer)) {
    return NextResponse.json(
      { error: 'File rejected: it contains markup or script content.' },
      { status: 400 }
    );
  }

  if (!hasAllowedExtension(file.name, detected)) {
    return NextResponse.json(
      { error: 'File extension does not match the file contents.' },
      { status: 400 }
    );
  }

  const isVideo = detected.startsWith('video/');
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;

  if (buffer.byteLength > maxBytes) {
    return NextResponse.json(
      { error: `File too large. Maximum size is ${Math.round(maxBytes / (1024 * 1024))}MB.` },
      { status: 413 }
    );
  }

  const directory = type === 'homepage' ? 'gallery' : type;

  try {
    const uploaded = await uploadMediaFile({
      buffer,
      contentType: detected,
      filename: `${Date.now()}-${safeUploadName(file.name)}`,
      directory,
    });

    if (type === 'homepage' && typeof section === 'string' && section.length > 0) {
      await saveHomepageImage(section, uploaded.url, { multi });
    }

    return NextResponse.json(uploaded, { status: 200 });
  } catch (error) {
    console.error('[upload] failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
