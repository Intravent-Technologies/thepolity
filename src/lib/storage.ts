import fs from 'fs';
import path from 'path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { WorkAlbum, WorkAlbumMedia, WorkAlbumMediaKind, WorkProject } from '@/lib/work-types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'thepolity-media';

console.log('[Storage] Environment check:', {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET',
  SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET'
});

let DATA_DIR: string;
let UPLOADS_DIR: string;

try {
/**
 * Content store location. Deliberately outside `public/`: files under
 * `public/` are served verbatim by Next, which would expose every published
 * record at /data/*.json. Uploads stay in public/ because they must be
 * fetchable by the browser.
 */
DATA_DIR = path.join(process.cwd(), '.data');
UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch {
  // Read-only filesystem (typical on serverless). Callers fall back to Supabase.
  DATA_DIR = '';
  UPLOADS_DIR = '';
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
}

/**
 * The single showcase entity, absorbing the old portfolio and gallery records.
 * The shape now lives in `@/lib/work-types` so client components can import it
 * without pulling in this module's filesystem and Supabase dependencies. It is
 * re-exported here because server callers already import it from storage.
 */
export type { WorkProject, WorkAlbum, WorkAlbumMedia, WorkAlbumMediaKind } from '@/lib/work-types';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface HomepageImage {
  id: string;
  section: string;
  imageUrl: string;
}

function homepageImagesFilePath(): string {
  return path.join(DATA_DIR, 'homepage-images.json');
}

let supabaseClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabaseAdminClient(): SupabaseClient {
  // Allow connection even without service key - for read operations
  if (!SUPABASE_URL) {
    console.log('[Storage] Missing URL');
    throw new Error('Supabase URL is not configured');
  }

  // Use provided key, or empty string as fallback (will fail gracefully)
  const key = SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!supabaseClient) {
    console.log('[Storage] Creating Supabase client for:', SUPABASE_URL, 'Key present:', !!key);
    supabaseClient = createClient(SUPABASE_URL, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return supabaseClient;
}

function getPublicMediaUrl(storagePath: string): string {
  const supabase = getSupabaseAdminClient();
  const { data } = supabase.storage.from(SUPABASE_STORAGE_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

function blogFilePath() {
  return path.join(DATA_DIR, 'blog.json');
}

function workFilePath() {
  return path.join(DATA_DIR, 'work.json');
}

function teamFilePath() {
  return path.join(DATA_DIR, 'team.json');
}

function reviewsFilePath() {
  return path.join(DATA_DIR, 'reviews.json');
}

function readLocalJson<T>(filePath: string): T[] {
  if (!DATA_DIR || !filePath) {
    console.error('[Storage] Local storage called but DATA_DIR not available');
    throw new Error('Local storage not available in serverless. Use Supabase.');
  }
  if (!fs.existsSync(filePath)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T[];
}

function writeLocalJson<T>(filePath: string, items: T[]): void {
  if (!DATA_DIR || !filePath) {
    console.error('[Storage] Local storage called but DATA_DIR not available');
    throw new Error('Local storage not available in serverless. Use Supabase.');
  }
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
}

type HomepageImageRow = {
  id: string;
  section: string;
  image_url: string;
};

function toHomepageImage(row: HomepageImageRow): HomepageImage {
  return { id: row.id, section: row.section, imageUrl: row.image_url };
}

export async function getHomepageImages(): Promise<HomepageImage[]> {
  if (!isSupabaseConfigured()) {
    return readLocalJson<HomepageImage>(homepageImagesFilePath());
  }

  const { data, error } = await getSupabaseAdminClient()
    .from('homepage_images')
    .select('id, section, image_url');

  if (error || !data) {
    console.error('[Storage] homepage_images read failed:', error?.message);
    return readLocalJson<HomepageImage>(homepageImagesFilePath());
  }

  return (data as HomepageImageRow[]).map(toHomepageImage);
}

/**
 * Persist a homepage image.
 *
 * Single-image sections keep exactly one row per section, so a new upload
 * replaces the previous one. Slideshow sections hold an ordered set, so each
 * upload inserts a new row with its own id instead of overwriting the first.
 */
export async function saveHomepageImage(
  section: string,
  imageUrl: string,
  { multi = false }: { multi?: boolean } = {}
): Promise<void> {
  if (!isSupabaseConfigured()) {
    const items = readLocalJson<HomepageImage>(homepageImagesFilePath());
    const id = multi ? `${section}:${crypto.randomUUID()}` : section;
    const kept = multi ? items : items.filter((item) => item.section !== section);
    writeLocalJson(homepageImagesFilePath(), [
      { id, section, imageUrl },
      ...kept,
    ]);
    return;
  }

  const supabase = getSupabaseAdminClient();

  if (multi) {
    const { error } = await supabase
      .from('homepage_images')
      .insert({
        id: `${section}:${crypto.randomUUID()}`,
        section,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      });
    if (error) {
      throw error;
    }
    return;
  }

  const { data: existing, error: lookupError } = await supabase
    .from('homepage_images')
    .select('id')
    .eq('section', section)
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    throw lookupError;
  }

  if (existing) {
    const { error } = await supabase
      .from('homepage_images')
      .update({ image_url: imageUrl, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
    if (error) {
      throw error;
    }
    return;
  }

  const { error } = await supabase
    .from('homepage_images')
    .insert({ id: section, section, image_url: imageUrl });
  if (error) {
    throw error;
  }
}

export async function deleteHomepageImage(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabaseAdminClient()
      .from('homepage_images')
      .delete()
      .eq('id', id);
    if (error) {
      throw error;
    }
    return;
  }

  const items = readLocalJson<HomepageImage>(homepageImagesFilePath());
  writeLocalJson(
    homepageImagesFilePath(),
    items.filter((item) => item.id !== id)
  );
}

export async function uploadMediaFile(options: {
  buffer: Buffer;
  contentType: string;
  filename: string;
  /**
   * Storage subdirectory. 'work' holds showcase media. 'gallery' is retained
   * for homepage images, which the upload route has always filed there; the
   * name is historical and moving it would orphan existing uploads.
   * 'albums' holds videos mirrored out of Google Drive during a sync.
   */
  directory: 'work' | 'gallery' | 'albums';
}): Promise<{ url: string; filename: string; storagePath: string }> {
  const safeName = options.filename.replace(/[^a-zA-Z0-9.\-_]/g, '-');
  const filename = `${Date.now()}-${safeName}`;

  if (isSupabaseConfigured()) {
    const storagePath = `${options.directory}/${filename}`;
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.storage
      .from(SUPABASE_STORAGE_BUCKET)
      .upload(storagePath, options.buffer, {
        contentType: options.contentType,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    return {
      filename,
      url: getPublicMediaUrl(storagePath),
      storagePath,
    };
  }

  const uploadDir = path.join(UPLOADS_DIR, options.directory);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, options.buffer);

  return {
    filename,
    url: `/uploads/${options.directory}/${filename}`,
    storagePath: `${options.directory}/${filename}`,
  };
}

/**
 * Remove a stored asset by its public URL.
 *
 * Exposed for album syncs: replacing a mirrored video must delete the file it
 * displaces, and that cleanup happens in the sync route rather than in
 * `saveWorkAlbumMedia`. The helper below stays module-private so ordinary
 * callers cannot remove arbitrary assets.
 */
export async function deleteStoredAsset(assetUrl?: string): Promise<void> {
  return deleteUploadedAsset(assetUrl);
}

async function deleteUploadedAsset(assetUrl?: string): Promise<void> {
  if (!assetUrl) {
    return;
  }

  if (isSupabaseConfigured()) {
    const storagePath = getSupabaseStoragePath(assetUrl);
    if (!storagePath) {
      return;
    }

    const supabase = getSupabaseAdminClient();
    await supabase.storage.from(SUPABASE_STORAGE_BUCKET).remove([storagePath]);
    return;
  }

  if (!assetUrl.startsWith('/uploads/')) {
    return;
  }

  // Resolve against UPLOADS_DIR and confine the unlink to that directory so a
  // crafted assetUrl cannot traverse out via "../" segments.
  const relativePath = assetUrl.slice('/uploads/'.length);
  const uploadsRoot = path.resolve(UPLOADS_DIR);
  const fullPath = path.resolve(uploadsRoot, relativePath);

  if (!fullPath.startsWith(uploadsRoot + path.sep)) {
    return;
  }

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}

function getSupabaseStoragePath(assetUrl: string): string | null {
  try {
    const url = new URL(assetUrl);
    const marker = `/storage/v1/object/public/${SUPABASE_STORAGE_BUCKET}/`;
    const index = url.pathname.indexOf(marker);
    if (index === -1) {
      return null;
    }

    return decodeURIComponent(url.pathname.slice(index + marker.length));
  } catch {
    return null;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    console.log('[Storage] Fetching blog posts from Supabase...');
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, category, date, excerpt, image')
      .order('date', { ascending: false });

    if (error) {
      console.error('[Storage] Blog fetch error:', error);
      throw error;
    }
    console.log('[Storage] Blog fetch success, count:', data?.length);

    return data || [];
  }

  return readLocalJson<BlogPost>(blogFilePath()).sort((a, b) =>
    a.date < b.date ? 1 : -1
  );
}

export async function addBlogPost(
  post: Omit<BlogPost, 'id'>
): Promise<BlogPost> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    console.log('[Storage] Adding blog post:', post.title);
    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title: post.title,
        category: post.category,
        date: post.date,
        excerpt: post.excerpt,
        image: post.image,
      })
      .select('id, title, category, date, excerpt, image')
      .single();

    if (error) {
      console.error('[Storage] Blog insert error:', error);
      throw error;
    }
    console.log('[Storage] Blog insert success:', data);

    return data;
  }

  const posts = readLocalJson<BlogPost>(blogFilePath());
  const newPost: BlogPost = {
    ...post,
    id: Date.now().toString(),
  };
  posts.unshift(newPost);
  writeLocalJson(blogFilePath(), posts);
  return newPost;
}

export async function deleteBlogPost(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) {
      throw error;
    }
    return;
  }

  const posts = readLocalJson<BlogPost>(blogFilePath());
  writeLocalJson(
    blogFilePath(),
    posts.filter((post) => post.id !== id)
  );
}

