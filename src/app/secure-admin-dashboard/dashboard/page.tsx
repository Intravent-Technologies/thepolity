'use client';

import Image from 'next/image';
import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ExternalLink,
  FileText,
  Images,
  LogOut,
  Pencil,
  Plus,
  Quote,
  RefreshCw,
  Star,
  Trash2,
} from 'lucide-react';
import UploadField from '@/components/UploadField';
import { notify, ToastViewport } from '@/components/admin/Toast';
import { Eyebrow } from '@/components/ui';
import Logo from '@/components/Logo';
import { AnimatePresence, motion } from 'framer-motion';
import type { WorkAlbum } from '@/lib/work-types';
import AlbumEditor from './AlbumEditor';

interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
}

interface Review {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

/**
 * The panel covers exactly three things: photo albums (filled from a Google
 * Drive link), blog posts and reviews. Everything else on the site is either
 * code or seeded data.
 */
type Tab = 'albums' | 'blog' | 'reviews';

const TABS: { key: Tab; label: string; icon: typeof Images }[] = [
  { key: 'albums', label: 'Albums', icon: Images },
  { key: 'blog', label: 'Blog', icon: FileText },
  { key: 'reviews', label: 'Reviews', icon: Star },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('albums');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [counts, setCounts] = useState<Partial<Record<Tab, number>>>({});
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/session', { credentials: 'include' });
      const data = await res.json();
      if (!data.authenticated) {
        router.replace('/secure-admin-dashboard');
      } else {
        setIsAuthenticated(true);
      }
    } catch {
      router.replace('/secure-admin-dashboard');
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Sidebar badges: one cheap GET per section, only once the session is known
     good. A failure just leaves the badges blank — the managers still load. */
  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    const readCount = async (url: string) => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        return Array.isArray(data) ? data.length : 0;
      } catch {
        return 0;
      }
    };
    Promise.all([
      readCount('/api/work/albums'),
      readCount('/api/blog'),
      readCount('/api/reviews'),
    ]).then(([albums, blog, reviews]) => {
      if (!cancelled) setCounts({ albums, blog, reviews });
    });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    router.push('/secure-admin-dashboard');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div
          role="status"
          aria-label="Checking your session"
          className="size-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <ToastViewport />

      {/* The sidebar is present at every width: an icon rail on phones, the
          full labelled panel from sm up. */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[4.5rem] flex-col border-r border-navy-600 bg-navy-700 sm:w-64">
        <div className="px-4 pb-2 pt-7 sm:px-6">
          {/* The brand block points back into the dashboard, not the public
              site: "View site" below is the deliberate way out. */}
          <Link
            href="/secure-admin-dashboard/dashboard"
            aria-label="Admin dashboard"
            className="inline-flex items-center gap-3"
          >
            <Logo variant="inverse" className="h-6" />
            <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden="true" />
            <span className="tp-label hidden text-brand-300 sm:inline">Admin</span>
          </Link>
        </div>

        <nav className="mt-8 flex-1 space-y-1 px-2 sm:px-3" aria-label="Content sections">
          {TABS.map((item) => {
            const Icon = item.icon;
            const active = tab === item.key;
            const count = counts[item.key];
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                title={item.label}
                className={`flex h-11 w-full items-center justify-center gap-3 rounded-card text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 sm:justify-start sm:px-4 ${
                  active
                    ? 'bg-white/10 text-ink-inverse shadow-[inset_3px_0_0_0_theme(colors.brand.500)]'
                    : 'text-ink-inverse/65 hover:bg-white/5 hover:text-ink-inverse'
                }`}
              >
                <Icon
                  className={`size-4 shrink-0 ${active ? 'text-brand-400' : ''}`}
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">{item.label}</span>
                {typeof count === 'number' ? (
                  <span className="ml-auto hidden rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold tabular text-ink-inverse/80 sm:inline-flex">
                    {count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-navy-600 p-2 sm:p-3">
          <Link
            href="/"
            aria-label="View site"
            title="View site"
            className="flex h-11 w-full items-center justify-center gap-3 rounded-card text-sm font-medium text-ink-inverse/65 transition-colors duration-200 hover:bg-white/5 hover:text-ink-inverse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 sm:justify-start sm:px-4"
          >
            <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">View site</span>
          </Link>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            title="Log out"
            className="flex h-11 w-full items-center justify-center gap-3 rounded-card text-sm font-medium text-ink-inverse/65 transition-colors duration-200 hover:bg-white/5 hover:text-ink-inverse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 sm:justify-start sm:px-4"
          >
            <LogOut className="size-4 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </aside>

      <main className="pb-24 pl-[5.25rem] pr-4 pt-10 sm:pl-[17.5rem] sm:pr-8 lg:pl-80 lg:pr-12 lg:pt-14">
        <div className="max-w-2xl">
          <Eyebrow>Content studio</Eyebrow>
          <h1 className="mt-4 text-display text-ink">Everything published, in one place.</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            Photo albums, blog posts and reviews. Changes go live as soon as
            they are saved.
          </p>
        </div>

        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
            >
              {tab === 'albums' && <AlbumManager />}
              {tab === 'blog' && <BlogManager />}
              {tab === 'reviews' && <ReviewsManager />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ==========================================================================
   Shared field + surface styles
   ========================================================================== */

const inputClass =
  'w-full rounded-card border border-line-strong bg-surface px-4 text-[0.95rem] text-ink placeholder:text-ink-subtle transition-[border-color,box-shadow] duration-200 focus:border-brand-500 focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-brand-500/25';

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-ink">
      {children}
    </label>
  );
}

function FormCard({
  title,
  lede,
  children,
}: {
  title: string;
  lede?: ReactNode;
  children: ReactNode;
}) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-card border border-line bg-surface p-6 shadow-[0_1px_2px_rgba(20,18,14,0.04)] sm:p-7">
        <h2 className="text-headline text-ink">{title}</h2>
        {lede ? (
          <div className="mt-3 text-sm leading-relaxed text-ink-muted">{lede}</div>
        ) : null}
        <div className="mt-6">{children}</div>
      </div>
    </aside>
  );
}

function ListPanel({
  title,
  count,
  loading,
  emptyTitle,
  emptyHint,
  children,
}: {
  title: string;
  count: number;
  loading: boolean;
  emptyTitle: string;
  emptyHint: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-4 border-b border-line pb-4">
        <h2 className="text-title text-ink">{title}</h2>
        <span className="tp-label text-ink-subtle">{count}</span>
      </div>

      {loading ? (
        <ul className="mt-6 space-y-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li
              key={i}
              className="h-24 animate-pulse rounded-card border border-line bg-surface"
              style={{ animationDelay: `${i * 90}ms` }}
            />
          ))}
        </ul>
      ) : count === 0 ? (
        <div className="mt-6 rounded-card border border-dashed border-line-strong bg-surface px-6 py-14 text-center">
          <p className="text-title text-ink">{emptyTitle}</p>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-muted">
            {emptyHint}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">{children}</div>
      )}
    </section>
  );
}

function DeleteButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-subtle transition-colors duration-200 hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
    >
      <Trash2 className="size-4" aria-hidden="true" />
    </button>
  );
}

