import {
  getSupabaseAdminClient,
  isSupabaseConfigured,
  localJsonFilePath,
  readLocalJson,
  writeLocalJson,
} from './config';
import type { BlogPost } from './types';

const FILE = localJsonFilePath('blog.json');
const SELECT = 'id, title, category, date, excerpt, image';

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('blog_posts')
      .select(SELECT)
      .order('date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  return readLocalJson<BlogPost>(FILE).sort((a, b) =>
    a.date < b.date ? 1 : -1
  );
}

export async function addBlogPost(
  post: Omit<BlogPost, 'id'>
): Promise<BlogPost> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabaseAdminClient()
      .from('blog_posts')
      .insert({
        title: post.title,
        category: post.category,
        date: post.date,
        excerpt: post.excerpt,
        image: post.image,
      })
      .select(SELECT)
      .single();

    if (error) throw error;
    return data;
  }

  const posts = readLocalJson<BlogPost>(FILE);
  const next: BlogPost = { ...post, id: Date.now().toString() };
  posts.unshift(next);
  writeLocalJson(FILE, posts);
  return next;
}

export async function deleteBlogPost(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabaseAdminClient()
      .from('blog_posts')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return;
  }

  const posts = readLocalJson<BlogPost>(FILE);
  writeLocalJson(FILE, posts.filter((p) => p.id !== id));
}