/**
 * Normalise a work_projects row into the camelCase shape the app uses. Nullable
 * columns come back as `null` from Postgres, which the local JSON path stores
 * as `''`; both are normalised to `''` here so callers see one consistent
 * falsy value.
 */
function mapWorkRow(row: Record<string, unknown>): WorkProject {
  return {
    id: String(row.id),
    title: row.title ? String(row.title) : '',
    category: row.category ? String(row.category) : '',
    client: row.client ? String(row.client) : '',
    description: row.description ? String(row.description) : '',
    image: row.image ? String(row.image) : '',
    videoUrl: row.video_url ? String(row.video_url) : '',
    createdAt: row.created_at ? String(row.created_at) : '',
  };
}

const WORK_COLUMNS = 'id, title, category, client, description, image, video_url, created_at';

export async function getWorkProjects(): Promise<WorkProject[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('work_projects')
      .select(WORK_COLUMNS)
      // Newest first. This table previously had no created_at and was ordered by
      // `id`, a uuid, which produced an arbitrary order.
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map((row) => mapWorkRow(row as Record<string, unknown>));
  }

  return readLocalJson<WorkProject>(workFilePath()).sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
}

export async function addWorkProject(
  project: Omit<WorkProject, 'id' | 'createdAt'>
): Promise<WorkProject> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('work_projects')
      .insert({
        title: project.title,
        category: project.category,
        client: project.client,
        description: project.description,
        image: project.image,
        video_url: project.videoUrl,
      })
      .select(WORK_COLUMNS)
      .single();

    if (error) {
      throw error;
    }

    return mapWorkRow(data as Record<string, unknown>);
  }

  const projects = readLocalJson<WorkProject>(workFilePath());
  const newProject: WorkProject = {
    ...project,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  projects.unshift(newProject);
  writeLocalJson(workFilePath(), projects);
  return newProject;
}

