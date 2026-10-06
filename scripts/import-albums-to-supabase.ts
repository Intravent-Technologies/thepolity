/**
 * One-shot import of the local album data into Supabase.
 *
 * The album data lives in .data/*.json, which is gitignored, so a fresh clone
 * only ever gets the three seeded albums with no photographs. This pushes the
 * real albums and their media into Postgres so production matches what is
 * already on screen locally.
 *
 * Uses the service role key over PostgREST, which is all that reading and
 * writing needs. Applying the schema itself does require DDL — see
 * supabase/add-work-albums.sql — but that is a separate, one-time step.
 *
 * Safe to run twice: albums are upserted on their slug and media on
 * (album_id, drive_file_id), so a second run corrects rows rather than
 * duplicating them. Media with no Drive id is skipped, because Postgres treats
 * nulls as equal for a conflict target and these would collide on each other.
 *
 *   npx tsx scripts/import-albums-to-supabase.ts
 */
import fs from 'fs';
import path from 'path';

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!URL_BASE || !KEY) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY first.');
  process.exit(1);
}

const DATA_DIR = path.join(process.cwd(), '.data');

type LocalAlbum = {
  id: string;
  slug: string;
  title: string;
  category: string;
  description: string;
  coverDriveFileId: string;
  coverMediaId: string;
  driveFolderId: string;
  driveFolderUrl: string;
  photoCount: number;
  videoCount: number;
  lastSyncedAt: string;
  createdAt: string;
};

type LocalMedia = {
  id: string;
  albumId: string;
  driveFileId: string;
  filename: string;
  kind: 'image' | 'video';
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  publicUrl: string;
  sortOrder: number;
};

/**
 * PostgREST wants every value as a string on the wire, and its upsert needs to
 * know which columns identify a row.
 */
async function rpc(
  table: string,
  body: unknown,
  onConflict: string,
  prefer: string
): Promise<unknown[]> {
  const res = await fetch(`${URL_BASE}/rest/v1/${table}?on_conflict=${onConflict}`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: `${prefer},return=representation`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`${table}: ${res.status} ${await res.text()}`);
  }
  const text = await res.text();
  return text ? (JSON.parse(text) as unknown[]) : [];
}

async function main() {
  const albums = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'work-albums.json'), 'utf-8')
  ) as LocalAlbum[];
  const media = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, 'work-album-media.json'), 'utf-8')
  ) as LocalMedia[];

  console.log(`importing ${albums.length} albums and ${media.length} media rows\n`);

  // Albums first: the media rows reference them by uuid.
  const insertedAlbums = (await rpc(
    'work_albums',
    albums.map((album) => ({
      slug: album.slug,
      title: album.title,
      category: album.category,
      description: album.description,
      cover_drive_file_id: album.coverDriveFileId || null,
      // Left null on purpose: it points at a row id that only means something
      // once the media below exists, and a slug-keyed upsert cannot know it.
      cover_media_id: null,
      drive_folder_id: album.driveFolderId ?? null,
      drive_folder_url: album.driveFolderUrl,
      photo_count: album.photoCount,
      video_count: album.videoCount,
      last_synced_at: album.lastSyncedAt || null,
      created_at: album.createdAt,
    })),
    'slug',
    'resolution=merge-duplicates'
  )) as { id: string; slug: string }[];

  const uuidBySlug = new Map(insertedAlbums.map((album) => [album.slug, album.id]));
  for (const album of albums) {
    console.log(`  album ${album.slug.padEnd(30)} -> ${uuidBySlug.get(album.slug)}`);
  }

  // The local id is what each media row points at, so it is how the album is
  // matched up. Local ids are timestamps, not uuids, so they cannot be reused
  // as the row id.
  const albumIdByLocalId = new Map(albums.map((album) => [album.id, uuidBySlug.get(album.slug)]));

  const rows = media
    .filter((item) => item.driveFileId !== '')
    .map((item) => {
      const albumId = albumIdByLocalId.get(item.albumId);
      if (!albumId) throw new Error(`media ${item.filename} references an unknown album`);
      return {
        album_id: albumId,
        drive_file_id: item.driveFileId,
        filename: item.filename,
        kind: item.kind,
        mime_type: item.mimeType,
        size_bytes: item.sizeBytes,
        storage_path: item.storagePath || null,
        public_url: item.publicUrl || null,
        sort_order: item.sortOrder,
      };
    });

  const skippedUploads = media.length - rows.length;
  if (skippedUploads > 0) {
    console.log(
      `\n  note: skipping ${skippedUploads} uploaded item(s) — they have no Drive id,\n` +
        '        so they cannot be upserted. Re-upload them in the admin once the\n' +
        '        site is live, or they are already only local.'
    );
  }

  const insertedMedia = await rpc(
    'work_album_media',
    rows,
    'album_id,drive_file_id',
    'resolution=merge-duplicates'
  );
  console.log(`\n  ${insertedMedia.length} media rows written`);

  console.log('\nverify with:');
  console.log('  select title, slug, photo_count, video_count from work_albums order by created_at desc;');
  console.log('  select a.title, count(m.*) from work_albums a left join work_album_media m on m.album_id = a.id group by a.title;');
}

main().catch((error) => {
  console.error('\nimport failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
