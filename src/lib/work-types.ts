/**
 * Shared domain types for the Work showcase and its Drive-backed albums.
 *
 * This module is deliberately free of server-only imports (`fs`, `path`,
 * Supabase) so both client components and server routes can depend on it.
 * Historically `WorkProject` was duplicated across `lib/storage.ts`,
 * `app/(site)/work/page.tsx` and the admin dashboard, and the client copies had
 * already drifted by omitting `createdAt`. One definition, imported everywhere.
 */

/**
 * A single showcase entry: a curated case study or a loose media item.
 *
 * Fields are `string` rather than `string | undefined` because the validation
 * layer normalises a missing optional field to `''`, which is falsy and reads
 * back consistently from both the JSON and Supabase paths.
 */
export interface WorkProject {
  id: string;
  title: string;
  category: string;
  client: string;
  description: string;
  image: string;
  videoUrl: string;
  createdAt: string;
}

export type WorkAlbumMediaKind = 'image' | 'video';

/**
 * One synced item inside an album.
 *
 * The important invariant: for images we persist only the Google Drive file id
 * and never a Google URL. `https://drive.google.com/uc?export=view` has been
 * broken since 2024 and `files.thumbnailLink` is documented as short-lived and
 * unsuitable for direct web use, so the display URL is derived at render time
 * by `drivePhotoUrl()`. Storing the id means a photo can be mirrored into our
 * own storage later without a schema rewrite — it is a data update only.
 *
 * `storagePath` and `publicUrl` are populated for videos only. Photos are
 * loaded straight from Google's CDN, which is free and far cheaper than proxying
 * bytes through this app. Videos are mirrored because Drive marks its media
 * responses `cache-control: private, max-age=0, must-revalidate`, so a
 * live-proxied video would hit Google on every single play and invite the
 * documented `downloadQuotaExceeded` 403s and IP throttling.
 */
export interface WorkAlbumMedia {
  id: string;
  albumId: string;
  driveFileId: string;
  filename: string;
  kind: WorkAlbumMediaKind;
  mimeType: string;
  sizeBytes: number;
  /** Storage object path for mirrored videos; '' for images. */
  storagePath: string;
  /** Public CDN URL for mirrored videos; '' for images. */
  publicUrl: string;
  sortOrder: number;
}

/**
 * An album: a named project whose media lives in a public Google Drive folder.
 *
 * `photoCount`/`videoCount` are denormalised columns refreshed on sync so the
 * album grid renders without walking every media row, and `coverDriveFileId`
 * lets the admin choose which photo represents the album.
 */
export interface WorkAlbum {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  coverDriveFileId: string;
  driveFolderId: string;
  driveFolderUrl: string;
  photoCount: number;
  videoCount: number;
  /** ISO timestamp of the last successful sync, or '' if never synced. */
  lastSyncedAt: string;
  createdAt: string;
}

/** Widths offered to the browser for album photo grids via `srcSet`. */
export const ALBUM_GRID_WIDTHS = [400, 800, 1200, 1600] as const;

/** Width used for the lightbox, where the full detail is worth the bytes. */
export const ALBUM_LIGHTBOX_WIDTH = 2400;

/**
 * Cover width. Album cards sit in a small grid, so a wide cover is wasted bytes.
 */
export const ALBUM_COVER_WIDTH = 1200;

/**
 * Derive a display URL for a photo that stays in Google Drive.
 *
 * `lh3.googleusercontent.com` is Google's image CDN and supports a size
 * parameter, which is why a ~3 MB original becomes ~400 KB at `w1600` while
 * being served by Google rather than by this app.
 *
 * Note this endpoint is undocumented, so callers must tolerate it failing.
 * Render an `onError` fallback and keep `driveFileId` on hand to mirror the
 * image into Supabase if Google ever retires it.
 */
export function drivePhotoUrl(driveFileId: string, width: number): string {
  return `https://lh3.googleusercontent.com/d/${driveFileId}=w${width}`;
}

/**
 * `srcSet` for a Drive-hosted photo. Lets each visitor download exactly one
 * appropriately sized file instead of a single fixed-resolution hero.
 */
export function drivePhotoSrcSet(
  driveFileId: string,
  widths: readonly number[] = ALBUM_GRID_WIDTHS
): string {
  return widths.map((width) => `${drivePhotoUrl(driveFileId, width)} ${width}w`).join(', ');
}