/* ==========================================================================
   Blog
   ========================================================================== */

function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Strategy');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch {}
    finally { setLoading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt) { notify('Fill all fields'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, category, date, excerpt, image }) });
      const data = await res.json();
      if (data.error) { notify(data.error); return; }
      setPosts([data, ...posts]);
      setTitle(''); setCategory('Strategy'); setExcerpt(''); setImage('');
      notify('Post published.', 'success');
    } catch { notify('Something went wrong. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setPosts(posts.filter(p => p.id !== id));
      notify('Post deleted.', 'success');
    } catch { notify('Could not delete that post.'); }
  };

  const categories = ['Strategy', 'Technology', 'Branding', 'Analytics', 'Management', 'Media'];

  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)] xl:gap-12">
      <FormCard
        title="New post"
        lede="A title and an excerpt are required. The image is optional and uploads into site storage."
      >
        <form onSubmit={handleAdd} className="space-y-5">
          <div>
            <FieldLabel htmlFor="blog-title">Title</FieldLabel>
            <input
              id="blog-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Post title"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="blog-category">Category</FieldLabel>
              <select
                id="blog-category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className={inputClass}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="blog-date">Date</FieldLabel>
              <input
                id="blog-date"
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <FieldLabel htmlFor="blog-excerpt">Excerpt</FieldLabel>
            <textarea
              id="blog-excerpt"
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              rows={4}
              placeholder="A short summary shown on the blog index"
              className={`${inputClass} min-h-28 resize-y py-3`}
            />
          </div>
          <UploadField type="work" label="Cover image" value={image} onChange={setImage} />
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-500 text-sm font-semibold text-navy-700 transition-colors duration-200 hover:bg-brand-600 hover:text-white disabled:opacity-50"
          >
            <Plus className="size-4" aria-hidden="true" />
            {saving ? 'Publishing…' : 'Publish post'}
          </button>
        </form>
      </FormCard>

      <ListPanel
        title="Posts"
        count={posts.length}
        loading={loading}
        emptyTitle="No posts yet"
        emptyHint="Published posts appear on the blog and can be shared anywhere."
      >
        {posts.map(post => (
          <article key={post.id} className="flex items-start gap-4 rounded-card border border-line bg-surface p-4 transition-colors duration-200 hover:border-line-strong sm:items-center">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-card bg-cream">
              {post.image ? (
                <Image src={post.image} alt="" fill sizes="3.5rem" className="object-cover" />
              ) : (
                <div className="flex size-full items-center justify-center text-ink-subtle">
                  <FileText className="size-5" aria-hidden="true" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate font-semibold text-ink">{post.title}</p>
                <span className="inline-flex shrink-0 items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-800">
                  {post.category}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-ink-subtle">{post.date}</p>
              {post.excerpt && (
                <p className="mt-1 truncate text-sm text-ink-muted">{post.excerpt}</p>
              )}
            </div>
            <DeleteButton onClick={() => handleDelete(post.id)} label={`Delete ${post.title}`} />
          </article>
        ))}
      </ListPanel>
    </div>
  );
}

