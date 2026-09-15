import {
  getSupabaseAdminClient,
  isSupabaseConfigured,
  localJsonFilePath,
  readLocalJson,
  writeLocalJson,
} from './config';
import { deleteUploadedAsset } from './uploads';
import type { PortfolioItem } from './types';

const FILE = localJsonFilePath('portfolio.json');
const SELECT = 'id, title, description, image, category, created_at';

function mapRow(row: any): PortfolioItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    image: row.image,
    category: row.category,
    createdAt: row.created_at,
  };
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('portfolio_items')
      .select(SELECT)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapRow);
  }

  return readLocalJson<PortfolioItem>(FILE).sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
}

export async function addPortfolioItem(
  item: Omit<PortfolioItem, 'id' | 'createdAt'>
): Promise<PortfolioItem> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('portfolio_items')
      .insert({
        title: item.title,
        description: item.description,
        image: item.image,
        category: item.category,
      })
      .select(SELECT)
      .single();

    if (error) throw error;
    return mapRow(data);
  }

  const items = readLocalJson<PortfolioItem>(FILE);
  const next: PortfolioItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  items.unshift(next);
  writeLocalJson(FILE, items);
  return next;
}

export async function deletePortfolioItem(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdminClient();
    const { data: row, error: fetchError } = await supabase
      .from('portfolio_items')
      .select('image')
      .eq('id', id)
      .maybeSingle();
    if (fetchError) throw fetchError;

    const { error } = await supabase.from('portfolio_items').delete().eq('id', id);
    if (error) throw error;
    await deleteUploadedAsset(row?.image);
    return;
  }

  const items = readLocalJson<PortfolioItem>(FILE);
  const target = items.find((i) => i.id === id);
  writeLocalJson(FILE, items.filter((i) => i.id !== id));
  await deleteUploadedAsset(target?.image);
}