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
  // Matroska and WebM share the EBML header; the declared extension is what
  // separates them, and only .webm is accepted.
  { mime: 'video/webm', bytes: [0x1a, 0x45, 0xdf, 0xa3] },
];

/**
 * ISO base media brands that identify an MP4 container. The major brand is the
 * four bytes after 'ftyp'; compatible brands follow the minor version and are
 * scanned too, since encoders vary on which brand they lead with.
 */
const MP4_BRANDS = new Set([
  'isom', 'iso2', 'iso4', 'iso5', 'iso6', 'avc1', 'dash', 'mmp4',
  'mp41', 'mp42', 'mp71', 'M4A ', 'M4V ', 'M4P ', '3gp4', '3gp5',
  '3g2a', 'MSNV', 'f4v ',
]);

/**
 * QuickTime and MP4 share the ISO base media container and are told apart only
 * by their major brand, so this must be checked before the MP4 fallback.
 */
const QUICKTIME_BRANDS = new Set(['qt  ']);

const AVIF_BRANDS = new Set(['avif', 'avis']);

/**
 * Scan the major brand and every compatible brand of an 'ftyp' box. Stops at
 * the declared box size so a payload cannot smuggle a match from far past the
 * header.
 */
function readFtypBrands(buffer: Buffer): string[] {
  const boxSize = buffer.readUInt32BE(0);
  const brands: string[] = [buffer.toString('latin1', 8, 12)];

  const minorVersionEnd = 16;
  const brandEnd = Math.min(boxSize, buffer.length) - 4;
  for (let at = minorVersionEnd; at + 4 <= brandEnd; at += 4) {
    brands.push(buffer.toString('latin1', at, at + 4));
  }
  return brands;
}

function detectIsoBaseMedia(buffer: Buffer): string | null {
  if (buffer.length < 12 || buffer.toString('latin1', 4, 8) !== 'ftyp') {
    return null;
  }

  const brands = readFtypBrands(buffer);

  if (brands.some((brand) => QUICKTIME_BRANDS.has(brand))) {
    return 'video/quicktime';
  }
  if (brands.some((brand) => AVIF_BRANDS.has(brand))) {
    return 'image/avif';
  }
  if (brands.some((brand) => MP4_BRANDS.has(brand))) {
    return 'video/mp4';
  }

  // An unrecognised brand is still an ISO base media file. Callers pair this
  // with an extension check, so defaulting to MP4 keeps valid files with
  // uncommon brands usable without loosening the allowlist.
  return 'video/mp4';
}

/**
 * RIFF is a container format also used by WAV and AVI. Requiring 'WEBP' in the
 * form type at offset 8 is what makes this specific to WebP.
 */
function isRiffWebp(buffer: Buffer): boolean {
  return (
    buffer.length >= 12 &&
    buffer.toString('latin1', 0, 4) === 'RIFF' &&
    buffer.toString('latin1', 8, 12) === 'WEBP'
  );
}

/**
 * Identify the payload from its leading bytes. The browser supplied MIME type
 * is attacker controlled, so it is only ever used as a hint.
 */
export function detectContentType(buffer: Buffer): string | null {
  if (isRiffWebp(buffer)) {
    return 'image/webp';
  }

  const iso = detectIsoBaseMedia(buffer);
  if (iso) {
    return iso;
  }

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