/* ==========================================================================
   Albums
   ========================================================================== */

/** What a sync reports back, so the admin can see what actually happened. */
interface SyncResult {
  photos: number;
  videosAdded: number;
  videosReused: number;
  videosSkipped: { name: string; reason: string }[];
}

function AlbumManager() {
  const [albums, setAlbums] = useState<WorkAlbum[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [folderUrl, setFolderUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState('');
  // The album open in the editor below the list, if any.
  const [editingId, setEditingId] = useState('');

  // Per-album feedback rather than one global message, so two albums cannot
  // overwrite each other's result while an admin works down a list.
  const [results, setResults] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/work/albums')
      .then((res) => (res.ok ? res.json() : []))
      .then((data: WorkAlbum[]) => {
        if (Array.isArray(data)) setAlbums(data);
      })
      .catch(() => setAlbums([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      notify('A title is required');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/work/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description,
          // The slug is derived from the title, so an admin does not have to
          // think about URLs. The API accepts an explicit slug when a
          // collision needs resolving.
          slug: title
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, ''),
          driveFolderUrl: folderUrl.trim(),
        }),
      });
      const data = await res.json();
      if (data.error) {
        notify(data.error);
        return;
      }
      setAlbums([data, ...albums]);
      setTitle('');
      setCategory('');
      setDescription('');
      setFolderUrl('');
      notify(
        folderUrl.trim()
          ? 'Album added. Press Sync to pull in its photos.'
          : 'Album added. Open it and upload photos.',
        'success',
      );
    } catch {
      notify('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSync = async (album: WorkAlbum) => {
    setSyncingId(album.id);
    setErrors((current) => ({ ...current, [album.id]: '' }));

    try {
      const res = await fetch(`/api/work/albums/${album.id}/sync`, {
        method: 'POST',
      });
      const data: SyncResult & { error?: string } = await res.json();

      if (data.error) {
        setErrors((current) => ({ ...current, [album.id]: data.error as string }));
        return;
      }

      // Re-read rather than patching counts locally: the response is a summary
      // and the album row is the server's truth.
      const refreshed = await fetch('/api/work/albums').then((r) => r.json());
      if (Array.isArray(refreshed)) setAlbums(refreshed);

      const skipped = data.videosSkipped.length;
      const parts = [
        `${data.photos} photo${data.photos === 1 ? '' : 's'}`,
        data.videosAdded > 0
          ? `${data.videosAdded} video${data.videosAdded === 1 ? '' : 's'} mirrored`
          : null,
        data.videosReused > 0 ? `${data.videosReused} already mirrored` : null,
        skipped > 0 ? `${skipped} skipped` : null,
      ].filter(Boolean);

      setResults((current) => ({ ...current, [album.id]: parts.join(' · ') }));
    } catch {
      setErrors((current) => ({
        ...current,
        [album.id]: 'Sync failed. Check the folder is shared as "Anyone with the link".',
      }));
    } finally {
      setSyncingId('');
    }
  };

  const handleDelete = async (album: WorkAlbum) => {
    if (
      !confirm(
        `Delete "${album.title}"? This removes the album, its mirrored videos, and its link from /work. The Google Drive folder itself is untouched.`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/work/albums/${album.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.error) {
        notify(data.error);
        return;
      }
      setAlbums(albums.filter((item) => item.id !== album.id));
      if (editingId === album.id) setEditingId('');
      notify('Album deleted.', 'success');
    } catch {
      notify('Could not delete that album.');
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)] xl:gap-12">
      <FormCard
        title="New album"
        lede={
          <>
            Set the Drive folder to &ldquo;Anyone with the link&rdquo; as Viewer,
            paste its link and press Sync. Photos are served straight from
            Google; nothing is copied except videos.
          </>
        }
      >
        <form onSubmit={handleAdd} className="space-y-5">
          <div>
            <FieldLabel htmlFor="album-title">Title</FieldLabel>
            <input
              id="album-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Studio Shoot"
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel htmlFor="album-category">Category</FieldLabel>
            <input
              id="album-category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Photography, Events…"
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel htmlFor="album-description">Description</FieldLabel>
            <textarea
              id="album-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="One or two sentences about the project"
              className={`${inputClass} min-h-24 resize-y py-3`}
            />
          </div>
          <div>
            <FieldLabel htmlFor="album-folder">Google Drive folder link</FieldLabel>
            <input
              id="album-folder"
              type="url"
              value={folderUrl}
              onChange={(e) => setFolderUrl(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/…"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-500 text-sm font-semibold text-navy-700 transition-colors duration-200 hover:bg-brand-600 hover:text-white disabled:opacity-50"
          >
            <Plus className="size-4" aria-hidden="true" />
            {saving ? 'Adding…' : 'Add album'}
          </button>
        </form>
      </FormCard>

      <ListPanel
        title="Albums"
        count={albums.length}
        loading={loading}
        emptyTitle="No albums yet"
        emptyHint="Paste a Google Drive folder link to create the first one, then press Sync to pull its photos in."
      >
        {albums.map((album) => {
          const busy = syncingId === album.id;
          const neverSynced = !album.lastSyncedAt;
          const editing = editingId === album.id;

          return (
            <article key={album.id} className="rounded-card border border-line bg-surface transition-colors duration-200 hover:border-line-strong">
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-card bg-cream">
                  {album.coverUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={album.coverUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-ink-subtle">
                      <Images className="size-5" aria-hidden="true" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold text-ink">{album.title}</p>
                    {album.category ? (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-800">
                        {album.category}
                      </span>
                    ) : null}
                    {neverSynced ? (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                        Not synced
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 truncate font-mono text-xs text-ink-subtle">
                    /work/{album.slug}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">
                    {neverSynced
                      ? 'No photos pulled in yet'
                      : `${album.photoCount} photo${album.photoCount === 1 ? '' : 's'}${album.videoCount > 0 ? ` · ${album.videoCount} video${album.videoCount === 1 ? '' : 's'}` : ''} · synced ${new Date(album.lastSyncedAt).toLocaleDateString()}`}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:justify-end">
                  <Link
                    href={`/work/${album.slug}`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-sm font-medium text-ink-muted transition-colors duration-200 hover:border-brand-500 hover:text-brand-700"
                  >
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                    View
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      setEditingId((current) => (current === album.id ? '' : album.id))
                    }
                    aria-expanded={editing}
                    className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors duration-200 ${
                      editing
                        ? 'border-brand-500 bg-brand-500 text-white'
                        : 'border-line-strong text-ink-muted hover:border-brand-500 hover:text-brand-700'
                    }`}
                  >
                    <Pencil className="size-3.5" aria-hidden="true" />
                    {editing ? 'Close' : 'Edit'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSync(album)}
                    disabled={Boolean(syncingId)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-sm font-medium text-ink-muted transition-colors duration-200 hover:border-brand-500 hover:text-brand-700 disabled:opacity-50"
                  >
                    <RefreshCw className={`size-3.5 ${busy ? 'animate-spin' : ''}`} aria-hidden="true" />
                    {busy ? 'Syncing' : neverSynced ? 'Sync' : 'Re-sync'}
                  </button>

                  <DeleteButton
                    onClick={() => handleDelete(album)}
                    label={`Delete ${album.title}`}
                  />
                </div>
              </div>

              {results[album.id] ? (
                <p className="mx-4 mb-4 rounded-card border border-brand-500/30 bg-brand-50 px-4 py-2.5 text-sm text-brand-800">
                  {results[album.id]}
                </p>
              ) : null}

              {errors[album.id] ? (
                <p className="mx-4 mb-4 rounded-card border border-red-500/40 bg-red-50 px-4 py-2.5 text-sm text-red-700">
                  {errors[album.id]}
                </p>
              ) : null}

              {editing ? (
                <div className="border-t border-line p-4 sm:p-6">
                  <AlbumEditor
                    album={album}
                    onClose={() => setEditingId('')}
                    onSaved={(updated) =>
                      setAlbums((current) =>
                        current.map((item) => (item.id === updated.id ? updated : item))
                      )
                    }
                  />
                </div>
              ) : null}
            </article>
          );
        })}
      </ListPanel>
    </div>
  );
}

/* ==========================================================================
   Reviews
   ========================================================================== */

function StarRating({ value, onChange }: { value: number; onChange?: (n: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        if (!onChange) {
          return (
            <Star
              key={n}
              className={`size-4 ${filled ? 'fill-brand-500 text-brand-500' : 'text-line-strong'}`}
              aria-hidden="true"
            />
          );
        }
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            className="rounded p-0.5 transition-transform duration-150 hover:scale-110"
          >
            <Star
              className={`size-5 ${filled ? 'fill-brand-500 text-brand-500' : 'text-line-strong hover:text-brand-300'}`}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}

function ReviewsManager() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch {}
    finally { setLoading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !content) { notify('Fill all fields'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, role, content, rating }) });
      const data = await res.json();
      if (data.error) { notify(data.error); return; }
      setReviews([data, ...reviews]);
      setName(''); setRole(''); setContent(''); setRating(5);
      notify('Review added.', 'success');
    } catch { notify('Something went wrong. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setReviews(reviews.filter(r => r.id !== id));
      notify('Review deleted.', 'success');
    } catch { notify('Could not delete that review.'); }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)] xl:gap-12">
      <FormCard
        title="New review"
        lede="Reviews appear in the trust section across the site. Pick a star rating and paste the client's own words."
      >
        <form onSubmit={handleAdd} className="space-y-5">
          <div>
            <FieldLabel htmlFor="review-name">Name</FieldLabel>
            <input
              id="review-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Client name"
              className={inputClass}
            />
          </div>
          <div>
            <FieldLabel htmlFor="review-role">Role</FieldLabel>
            <input
              id="review-role"
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="CEO, Company…"
              className={inputClass}
            />
          </div>
          <div>
            <span className="mb-2 block text-sm font-medium text-ink">Rating</span>
            <StarRating value={rating} onChange={setRating} />
          </div>
          <div>
            <FieldLabel htmlFor="review-content">Review</FieldLabel>
            <textarea
              id="review-content"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              placeholder="What the client said"
              className={`${inputClass} min-h-32 resize-y py-3`}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-brand-500 text-sm font-semibold text-navy-700 transition-colors duration-200 hover:bg-brand-600 hover:text-white disabled:opacity-50"
          >
            <Plus className="size-4" aria-hidden="true" />
            {saving ? 'Adding…' : 'Add review'}
          </button>
        </form>
      </FormCard>

      <ListPanel
        title="Reviews"
        count={reviews.length}
        loading={loading}
        emptyTitle="No reviews yet"
        emptyHint="Add what clients have said about working with you. They show up in the trust sections across the site."
      >
        {reviews.map(review => (
          <article key={review.id} className="rounded-card border border-line bg-surface p-5 transition-colors duration-200 hover:border-line-strong">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-800">
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{review.name}</p>
                  <p className="truncate text-sm text-ink-subtle">{review.role}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <StarRating value={review.rating} />
                <DeleteButton onClick={() => handleDelete(review.id)} label={`Delete review by ${review.name}`} />
              </div>
            </div>
            <blockquote className="mt-4 flex gap-3 text-sm leading-relaxed text-ink-muted">
              <Quote className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden="true" />
              <p>{review.content}</p>
            </blockquote>
          </article>
        ))}
      </ListPanel>
    </div>
  );
}