/**
 * Replace a work project's fields in place. `id` and `createdAt` are preserved
 * from the existing record, so ordering does not jump when an item is edited.
 *
 * An asset that this edit replaces is deleted, matching `deleteWorkProject`.
 * Without that, every correction of a cover image would leak the old file.
 */
export async function updateWorkProject(
  id: string,
  patch: Omit<WorkProject, 'id' | 'createdAt'>
): Promise<WorkProject> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { data: existing, error: fetchError } = await supabase
      .from('work_projects')
      .select('image, video_url')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (!existing) {
      throw new Error('Work project not found');
    }

    const { data, error } = await supabase
      .from('work_projects')
      .update({
        title: patch.title,
        category: patch.category,
        client: patch.client,
        description: patch.description,
        image: patch.image,
        video_url: patch.videoUrl,
      })
      .eq('id', id)
      .select(WORK_COLUMNS)
      .single();

    if (error) {
      throw error;
    }

    const previous = existing as Record<string, unknown>;
    if (previous.image && previous.image !== patch.image) {
      await deleteUploadedAsset(String(previous.image));
    }
    if (previous.video_url && previous.video_url !== patch.videoUrl) {
      await deleteUploadedAsset(String(previous.video_url));
    }

    return mapWorkRow(data as Record<string, unknown>);
  }

  const projects = readLocalJson<WorkProject>(workFilePath());
  const index = projects.findIndex((project) => project.id === id);
  if (index === -1) {
    throw new Error('Work project not found');
  }

  const previous = projects[index];
  const updated: WorkProject = {
    ...previous,
    ...patch,
    id: previous.id,
    createdAt: previous.createdAt,
  };
  projects[index] = updated;
  writeLocalJson(workFilePath(), projects);

  if (previous.image && previous.image !== updated.image) {
    await deleteUploadedAsset(previous.image);
  }
  if (previous.videoUrl && previous.videoUrl !== updated.videoUrl) {
    await deleteUploadedAsset(previous.videoUrl);
  }
  return updated;
}

