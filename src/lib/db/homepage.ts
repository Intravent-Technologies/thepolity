import {
  getSupabaseAdminClient,
  isSupabaseConfigured,
  localJsonFilePath,
  readLocalJson,
  writeLocalJson,
} from './config';
import type { HomepageImage } from './types';

const FILE = localJsonFilePath('homepage-images.json');

export async function getHomepageImages(): Promise<HomepageImage[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await getSupabaseAdminClient()
        .from('homepage_images')
        .select('id, section, image_url');

      if (error) throw error;
      return (data || []).map((row) => ({
        id: row.id,
        section: row.section,
        imageUrl: row.image_url,
      }));
    } catch (error) {
      console.error('[DB] Homepage images via Supabase failed, using local fallback:', error);
    }
  }

  return readLocalJson<HomepageImage>(FILE);
}

export async function saveHomepageImage(section: string, imageUrl: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabaseAdminClient()
      .from('homepage_images')
      .upsert(
        { id: section, section, image_url: imageUrl, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );

    if (error) throw error;
    return;
  }

  const images = readLocalJson<HomepageImage>(FILE);
  const existing = images.find((img) => img.section === section);
  const entry: HomepageImage =
    existing ? { ...existing, imageUrl } : { id: section, section, imageUrl };

  const index = images.findIndex((img) => img.section === section);
  if (index >= 0) {
    images[index] = entry;
  } else {
    images.unshift(entry);
  }
  writeLocalJson(FILE, images);
}

export async function deleteHomepageImage(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabaseAdminClient()
      .from('homepage_images')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return;
  }

  const images = readLocalJson<HomepageImage>(FILE);
  writeLocalJson(FILE, images.filter((img) => img.id !== id));
}