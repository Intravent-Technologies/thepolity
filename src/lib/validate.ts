export const MAX_TEXT_LENGTH = 5000;

function stripControlChars(value: string): string {
  let out = '';
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    if (code < 0x20 || code === 0x7f) {
      continue;
    }
    out += char;
  }
  return out;
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Strip characters that let an attacker break out of a value and inject
 * markup, then collapse the result to plain text.
 */
export function sanitizeText(value: unknown, maxLength = MAX_TEXT_LENGTH): string {
  if (typeof value !== 'string') {
    return '';
  }

  return stripControlChars(value.normalize('NFKC'))
    .replace(/[<>`]/g, '')
    .trim()
    .slice(0, maxLength);
}

export function requireText(
  value: unknown,
  field: string,
  { maxLength = 500, minLength = 1 }: { maxLength?: number; minLength?: number } = {}
): string {
  const cleaned = sanitizeText(value, maxLength);
  if (cleaned.length < minLength) {
    throw new ValidationError(`${field} is required`);
  }
  return cleaned;
}

export function optionalText(
  value: unknown,
  { maxLength = MAX_TEXT_LENGTH }: { maxLength?: number } = {}
): string {
  return sanitizeText(value, maxLength);
}

const ALLOWED_IMAGE_TYPES: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'image/gif': ['.gif'],
  'image/avif': ['.avif'],
  'image/tiff': ['.tif', '.tiff'],
};

const ALLOWED_VIDEO_TYPES: Record<string, string[]> = {
  'video/mp4': ['.mp4'],
  'video/webm': ['.webm'],
  'video/quicktime': ['.mov'],
};

export const ALLOWED_UPLOAD_TYPES: Record<string, string[]> = {
  ...ALLOWED_IMAGE_TYPES,
  ...ALLOWED_VIDEO_TYPES,
};

const MAGIC_BYTES: { mime: string; bytes: number[]; offset?: number }[] = [
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: 'image/gif', bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: 'image/tiff', bytes: [0x49, 0x49, 0x2a, 0x00] },
  { mime: 'image/tiff', bytes: [0x4d, 0x4d, 0x00, 0x2a] },
  { mime: 'image/webp', bytes: [0x57, 0x45, 0x42, 0x50] },
  { mime: 'image/avif', bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 },
  { mime: 'video/mp4', bytes: [0x66, 0x74, 0x79, 0x70], offset: 4 },
  { mime: 'video/mp4', bytes: [0x18, 0x54, 0x68, 0x65, 0x72, 0x65] },
];

/**
 * Identify the payload from its leading bytes. The browser supplied MIME type
 * is attacker controlled, so it is only ever used as a hint.
 */
export function detectContentType(buffer: Buffer): string | null {
  for (const signature of MAGIC_BYTES) {
    const offset = signature.offset ?? 0;
    const matches = signature.bytes.every((byte, index) => buffer[offset + index] === byte);
    if (matches) {
      return signature.mime;
    }
  }
  return null;
}

export function isAllowedUploadType(contentType: string): boolean {
  return Object.prototype.hasOwnProperty.call(ALLOWED_UPLOAD_TYPES, contentType);
}

/**
 * Leading magic bytes are trivially forgeable (GIF is only four bytes), so also
 * reject payloads that open with markup. None of the allowed binary formats
 * legitimately begin with these sequences, and the markers are long enough that
 * a chance match inside random image data is negligible.
 */
const MARKUP_MARKERS = ['<?php', '<script', '<!doctype html', '<html', '<svg', 'javascript:'];

export function containsMarkup(buffer: Buffer): boolean {
  const head = buffer.subarray(0, Math.min(buffer.length, 4096)).toString('latin1').toLowerCase();
  return MARKUP_MARKERS.some((marker) => head.includes(marker));
}

export function hasAllowedExtension(filename: string, contentType: string): boolean {
  const extensions = ALLOWED_UPLOAD_TYPES[contentType];
  if (!extensions) {
    return false;
  }
  const dot = filename.lastIndexOf('.');
  if (dot === -1) {
    return false;
  }
  const extension = filename.slice(dot).toLowerCase();
  return extensions.includes(extension);
}

/**
 * Build a storage-safe filename. Everything outside a conservative character
 * set is replaced, and leading dots are stripped so no name can resolve to a
 * parent directory or a hidden file.
 */
export function safeUploadName(originalName: string): string {
  const base = originalName.split(/[\\/]/).pop() ?? 'file';
  const cleaned = base
    .replace(/[^A-Za-z0-9._-]/g, '-')
    .replace(/^\.+/, '')
    .slice(0, 100);

  return cleaned.length > 0 ? cleaned : 'file';
}

export class ValidationError extends Error {}
