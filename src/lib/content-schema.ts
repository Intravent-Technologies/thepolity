import { optionalText, requireText, ValidationError } from '@/lib/validate';

/**
 * Explicit per-entity schemas. Every field is declared and length-capped, so a
 * caller cannot smuggle extra keys through to the storage layer
 * (mass assignment) nor store unbounded payloads.
 */

const IMAGE = { maxLength: 2048 } as const;
const SHORT = { maxLength: 200 } as const;
const LONG = { maxLength: 5000 } as const;

function requireRating(value: unknown): number {
  const rating = typeof value === 'number' ? value : Number(value);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new ValidationError('rating must be an integer between 1 and 5');
  }
  return rating;
}

function requireIsoDate(value: unknown): string {
  const text = requireText(value, 'date', SHORT);
  if (Number.isNaN(Date.parse(text))) {
    throw new ValidationError('date must be a valid date');
  }
  return text;
}

/**
 * Validate a stored asset reference. Applies to images and video alike: a
 * `videoUrl` goes through exactly the same allowlist as an `image`, so neither
 * can become a `javascript:` or `data:` execution vector when rendered.
 */
function requireAssetUrl(value: unknown, field = 'image'): string {
  const url = requireText(value, field, IMAGE);
  // Only same-origin paths and https URLs are stored, so a stored asset can
  // never become a javascript: or data: execution vector when rendered.
  if (url.startsWith('/uploads/')) {
    return url;
  }
  if (/^https:\/\//i.test(url)) {
    return url;
  }
  throw new ValidationError(`${field} must be an https URL or an /uploads/ path`);
}

/**
 * An optional asset. Returns '' rather than throwing so a project can be saved
 * with a video and no cover image, which the public page renders behind its
 * placeholder. The empty string is what gets written to storage and Supabase,
 * and reads back as falsy.
 */
function optionalAssetUrl(value: unknown, field: string): string {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  return requireAssetUrl(value, field);
}

const schemas = {
  blog: (b: Record<string, unknown>) => ({
    title: requireText(b.title, 'title', SHORT),
    category: optionalText(b.category, SHORT),
    date: requireIsoDate(b.date),
    excerpt: optionalText(b.excerpt, LONG),
    image: optionalText(b.image, IMAGE),
  }),
  /**
   * The single showcase entity. Everything except `title` is optional, because
   * this table absorbed the old portfolio and gallery tables: a curated case
   * study supplies `client` and `description`, while a loose media item may
   * carry just a `videoUrl`, or just a cover image.
   */
  work: (b: Record<string, unknown>) => ({
    title: requireText(b.title, 'title', SHORT),
    category: optionalText(b.category, SHORT),
    client: optionalText(b.client, SHORT),
    description: optionalText(b.description, LONG),
    image: optionalAssetUrl(b.image, 'image'),
    videoUrl: optionalAssetUrl(b.videoUrl, 'videoUrl'),
  }),
  team: (b: Record<string, unknown>) => ({
    name: requireText(b.name, 'name', SHORT),
    role: requireText(b.role, 'role', SHORT),
    bio: optionalText(b.bio, LONG),
    image: optionalText(b.image, IMAGE),
  }),
  reviews: (b: Record<string, unknown>) => ({
    name: requireText(b.name, 'name', SHORT),
    role: optionalText(b.role, SHORT),
    content: requireText(b.content, 'content', LONG),
    rating: requireRating(b.rating),
  }),
  'homepage-images': (b: Record<string, unknown>) => ({
    section: requireText(b.section, 'section', SHORT),
    imageUrl: requireAssetUrl(b.imageUrl, 'imageUrl'),
    multi: b.multi === true || b.multi === 'true',
  }),
} as const;

export type ContentEntity = keyof typeof schemas;

export function parseContentBody(
  entity: ContentEntity,
  body: Record<string, unknown>
): Record<string, unknown> {
  return schemas[entity](body);
}
