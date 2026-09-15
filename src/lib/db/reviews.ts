import {
  getSupabaseAdminClient,
  isSupabaseConfigured,
  localJsonFilePath,
  readLocalJson,
  writeLocalJson,
} from './config';
import type { Review } from './types';

const FILE = localJsonFilePath('reviews.json');
const SELECT = 'id, name, role, content, rating';

export async function getReviews(): Promise<Review[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('reviews')
      .select(SELECT)
      .order('id', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  return readLocalJson<Review>(FILE).sort((a, b) =>
    a.id < b.id ? 1 : -1
  );
}

export async function addReview(
  review: Omit<Review, 'id'>
): Promise<Review> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('reviews')
      .insert({
        name: review.name,
        role: review.role,
        content: review.content,
        rating: review.rating,
      })
      .select(SELECT)
      .single();

    if (error) throw error;
    return data;
  }

  const reviews = readLocalJson<Review>(FILE);
  const next: Review = { ...review, id: Date.now().toString() };
  reviews.unshift(next);
  writeLocalJson(FILE, reviews);
  return next;
}

export async function deleteReview(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabaseAdminClient()
      .from('reviews')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return;
  }

  const reviews = readLocalJson<Review>(FILE);
  writeLocalJson(FILE, reviews.filter((r) => r.id !== id));
}