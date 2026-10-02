/**
 * Minimal Google Drive API v3 client for reading public album folders.
 *
 * Server-only by usage: this reads a secret API key from the environment and
 * must never be imported by a client component. The pure, shareable helpers
 * (types and `drivePhotoUrl`) live in `@/lib/work-types` instead.
 *
 * Design notes, all verified against a live public folder:
 *
 * - Folders are shared "anyone with the link", so no OAuth, no consent screen
 *   and no Google security assessment are needed. A plain API key is enough.
 * - `files.list` is cheap and safe to call: one request per 100 files.
 * - Photos are NEVER downloaded. Only their metadata is stored, and the browser
 *   loads pixels straight from Google's CDN. That keeps sync fast, costs
 *   nothing, and avoids pulling gigabytes through a serverless function.
 * - Videos ARE downloaded and mirrored, because Drive returns
 *   `cache-control: private, max-age=0, must-revalidate` for media. Nothing may
 *   cache it, so a live-proxied video would re-fetch from Google on every play
 *   and invite the documented `downloadQuotaExceeded` 403s and IP throttling.
 */

import { ValidationError } from '@/lib/validate';

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const FOLDER_MIME = 'application/vnd.google-apps.folder';

/** Drive ids are opaque base64url-ish tokens; be permissive but reject junk. */
const DRIVE_ID = /^[-\w]{10,}$/;

/** Drive enforces a hard 10 requests/second/user ceiling. */
const MAX_PAGES = 20;
const PAGE_SIZE = 200;

export interface DriveFileMetadata {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  modifiedTime: string;
  isImage: boolean;
  isVideo: boolean;
}

export function isDriveConfigured(): boolean {
  return !!process.env.GOOGLE_DRIVE_API_KEY;
}

function requireApiKey(): string {
  const key = process.env.GOOGLE_DRIVE_API_KEY;
  if (!key) {
    throw new ValidationError(
      'Google Drive is not configured. Set GOOGLE_DRIVE_API_KEY on the server.'
    );
  }
  return key;
}

/**
 * Extract a folder id from any of the link shapes Drive hands out:
 *
 *   https://drive.google.com/drive/folders/<id>
 *   https://drive.google.com/drive/u/0/folders/<id>
 *   https://drive.google.com/open?id=<id>
 *   https://drive.google.com/folder/<id>/view
 *   <id>
 *
 * Only Google hosts are accepted, so a pasted link to some other site cannot be
 * mistaken for a folder reference.
 */
export function parseDriveFolderId(input: string): string {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    throw new ValidationError('Paste a Google Drive folder link');
  }

  // A bare id, pasted directly.
  if (DRIVE_ID.test(trimmed)) {
    return trimmed;
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    throw new ValidationError('That does not look like a Google Drive link');
  }

  const host = url.hostname.toLowerCase();
  const isGoogleHost =
    host === 'drive.google.com' ||
    host === 'docs.google.com' ||
    host.endsWith('.google.com');
  if (!isGoogleHost) {
    throw new ValidationError('Link must point to drive.google.com');
  }

  const queryId = url.searchParams.get('id') || url.searchParams.get('folderid');
  if (queryId && DRIVE_ID.test(queryId)) {
    return queryId;
  }

  const segments = url.pathname.split('/').filter(Boolean);
  for (const marker of ['folders', 'folder']) {
    const index = segments.findIndex((segment) => segment === marker);
    const candidate = index === -1 ? undefined : segments[index + 1];
    if (candidate && DRIVE_ID.test(candidate)) {
      return candidate;
    }
  }

  throw new ValidationError('Could not find a Drive folder id in that link');
}

/**
 * Turn a Drive error body into something an admin can act on. The raw messages
 * are terse and the underlying causes are very different in practice.
 */
function describeDriveError(status: number, body: string): string {
  let reason = '';
  try {
    const parsed = JSON.parse(body) as {
      error?: { errors?: { reason?: string }[] };
    };
    reason = parsed.error?.errors?.[0]?.reason || '';
  } catch {
    // Fall through to the generic message below.
  }

  if (status === 403 || status === 429) {
    if (reason === 'dailyLimitExceededUnreg') {
      return 'Google Drive rejected the request: the anonymous daily quota for this API key is exhausted. Restrict the key to fewer callers or raise its quota in Google Cloud Console.';
    }
    if (reason === 'rateLimitExceeded' || reason === 'userRateLimitExceeded') {
      return 'Google Drive rate limit reached. Wait a moment and sync again.';
    }
    if (reason === 'insufficientFilePermissions') {
      return 'That folder is not shared publicly. In Drive, open the folder, choose Share, then set "Anyone with the link" to Viewer.';
    }
  }
  if (status === 404) {
    return 'Google Drive could not find that folder. Check the link is correct and still shared.';
  }
  if (status === 401) {
    return 'The Google Drive API key was rejected. Check GOOGLE_DRIVE_API_KEY.';
  }
  return `Google Drive returned HTTP ${status}.`;
}