export async function deleteWorkProject(id: string): Promise<void> {
  // Both assets are removed with the record. This project had no cleanup
  // before it absorbed the portfolio and gallery entities, both of which did
  // delete their uploaded file, so this preserves that behaviour.
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { data: item, error: fetchError } = await supabase
      .from('work_projects')
      .select('image, video_url')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    const { error } = await supabase.from('work_projects').delete().eq('id', id);
    if (error) {
      throw error;
    }

    await deleteUploadedAsset(item?.image);
    await deleteUploadedAsset(item?.video_url);
    return;
  }

  const projects = readLocalJson<WorkProject>(workFilePath());
  const toDelete = projects.find((project) => project.id === id);
  writeLocalJson(
    workFilePath(),
    projects.filter((project) => project.id !== id)
  );
  await deleteUploadedAsset(toDelete?.image);
  await deleteUploadedAsset(toDelete?.videoUrl);
}

// ---------------------------------------------------------------------------
// Drive-backed albums
//
// These mirror the `work_albums` / `work_album_media` tables. Remember the
// asymmetry that drives the whole design: images carry only a `drive_file_id`
// and their URL is derived at render time, while videos are mirrored into
// storage and carry a real `publicUrl`.
// ---------------------------------------------------------------------------

function albumsFilePath() {
  return path.join(DATA_DIR, 'work-albums.json');
}

function albumMediaFilePath() {
  return path.join(DATA_DIR, 'work-album-media.json');
}

