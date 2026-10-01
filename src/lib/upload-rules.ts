/**
 * Upload limits and the accepted format list, shared by the browser and the
 * upload route. Both sides must agree: if the client allows a file the server
 * rejects, the client only discovers the problem after a slow round trip.
 */

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export const ACCEPTED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.avif',
  '.tif',
  '.tiff',
] as const;

export const ACCEPTED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'] as const;

/** Value for the file input's `accept` attribute. */
export const IMAGE_ACCEPT_ATTRIBUTE = ACCEPTED_IMAGE_EXTENSIONS.join(',');
export const VIDEO_ACCEPT_ATTRIBUTE = ACCEPTED_VIDEO_EXTENSIONS.join(',');

export const ALL_ACCEPT_ATTRIBUTE = [
  ...ACCEPTED_IMAGE_EXTENSIONS,
  ...ACCEPTED_VIDEO_EXTENSIONS,
].join(',');

const ALL_EXTENSIONS = new Set<string>([
  ...ACCEPTED_IMAGE_EXTENSIONS,
  ...ACCEPTED_VIDEO_EXTENSIONS,
]);

const VIDEO_ONLY_EXTENSIONS = new Set<string>(ACCEPTED_VIDEO_EXTENSIONS);

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extensionOf(filename: string): string {
  const dot = filename.lastIndexOf('.');
  return dot === -1 ? '' : filename.slice(dot).toLowerCase();
}

export type AcceptedKind = 'image' | 'video' | 'any';

export interface UploadCandidate {
  ok: boolean;
  error?: string;
  kind?: 'image' | 'video';
}

/**
 * Reject files the server would reject anyway, and flag oversize uploads
 * before the client spends bandwidth discovering it. The route remains the
 * authority — this is a courtesy pass, not a security boundary.
 */
export function checkUploadCandidate(
  file: File,
  kind: AcceptedKind = 'any'
): UploadCandidate {
  const extension = extensionOf(file.name);

  if (file.size === 0) {
    return { ok: false, error: 'That file is empty.' };
  }

  if (!extension || !ALL_EXTENSIONS.has(extension)) {
    return {
      ok: false,
      error: `Unsupported file type. Use ${[...ALL_EXTENSIONS].join(', ')}.`,
    };
  }

  const isVideo = VIDEO_ONLY_EXTENSIONS.has(extension);

  if (kind === 'image' && isVideo) {
    return { ok: false, error: 'This field accepts images only.' };
  }
  if (kind === 'video' && !isVideo) {
    return { ok: false, error: 'This field accepts video only.' };
  }

  const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > limit) {
    return {
      ok: false,
      error: `That file is ${formatBytes(file.size)}. The limit is ${formatBytes(limit)}.`,
    };
  }

  return { ok: true, kind: isVideo ? 'video' : 'image' };
}