async function driveFetch(
  url: string,
  init: RequestInit,
  attempt = 0
): Promise<Response> {
  const response = await fetch(url, init);

  // Retry transient throttling with exponential backoff. Drive documents 429
  // `rateLimitExceeded` and 403 `userRateLimitExceeded` as the signals.
  const retryable = response.status === 429 || response.status === 503;
  if (retryable && attempt < 2) {
    const delay = 500 * 2 ** attempt;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return driveFetch(url, init, attempt + 1);
  }

  return response;
}

/**
 * List the direct children of a public folder, following pagination.
 *
 * Sub-folders are skipped rather than recursed into: an album is one flat
 * folder, and recursion would make a single sync unpredictable in cost.
 */
export async function listFolderFiles(folderId: string): Promise<DriveFileMetadata[]> {
  const key = requireApiKey();
  const files: DriveFileMetadata[] = [];
  let pageToken = '';

  for (let page = 0; page < MAX_PAGES; page += 1) {
    // URLSearchParams performs the encoding, so the query is passed raw.
    // Encoding it first and then handing it here double-encodes the value and
    // Drive answers with an opaque HTTP 400.
    const params = new URLSearchParams({
      key,
      q: `'${folderId}' in parents and trashed = false`,
      pageSize: String(PAGE_SIZE),
      orderBy: 'folder,name_natural',
      fields: 'nextPageToken,files(id,name,mimeType,size,modifiedTime)',
    });
    if (pageToken) {
      params.set('pageToken', pageToken);
    }

    const response = await driveFetch(`${DRIVE_API}/files?${params}`, {
      headers: { Accept: 'application/json' },
    });
    const text = await response.text();

    if (!response.ok) {
      throw new ValidationError(describeDriveError(response.status, text));
    }

    let parsed: { files?: Record<string, unknown>[]; nextPageToken?: string };
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new ValidationError('Google Drive returned an unreadable response.');
    }

    for (const file of parsed.files || []) {
      const mimeType = String(file.mimeType || '');
      if (mimeType === FOLDER_MIME) {
        continue;
      }
      files.push({
        id: String(file.id),
        name: String(file.name || ''),
        mimeType,
        sizeBytes: Number(file.size || 0),
        modifiedTime: String(file.modifiedTime || ''),
        isImage: mimeType.startsWith('image/'),
        isVideo: mimeType.startsWith('video/'),
      });
    }

    if (!parsed.nextPageToken) {
      break;
    }
    pageToken = parsed.nextPageToken;
  }

  return files;
}

/**
 * Download a single Drive file's bytes. Used only for videos.
 *
 * Callers must check `sizeBytes` against their own limit first: this buffers
 * the whole body, which is fine for the capped video sizes we accept but would
 * not be for an arbitrary file.
 */
export async function downloadDriveFile(
  fileId: string,
  expectedBytes: number
): Promise<{ buffer: Buffer; mimeType: string }> {
  const key = requireApiKey();
  const url = `${DRIVE_API}/files/${encodeURIComponent(fileId)}?alt=media&key=${key}`;

  const response = await driveFetch(url, { headers: { Accept: '*/*' } });
  if (!response.ok) {
    const text = await response.text();
    throw new ValidationError(describeDriveError(response.status, text));
  }

  const mimeType = response.headers.get('content-type') || '';
  const buffer = Buffer.from(await response.arrayBuffer());

  // Trust the header over the listing metadata when they disagree.
  const declared = Number(response.headers.get('content-length') || 0);
  if (!declared && expectedBytes && buffer.byteLength !== expectedBytes) {
    throw new ValidationError('Drive returned a truncated file. Try syncing again.');
  }
  if (declared && buffer.byteLength !== declared) {
    throw new ValidationError('Drive returned a truncated file. Try syncing again.');
  }

  return { buffer, mimeType };
}