/**
 * A definition of an album as authored content: what it is called and which
 * Drive folder holds its media. This is the part that cannot be recovered from
 * Google, so it is committed alongside the code rather than left in `.data/`,
 * which is gitignored.
 */
interface AlbumSeed {
  slug: string;
  title: string;
  category: string;
  description: string;
  driveFolderUrl: string;
}

/**
 * Reads album definitions out of `seed/albums.json`, which is committed.
 *
 * Only definitions live there. Photo metadata deliberately does not: the media
 * rows are all reproducible from the Drive folder by syncing, so seeding them
 * would put several dozen Drive file ids in the repository for no benefit.
 */
function readAlbumSeeds(): AlbumSeed[] {
  const seedPath = path.join(process.cwd(), 'seed', 'albums.json');
  if (!fs.existsSync(seedPath)) return [];
  try {
    const parsed = JSON.parse(fs.readFileSync(seedPath, 'utf-8')) as {
      albums?: AlbumSeed[];
    };
    return Array.isArray(parsed.albums) ? parsed.albums : [];
  } catch (error) {
    console.error('[Storage] Could not read seed/albums.json', error);
    return [];
  }
}

/** Extracts the bare folder id from a Drive URL, matching the sync route. */
function folderIdFromUrl(url: string): string {
  const match = url.match(/folders\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : '';
}

/**
 * Returns the local album store, seeding it from `seed/albums.json` the first
 * time it is read while still empty.
 *
 * Seeding only fills an empty store. An album added or edited in the admin is
 * therefore never reverted, and `.data/` keeps working exactly as before for
 * anyone who never runs a seeded clone. Seeded ids are derived from the slug so
 * a fresh clone produces the same ids on every machine.
 */
function readLocalAlbums(): WorkAlbum[] {
  const filePath = albumsFilePath();
  const existing = readLocalJson<WorkAlbum>(filePath);
  if (existing.length > 0) return existing;

  const seeds = readAlbumSeeds();
  if (seeds.length === 0) return existing;

  const seeded: WorkAlbum[] = seeds.map((seed, index) => ({
    id: `seed-${seed.slug}`,
    slug: seed.slug,
    title: seed.title,
    category: seed.category,
    description: seed.description,
    coverDriveFileId: '',
    driveFolderId: folderIdFromUrl(seed.driveFolderUrl),
    driveFolderUrl: seed.driveFolderUrl,
    photoCount: 0,
    videoCount: 0,
    lastSyncedAt: '',
    createdAt: new Date(Date.now() - index * 1000).toISOString(),
  }));

  writeLocalJson(filePath, seeded);
  console.log(
    `[Storage] Seeded ${seeded.length} album definitions from seed/albums.json. Press Sync in the admin to pull their photos.`
  );
  return seeded;
}

/**
 * Local ids must be unique within a single sync, where many rows are created in
 * one tick. `Date.now()` alone collides there, so a random suffix is added.
 */
function localId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const ALBUM_COLUMNS =
  'id, slug, title, category, description, cover_drive_file_id, drive_folder_id, drive_folder_url, photo_count, video_count, last_synced_at, created_at';

const ALBUM_MEDIA_COLUMNS =
  'id, album_id, drive_file_id, filename, kind, mime_type, size_bytes, storage_path, public_url, sort_order, created_at';

function mapAlbumRow(row: Record<string, unknown>): WorkAlbum {
  return {
    id: String(row.id),
    slug: row.slug ? String(row.slug) : '',
    title: row.title ? String(row.title) : '',
    category: row.category ? String(row.category) : '',
    description: row.description ? String(row.description) : '',
    coverDriveFileId: row.cover_drive_file_id ? String(row.cover_drive_file_id) : '',
    driveFolderId: row.drive_folder_id ? String(row.drive_folder_id) : '',
    driveFolderUrl: row.drive_folder_url ? String(row.drive_folder_url) : '',
    photoCount: Number(row.photo_count || 0),
    videoCount: Number(row.video_count || 0),
    lastSyncedAt: row.last_synced_at ? String(row.last_synced_at) : '',
    createdAt: row.created_at ? String(row.created_at) : '',
  };
}

function mapAlbumMediaRow(row: Record<string, unknown>): WorkAlbumMedia {
  return {
    id: String(row.id),
    albumId: String(row.album_id),
    driveFileId: row.drive_file_id ? String(row.drive_file_id) : '',
    filename: row.filename ? String(row.filename) : '',
    kind: (row.kind === 'video' ? 'video' : 'image') as WorkAlbumMediaKind,
    mimeType: row.mime_type ? String(row.mime_type) : '',
    sizeBytes: Number(row.size_bytes || 0),
    storagePath: row.storage_path ? String(row.storage_path) : '',
    publicUrl: row.public_url ? String(row.public_url) : '',
    sortOrder: Number(row.sort_order || 0),
  };
}

export async function getWorkAlbums(): Promise<WorkAlbum[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('work_albums')
      .select(ALBUM_COLUMNS)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }
    return (data || []).map((row) => mapAlbumRow(row as Record<string, unknown>));
  }

  return readLocalAlbums().sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
}

