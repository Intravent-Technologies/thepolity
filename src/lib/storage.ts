import fs from 'fs';
import path from 'path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

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
 * Only `title` is guaranteed: a curated case study fills in `client` and
 * `description`, a loose media item may carry only `videoUrl`, and `image` may
 * be empty for a video with no poster.
 *
 * These are `string` rather than `string | undefined` because the validation
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
   */
  directory: 'work' | 'gallery';
}): Promise<{ url: string; filename: string }> {
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
  };
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
