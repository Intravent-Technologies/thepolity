import {
  getSupabaseAdminClient,
  isSupabaseConfigured,
  localJsonFilePath,
  readLocalJson,
  writeLocalJson,
} from './config';
import { deleteUploadedAsset } from './uploads';
import type { GalleryItem } from './types';

const FILE = localJsonFilePath('gallery.json');
const SELECT = 'id, title, type, url, created_at';

function mapRow(row: any): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    url: row.url,
    createdAt: row.created_at,
  };
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('gallery_items')
      .select(SELECT)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapRow);
  }

  return readLocalJson<GalleryItem>(FILE).sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
}

export async function addGalleryItem(
  item: Omit<GalleryItem, 'id' | 'createdAt'>
): Promise<GalleryItem> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('gallery_items')
      .insert({ title: item.title, type: item.type, url: item.url })
      .select(SELECT)
      .single();

    if (error) throw error;
    return mapRow(data);
  }

  const items = readLocalJson<GalleryItem>(FILE);
  const next: GalleryItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  items.unshift(next);
  writeLocalJson(FILE, items);
  return next;
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { data: row, error: fetchError } = await supabase
      .from('gallery_items')
      .select('url')
      .eq('id', id)
      .maybeSingle();
    if (fetchError) throw fetchError;

    const { error } = await supabase.from('gallery_items').delete().eq('id', id);
    if (error) throw error;
    await deleteUploadedAsset(row?.url);
    return;
  }

  const items = readLocalJson<GalleryItem>(FILE);
  const target = items.find((i) => i.id === id);
  writeLocalJson(FILE, items.filter((i) => i.id !== id));
  await deleteUploadedAsset(target?.url);
}