export async function getWorkAlbumById(id: string): Promise<WorkAlbum | null> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('work_albums')
      .select(ALBUM_COLUMNS)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw error;
    }
    return data ? mapAlbumRow(data as Record<string, unknown>) : null;
  }

  return readLocalAlbums().find((album) => album.id === id) || null;
}

export async function getWorkAlbumBySlug(slug: string): Promise<WorkAlbum | null> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('work_albums')
      .select(ALBUM_COLUMNS)
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      throw error;
    }
    return data ? mapAlbumRow(data as Record<string, unknown>) : null;
  }

  return readLocalAlbums().find((album) => album.slug === slug) || null;
}

export async function getWorkAlbumMedia(albumId: string): Promise<WorkAlbumMedia[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('work_album_media')
      .select(ALBUM_MEDIA_COLUMNS)
      .eq('album_id', albumId)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }
    return (data || []).map((row) => mapAlbumMediaRow(row as Record<string, unknown>));
  }

  return readLocalJson<WorkAlbumMedia>(albumMediaFilePath())
    .filter((item) => item.albumId === albumId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function addWorkAlbum(
  album: Omit<WorkAlbum, 'id' | 'createdAt' | 'photoCount' | 'videoCount' | 'lastSyncedAt'> &
    Partial<Pick<WorkAlbum, 'photoCount' | 'videoCount' | 'lastSyncedAt'>>
): Promise<WorkAlbum> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('work_albums')
      .insert({
        slug: album.slug,
        title: album.title,
        category: album.category,
        description: album.description,
        cover_drive_file_id: album.coverDriveFileId,
        drive_folder_id: album.driveFolderId,
        drive_folder_url: album.driveFolderUrl,
        photo_count: album.photoCount || 0,
        video_count: album.videoCount || 0,
        last_synced_at: album.lastSyncedAt || null,
      })
      .select(ALBUM_COLUMNS)
      .single();

    if (error) {
      throw error;
    }
    return mapAlbumRow(data as Record<string, unknown>);
  }

  const albums = readLocalJson<WorkAlbum>(albumsFilePath());
  const created: WorkAlbum = {
    ...album,
    id: localId(),
    photoCount: album.photoCount || 0,
    videoCount: album.videoCount || 0,
    lastSyncedAt: album.lastSyncedAt || '',
    createdAt: new Date().toISOString(),
  };
  albums.unshift(created);
  writeLocalJson(albumsFilePath(), albums);
  return created;
}

