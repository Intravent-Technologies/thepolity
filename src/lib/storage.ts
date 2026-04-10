import fs from 'fs';
import path from 'path';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'thepolity-media';

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  createdAt: string;
}

let supabaseClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function getSupabaseAdminClient(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase is not configured');
  }

  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
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

function portfolioFilePath() {
  return path.join(DATA_DIR, 'portfolio.json');
}

function galleryFilePath() {
  return path.join(DATA_DIR, 'gallery.json');
}

function readLocalJson<T>(filePath: string): T[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T[];
}

function writeLocalJson<T>(filePath: string, items: T[]): void {
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('id, title, description, image, category, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image: item.image,
      category: item.category,
      createdAt: item.created_at,
    }));
  }

  return readLocalJson<PortfolioItem>(portfolioFilePath()).sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('gallery_items')
      .select('id, title, type, url, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map((item) => ({
      id: item.id,
      title: item.title,
      type: item.type,
      url: item.url,
      createdAt: item.created_at,
    }));
  }

  return readLocalJson<GalleryItem>(galleryFilePath()).sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
}

export async function addPortfolioItem(
  item: Omit<PortfolioItem, 'id' | 'createdAt'>
): Promise<PortfolioItem> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('portfolio_items')
      .insert({
        title: item.title,
        description: item.description,
        image: item.image,
        category: item.category,
      })
      .select('id, title, description, image, category, created_at')
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      image: data.image,
      category: data.category,
      createdAt: data.created_at,
    };
  }

  const items = readLocalJson<PortfolioItem>(portfolioFilePath());
  const newItem: PortfolioItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  writeLocalJson(portfolioFilePath(), items);
  return newItem;
}

export async function addGalleryItem(
  item: Omit<GalleryItem, 'id' | 'createdAt'>
): Promise<GalleryItem> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('gallery_items')
      .insert({
        title: item.title,
        type: item.type,
        url: item.url,
      })
      .select('id, title, type, url, created_at')
      .single();

    if (error) {
      throw error;
    }

    return {
      id: data.id,
      title: data.title,
      type: data.type,
      url: data.url,
      createdAt: data.created_at,
    };
  }

  const items = readLocalJson<GalleryItem>(galleryFilePath());
  const newItem: GalleryItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  items.unshift(newItem);
  writeLocalJson(galleryFilePath(), items);
  return newItem;
}

export async function deletePortfolioItem(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { data: item, error: fetchError } = await supabase
      .from('portfolio_items')
      .select('image')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
    if (error) {
      throw error;
    }

    await deleteUploadedAsset(item?.image);
    return;
  }

  const items = readLocalJson<PortfolioItem>(portfolioFilePath());
  const itemToDelete = items.find((item) => item.id === id);
  writeLocalJson(
    portfolioFilePath(),
    items.filter((item) => item.id !== id)
  );
  await deleteUploadedAsset(itemToDelete?.image);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { data: item, error: fetchError } = await supabase
      .from('gallery_items')
      .select('url')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    const { error } = await supabase.from('gallery_items').delete().eq('id', id);
    if (error) {
      throw error;
    }

    await deleteUploadedAsset(item?.url);
    return;
  }

  const items = readLocalJson<GalleryItem>(galleryFilePath());
  const itemToDelete = items.find((item) => item.id === id);
  writeLocalJson(
    galleryFilePath(),
    items.filter((item) => item.id !== id)
  );
  await deleteUploadedAsset(itemToDelete?.url);
}

export async function uploadMediaFile(options: {
  buffer: Buffer;
  contentType: string;
  filename: string;
  directory: 'portfolio' | 'gallery';
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

  const normalizedPath = assetUrl.replace(/^\/+/, '').split('/').join(path.sep);
  const fullPath = path.join(process.cwd(), 'public', normalizedPath);

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