export async function updateWorkAlbum(
  id: string,
  patch: Partial<
    Pick<
      WorkAlbum,
      | 'slug'
      | 'title'
      | 'category'
      | 'description'
      | 'coverDriveFileId'
      | 'driveFolderId'
      | 'driveFolderUrl'
      | 'photoCount'
      | 'videoCount'
      | 'lastSyncedAt'
    >
  >
): Promise<WorkAlbum> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('work_albums')
      .update({
        ...(patch.slug !== undefined && { slug: patch.slug }),
        ...(patch.title !== undefined && { title: patch.title }),
        ...(patch.category !== undefined && { category: patch.category }),
        ...(patch.description !== undefined && { description: patch.description }),
        ...(patch.coverDriveFileId !== undefined && {
          cover_drive_file_id: patch.coverDriveFileId,
        }),
        ...(patch.driveFolderId !== undefined && { drive_folder_id: patch.driveFolderId }),
        ...(patch.driveFolderUrl !== undefined && {
          drive_folder_url: patch.driveFolderUrl,
        }),
        ...(patch.photoCount !== undefined && { photo_count: patch.photoCount }),
        ...(patch.videoCount !== undefined && { video_count: patch.videoCount }),
        ...(patch.lastSyncedAt !== undefined && {
          last_synced_at: patch.lastSyncedAt || null,
        }),
      })
      .eq('id', id)
      .select(ALBUM_COLUMNS)
      .single();

    if (error) {
      throw error;
    }
    return mapAlbumRow(data as Record<string, unknown>);
  }

  const albums = readLocalJson<WorkAlbum>(albumsFilePath());
  const index = albums.findIndex((album) => album.id === id);
  if (index === -1) {
    throw new Error('Album not found');
  }
  albums[index] = { ...albums[index], ...patch };
  writeLocalJson(albumsFilePath(), albums);
  return albums[index];
}

/**
 * Replace an album's media with the results of a sync.
 *
 * Rows are keyed on `drive_file_id` (a unique constraint), so re-syncing an
 * unchanged folder updates in place instead of duplicating. Anything that
 * disappeared from the Drive folder is deleted here, and its mirrored video
 * file is removed from storage too, so removing a photo in Drive actually
 * removes it from the site.
 */
export async function saveWorkAlbumMedia(
  albumId: string,
  incoming: Omit<WorkAlbumMedia, 'id' | 'albumId'>[]
): Promise<WorkAlbumMedia[]> {
  const keptIds = new Set(incoming.map((item) => item.driveFileId));

  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();

    const { data: existingRows, error: readError } = await supabase
      .from('work_album_media')
      .select(ALBUM_MEDIA_COLUMNS)
      .eq('album_id', albumId);

    if (readError) {
      throw readError;
    }

    const existing = (existingRows || []).map((row) =>
      mapAlbumMediaRow(row as Record<string, unknown>)
    );

    const payloads = incoming.map((item) => ({
      album_id: albumId,
      drive_file_id: item.driveFileId,
      filename: item.filename,
      kind: item.kind,
      mime_type: item.mimeType,
      size_bytes: item.sizeBytes,
      storage_path: item.storagePath || null,
      public_url: item.publicUrl || null,
      sort_order: item.sortOrder,
    }));

    // Upsert in one statement so a partial failure cannot leave a half-written
    // album. `unique (album_id, drive_file_id)` makes this idempotent.
    if (payloads.length > 0) {
      const { error: upsertError } = await supabase
        .from('work_album_media')
        .upsert(payloads, { onConflict: 'album_id,drive_file_id' });
      if (upsertError) {
        throw upsertError;
      }
    }

    const removed = existing.filter((item) => !keptIds.has(item.driveFileId));
    if (removed.length > 0) {
      const { error: deleteError } = await supabase
        .from('work_album_media')
        .delete()
        .eq(
          'album_id',
          albumId
        )
        .in(
          'drive_file_id',
          removed.map((item) => item.driveFileId)
        );
      if (deleteError) {
        throw deleteError;
      }
      for (const item of removed) {
        await deleteUploadedAsset(item.publicUrl);
      }
    }

    return getWorkAlbumMedia(albumId);
  }

  const all = readLocalJson<WorkAlbumMedia>(albumMediaFilePath());
  const survivors = all.filter(
    (item) => item.albumId !== albumId || keptIds.has(item.driveFileId)
  );
  const removed = all.filter(
    (item) => item.albumId === albumId && !keptIds.has(item.driveFileId)
  );

  const byDriveId = new Map(
    survivors.filter((item) => item.albumId === albumId).map((item) => [item.driveFileId, item])
  );

  for (const item of incoming) {
    const existing = byDriveId.get(item.driveFileId);
    if (existing) {
      existing.filename = item.filename;
      existing.kind = item.kind;
      existing.mimeType = item.mimeType;
      existing.sizeBytes = item.sizeBytes;
      existing.storagePath = item.storagePath || existing.storagePath;
      existing.publicUrl = item.publicUrl || existing.publicUrl;
      existing.sortOrder = item.sortOrder;
    } else {
      survivors.push({
        ...item,
        id: localId(),
        albumId,
      });
    }
  }

  writeLocalJson(albumMediaFilePath(), survivors);

  for (const item of removed) {
    await deleteUploadedAsset(item.publicUrl);
  }

  return survivors
    .filter((item) => item.albumId === albumId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Delete an album, its media rows, and every mirrored video file. Image rows
 * carry no stored file, so there is nothing to remove for them.
 */
export async function deleteWorkAlbum(id: string): Promise<void> {
  const media = await getWorkAlbumMedia(id);

  if (isSupabaseConfigured()) {
    // Media rows cascade from the album, but their mirrored files do not, so
    // collect them first.
    const { error } = await getSupabaseAdminClient().from('work_albums').delete().eq('id', id);
    if (error) {
      throw error;
    }
  } else {
    const albums = readLocalJson<WorkAlbum>(albumsFilePath());
    writeLocalJson(
      albumsFilePath(),
      albums.filter((album) => album.id !== id)
    );
    const all = readLocalJson<WorkAlbumMedia>(albumMediaFilePath());
    writeLocalJson(
      albumMediaFilePath(),
      all.filter((item) => item.albumId !== id)
    );
  }

  for (const item of media) {
    await deleteUploadedAsset(item.publicUrl);
  }
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('team_members')
      .select('id, name, role, bio, image')
      .order('id', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  return readLocalJson<TeamMember>(teamFilePath()).sort((a, b) =>
    a.id < b.id ? 1 : -1
  );
}

export async function addTeamMember(
  member: Omit<TeamMember, 'id'>
): Promise<TeamMember> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('team_members')
      .insert({
        name: member.name,
        role: member.role,
        bio: member.bio,
        image: member.image,
      })
      .select('id, name, role, bio, image')
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  const members = readLocalJson<TeamMember>(teamFilePath());
  const newMember: TeamMember = {
    ...member,
    id: Date.now().toString(),
  };
  members.unshift(newMember);
  writeLocalJson(teamFilePath(), members);
  return newMember;
}

export async function deleteTeamMember(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) {
      throw error;
    }
    return;
  }

  const members = readLocalJson<TeamMember>(teamFilePath());
  writeLocalJson(
    teamFilePath(),
    members.filter((member) => member.id !== id)
  );
}

export async function getReviews(): Promise<Review[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('reviews')
      .select('id, name, role, content, rating')
      .order('id', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  return readLocalJson<Review>(reviewsFilePath()).sort((a, b) =>
    a.id < b.id ? 1 : -1
  );
}

export async function addReview(
  review: Omit<Review, 'id'>
): Promise<Review> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        name: review.name,
        role: review.role,
        content: review.content,
        rating: review.rating,
      })
      .select('id, name, role, content, rating')
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  const reviews = readLocalJson<Review>(reviewsFilePath());
  const newReview: Review = {
    ...review,
    id: Date.now().toString(),
  };
  reviews.unshift(newReview);
  writeLocalJson(reviewsFilePath(), reviews);
  return newReview;
}

export async function deleteReview(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    if (error) {
      throw error;
    }
    return;
  }

  const reviews = readLocalJson<Review>(reviewsFilePath());
  writeLocalJson(
    reviewsFilePath(),
    reviews.filter((review) => review.id !== id)
  );
}
