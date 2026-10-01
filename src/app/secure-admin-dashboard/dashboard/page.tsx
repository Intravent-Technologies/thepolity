'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UploadField from '@/components/UploadField';
import { notify, ToastViewport } from '@/components/admin/Toast';
import { CategoryLabel, Eyebrow } from '@/components/ui';
import Logo from '@/components/Logo';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  createdAt: string;
}

interface GalleryItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  createdAt: string;
}

interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
}

interface WorkProject {
  id: string;
  title: string;
  category: string;
  client: string;
  description: string;
  image: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface Review {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

type Tab = 'portfolio' | 'gallery' | 'blog' | 'work' | 'team' | 'reviews' | 'homepage';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('portfolio');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-baseline gap-2">
            <Logo className="h-6" />
            <Eyebrow>Admin</Eyebrow>
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-full border border-line-strong px-4 py-2 text-sm text-ink-muted transition-colors duration-200 hover:border-brand-500 hover:text-brand-600"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <CategoryLabel>Content</CategoryLabel>
        <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-muted">
          Everything published to the site is edited here. Changes go live as
          soon as they are saved.
        </p>

        <div
          role="tablist"
          aria-label="Content sections"
          className="mt-8 flex flex-wrap gap-1 border-b border-line"
        >
          {[
            { key: 'portfolio', label: 'Portfolio' },
            { key: 'gallery', label: 'Gallery' },
            { key: 'blog', label: 'Blog' },
            { key: 'work', label: 'Work' },
            { key: 'team', label: 'Team' },
            { key: 'reviews', label: 'Reviews' },
            { key: 'homepage', label: 'Homepage' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              onClick={() => setTab(item.key as Tab)}
              aria-selected={tab === item.key}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                tab === item.key
                  ? 'border-brand-500 text-ink'
                  : 'border-transparent text-ink-muted hover:border-line-strong hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'portfolio' && <PortfolioManager />}
        {tab === 'gallery' && <GalleryManager />}
        {tab === 'blog' && <BlogManager />}
        {tab === 'work' && <WorkManager />}
        {tab === 'team' && <TeamManager />}
        {tab === 'reviews' && <ReviewsManager />}
        {tab === 'homepage' && <HomepageManager />}
      </main>
    </div>
  );
}

function PortfolioManager() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Project');
  const [image, setImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !image) { notify('Fill all fields'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/portfolio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description, image, category }) });
      const data = await res.json();
      if (data.error) { notify(data.error); return; }
      setItems([data, ...items]);
      setTitle(''); setDescription(''); setCategory('Project'); setImage('');
    } catch { notify('Something went wrong. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      await fetch(`/api/portfolio?id=${id}`, { method: 'DELETE' });
      setItems(items.filter(i => i.id !== id));
    } catch {}
  };

  return (
    <div className="bg-surface rounded-card border border-line p-6">
      <h2 className="text-xl font-bold text-ink mb-6">Add Portfolio Item</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="px-4 py-3 bg-cream border border-line rounded-card text-ink placeholder:text-ink-subtle" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-3 bg-cream border border-line rounded-card text-ink">
            <option className="bg-surface">Project</option><option className="bg-surface">Case Study</option><option className="bg-surface">Campaign</option><option className="bg-surface">Branding</option><option className="bg-surface">Design</option>
          </select>
        </div>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Description" className="w-full px-4 py-3 bg-cream border border-line rounded-card text-ink placeholder:text-ink-subtle" />
        <UploadField type="portfolio" label="Choose image" value={image} onChange={setImage} />
        <button type="submit" disabled={saving || !image} className="px-6 py-3 bg-brand-500 text-white rounded-card font-medium hover:bg-brand-600 disabled:opacity-50">{saving ? 'Saving...' : 'Add Item'}</button>
      </form>

      <div className="border-t border-line mt-8 pt-8">
        <h3 className="text-lg font-bold text-ink mb-4">Items ({items.length})</h3>
        {loading ? <p className="text-ink-subtle">Loading...</p> : items.length === 0 ? <p className="text-ink-subtle">No items</p> : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-cream rounded-card">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded bg-cream overflow-hidden flex-shrink-0"><Image src={item.image} alt="" fill sizes="3rem" className="object-cover" /></div>
                  <div className="min-w-0">
                    <div className="text-ink font-medium">{item.title}</div>
                    <div className="text-ink-subtle text-sm">{item.category}</div>
                    {item.description && <div className="text-ink-subtle text-xs truncate max-w-md">{item.description}</div>}
                  </div>
                </div>
                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 ml-3 flex-shrink-0 rounded border border-line-strong bg-surface text-sm text-ink-muted transition-colors duration-200 hover:border-brand-500 hover:text-brand-700">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'image' | 'video'>('image');
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchItems(); }, []);

  // Switching between image and video invalidates a file of the other kind.
  useEffect(() => { setUrl(''); }, [type]);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {}
    finally { setLoading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) { setError('A title and an uploaded file are both required.'); return; }

    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, type, url }) });
      const newItem = await res.json();
      if (newItem.error) { setError(newItem.error); return; }
      setItems([newItem, ...items]);
      setTitle(''); setUrl('');
    } catch { setError('Could not save that item. Check your connection and retry.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      setItems(items.filter(i => i.id !== id));
    } catch {}
  };

  return (
    <div className="bg-surface rounded-card border border-line p-6">
      <h2 className="text-xl font-bold text-ink mb-6">Add Gallery Item</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="px-4 py-3 bg-cream border border-line rounded-card text-ink placeholder:text-ink-subtle" />
          <select value={type} onChange={e => setType(e.target.value as 'image' | 'video')} className="px-4 py-3 bg-cream border border-line rounded-card text-ink">
            <option value="image">Image</option><option value="video">Video</option>
          </select>
        </div>
        <UploadField
          type="gallery"
          kind={type}
          label={`Choose ${type}`}
          value={url}
          onChange={setUrl}
        />
        {error ? <p role="alert" className="text-sm text-brand-700">{error}</p> : null}
        <button type="submit" disabled={saving || !url} className="px-6 py-3 bg-brand-500 text-white rounded-card font-medium hover:bg-brand-600 disabled:opacity-50">{saving ? 'Saving...' : 'Add Item'}</button>
      </form>

      <div className="border-t border-line mt-8 pt-8">
        <h3 className="text-lg font-bold text-ink mb-4">Items ({items.length})</h3>
        {loading ? <p className="text-ink-subtle">Loading...</p> : items.length === 0 ? <p className="text-ink-subtle">No items</p> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map(item => (
              <div key={item.id} className="relative rounded-card overflow-hidden bg-cream">
                {item.type === 'image' ? (
                  <Image src={item.url} alt={item.title} fill sizes="(min-width: 768px) 25vw, 50vw" className="h-32 object-cover" />
                ) : (
                  <video src={item.url} controls className="w-full h-32 object-cover" />
                )}
                <div className="p-2">
                  <p className="text-ink text-xs font-medium truncate">{item.title}</p>
                  <p className="text-ink-subtle text-xs capitalize">{item.type}</p>
                </div>
                <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 px-2 py-1 rounded bg-ink/80 text-xs text-ink-inverse transition-colors duration-200 hover:bg-ink">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
    } catch { notify('Something went wrong. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      await fetch(`/api/blog?id=${id}`, { method: 'DELETE' });
      setPosts(posts.filter(p => p.id !== id));
    } catch {}
  };

  const categories = ['Strategy', 'Technology', 'Branding', 'Analytics', 'Management', 'Media'];

  return (
    <div className="bg-surface rounded-card border border-line p-6">
      <h2 className="text-xl font-bold text-ink mb-6">Add Blog Post</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="px-4 py-3 bg-cream border border-line rounded-card text-ink placeholder:text-ink-subtle" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-3 bg-cream border border-line rounded-card text-ink">
            {categories.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
          </select>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-4 py-3 bg-cream border border-line rounded-card text-ink" />
        </div>
        <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} placeholder="Excerpt" className="w-full px-4 py-3 bg-cream border border-line rounded-card text-ink placeholder:text-ink-subtle" />
        <UploadField type="portfolio" label="Choose image" value={image} onChange={setImage} />
        <button type="submit" disabled={saving} className="px-6 py-3 bg-brand-500 text-white rounded-card font-medium hover:bg-brand-600 disabled:opacity-50">{saving ? 'Saving...' : 'Add Post'}</button>
      </form>

      <div className="border-t border-line mt-8 pt-8">
        <h3 className="text-lg font-bold text-ink mb-4">Posts ({posts.length})</h3>
        {loading ? <p className="text-ink-subtle">Loading...</p> : posts.length === 0 ? <p className="text-ink-subtle">No posts</p> : (
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-cream rounded-card">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded bg-cream overflow-hidden flex-shrink-0">{post.image && <Image src={post.image} alt="" fill sizes="3rem" className="object-cover" />}</div>
                  <div className="min-w-0">
                    <div className="text-ink font-medium">{post.title}</div>
                    <div className="text-ink-subtle text-sm">{post.category} | {post.date}</div>
                    {post.excerpt && <div className="text-ink-subtle text-xs truncate max-w-md">{post.excerpt}</div>}
                  </div>
                </div>
                <button onClick={() => handleDelete(post.id)} className="px-3 py-1 ml-3 flex-shrink-0 rounded border border-line-strong bg-surface text-sm text-ink-muted transition-colors duration-200 hover:border-brand-500 hover:text-brand-700">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WorkManager() {
  const [projects, setProjects] = useState<WorkProject[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [client, setClient] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/work');
      const data = await response.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {}
    finally { setLoading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) { notify('Fill all fields'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/work', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, category, client, description, image }) });
      const data = await res.json();
      if (data.error) { notify(data.error); return; }
      setProjects([data, ...projects]);
      setTitle(''); setCategory('Web Development'); setClient(''); setDescription(''); setImage('');
    } catch { notify('Something went wrong. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      await fetch(`/api/work?id=${id}`, { method: 'DELETE' });
      setProjects(projects.filter(p => p.id !== id));
    } catch {}
  };

  const categories = ['Web Development', 'Branding', 'IT Consultancy', 'Media', 'Project Management', 'Strategy'];

  return (
    <div className="bg-surface rounded-card border border-line p-6">
      <h2 className="text-xl font-bold text-ink mb-6">Add Work Project</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="px-4 py-3 bg-cream border border-line rounded-card text-ink placeholder:text-ink-subtle" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-3 bg-cream border border-line rounded-card text-ink">
            {categories.map(c => <option key={c} value={c} className="bg-surface">{c}</option>)}
          </select>
          <input type="text" value={client} onChange={e => setClient(e.target.value)} placeholder="Client name" className="px-4 py-3 bg-cream border border-line rounded-card text-ink placeholder:text-ink-subtle" />
        </div>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Description" className="w-full px-4 py-3 bg-cream border border-line rounded-card text-ink placeholder:text-ink-subtle" />
        <UploadField type="portfolio" label="Choose image" value={image} onChange={setImage} />
        <button type="submit" disabled={saving} className="px-6 py-3 bg-brand-500 text-white rounded-card font-medium hover:bg-brand-600 disabled:opacity-50">{saving ? 'Saving...' : 'Add Project'}</button>
      </form>

      <div className="border-t border-line mt-8 pt-8">
        <h3 className="text-lg font-bold text-ink mb-4">Projects ({projects.length})</h3>
        {loading ? <p className="text-ink-subtle">Loading...</p> : projects.length === 0 ? <p className="text-ink-subtle">No projects</p> : (
          <div className="space-y-3">
            {projects.map(project => (
              <div key={project.id} className="flex items-center justify-between p-3 bg-cream rounded-card">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded bg-cream overflow-hidden flex-shrink-0">{project.image && <Image src={project.image} alt="" fill sizes="3rem" className="object-cover" />}</div>
                  <div className="min-w-0">
                    <div className="text-ink font-medium">{project.title}</div>
                    <div className="text-ink-subtle text-sm">{project.category} | {project.client}</div>
                    {project.description && <div className="text-ink-subtle text-xs truncate max-w-md">{project.description}</div>}
                  </div>
                </div>
                <button onClick={() => handleDelete(project.id)} className="px-3 py-1 ml-3 flex-shrink-0 rounded border border-line-strong bg-surface text-sm text-ink-muted transition-colors duration-200 hover:border-brand-500 hover:text-brand-700">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/team');
      const data = await response.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch {}
    finally { setLoading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !bio) { notify('Fill all fields'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/team', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, role, bio, image }) });
      const data = await res.json();
      if (data.error) { notify(data.error); return; }
      setMembers([data, ...members]);
      setName(''); setRole(''); setBio(''); setImage('');
    } catch { notify('Something went wrong. Please try again.'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      await fetch(`/api/team?id=${id}`, { method: 'DELETE' });
      setMembers(members.filter(m => m.id !== id));
    } catch {}
  };

  const roles = ['CEO & Founder', 'Head of Technology', 'Creative Director', 'Head of Operations', 'Strategy Lead', 'Head of Media'];

  return (
    <div className="bg-surface rounded-card border border-line p-6">
      <h2 className="text-xl font-bold text-ink mb-6">Add Team Member</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="px-4 py-3 bg-cream border border-line rounded-card text-ink placeholder:text-ink-subtle" />
          <select value={role} onChange={e => setRole(e.target.value)} className="px-4 py-3 bg-cream border border-line rounded-card text-ink">
            <option value="" className="bg-surface">Select role</option>
            {roles.map(r => <option key={r} value={r} className="bg-surface">{r}</option>)}
          </select>
        </div>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Bio" className="w-full px-4 py-3 bg-cream border border-line rounded-card text-ink placeholder:text-ink-subtle" />
        <UploadField type="portfolio" label="Choose image" round value={image} onChange={setImage} />
        <button type="submit" disabled={saving} className="px-6 py-3 bg-brand-500 text-white rounded-card font-medium hover:bg-brand-600 disabled:opacity-50">{saving ? 'Saving...' : 'Add Member'}</button>
      </form>

      <div className="border-t border-line mt-8 pt-8">
        <h3 className="text-lg font-bold text-ink mb-4">Members ({members.length})</h3>
        {loading ? <p className="text-ink-subtle">Loading...</p> : members.length === 0 ? <p className="text-ink-subtle">No members</p> : (
          <div className="space-y-3">
            {members.map(member => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-cream rounded-card">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-full bg-cream flex-shrink-0 overflow-hidden">
                    {member.image ? <Image src={member.image} alt="" fill sizes="3rem" className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-ink font-bold">{member.name[0]}</div>}
                  </div>
                  <div className="min-w-0">
                    <div className="text-ink font-medium">{member.name}</div>
                    <div className="text-ink-subtle text-sm">{member.role}</div>
                    {member.bio && <div className="text-ink-subtle text-xs truncate max-w-md">{member.bio}</div>}
                  </div>
                </div>
                <button onClick={() => handleDelete(member.id)} className="px-3 py-1 ml-3 flex-shrink-0 rounded border border-line-strong bg-surface text-sm text-ink-muted transition-colors duration-200 hover:border-brand-500 hover:text-brand-700">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
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
    if (!confirm('Delete?')) return;
    try {
      await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
      setReviews(reviews.filter(r => r.id !== id));
    } catch {}
  };

  return (
    <div className="bg-surface rounded-card border border-line p-6">
      <h2 className="text-xl font-bold text-ink mb-6">Add Review</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="px-4 py-3 bg-cream border border-line rounded-card text-ink placeholder:text-ink-subtle" />
          <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="Role (e.g. CEO, Company)" className="px-4 py-3 bg-cream border border-line rounded-card text-ink placeholder:text-ink-subtle" />
        </div>
        <div>
          <label className="block text-ink-muted text-sm mb-2">Rating</label>
          <select value={rating} onChange={e => setRating(parseInt(e.target.value))} className="px-4 py-3 bg-cream border border-line rounded-card text-ink">
            {[1,2,3,4,5].map(r => <option key={r} value={r} className="bg-surface">{r} Star{r > 1 ? 's' : ''}</option>)}
          </select>
        </div>
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} placeholder="Review content" className="w-full px-4 py-3 bg-cream border border-line rounded-card text-ink placeholder:text-ink-subtle" />
        <button type="submit" disabled={saving} className="px-6 py-3 bg-brand-500 text-white rounded-card font-medium hover:bg-brand-600 disabled:opacity-50">{saving ? 'Saving...' : 'Add Review'}</button>
      </form>

      <div className="border-t border-line mt-8 pt-8">
        <h3 className="text-lg font-bold text-ink mb-4">Reviews ({reviews.length})</h3>
        {loading ? <p className="text-ink-subtle">Loading...</p> : reviews.length === 0 ? <p className="text-ink-subtle">No reviews</p> : (
          <div className="space-y-3">
            {reviews.map(review => (
              <div key={review.id} className="p-4 bg-cream rounded-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="min-w-0">
                    <div className="text-ink font-medium">{review.name}</div>
                    <div className="text-ink-subtle text-sm">{review.role}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex">{[...Array(review.rating)].map((_,i) => <span key={i} className="text-brand-400">★</span>)}</div>
                    <button onClick={() => handleDelete(review.id)} className="px-3 py-1 rounded border border-line-strong bg-surface text-sm text-ink-muted transition-colors duration-200 hover:border-brand-500 hover:text-brand-700">Delete</button>
                  </div>
                </div>
                <p className="text-ink-muted text-sm">&ldquo;{review.content}&rdquo;</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface HomepageImage {
  id: string;
  section: string;
  imageUrl: string;
}

const HOMEPAGE_SECTION_GROUPS = [
  {
    title: 'Hero Section (Right Side Cards)',
    sections: [
      { key: 'hero-visual-1', label: 'Card 1: Media' },
      { key: 'hero-visual-2', label: 'Card 2: IT Solutions' },
      { key: 'hero-visual-3', label: 'Card 3: Projects' },
      { key: 'hero-visual-4', label: 'Card 4: Creative' },
    ]
  },
  {
    title: 'Our Expert Services (Homepage)',
    sections: [
      { key: 'service-it', label: 'IT Consultancy' },
      { key: 'service-media', label: 'Media' },
      { key: 'service-project', label: 'Project Management' },
    ]
  },
  {
    title: 'Creative Edge (Blog Posts)',
    sections: [
      { key: 'blog-1', label: 'Blog Post 1' },
      { key: 'blog-2', label: 'Blog Post 2' },
      { key: 'blog-3', label: 'Blog Post 3' },
    ]
  },
  {
    title: 'Events — Slideshow Images',
    sections: [
      { key: 'events-slideshow', label: 'All Events Images (for slideshow)' },
    ]
  },
  {
    title: 'Photography — Slideshow Images',
    sections: [
      { key: 'photography_slideshow', label: 'All Photography Images (for slideshow)' },
    ]
  },
  {
    title: 'Portraits — Slideshow Images',
    sections: [
      { key: 'portraits_slideshow', label: 'All Portraits Images (for slideshow)' },
    ]
  },
  {
    title: 'Photo Tourism — Slideshow Images',
    sections: [
      { key: 'photo-tourism_slideshow', label: 'All Photo Tourism Images (for slideshow)' },
    ]
  },
  {
    title: 'Visuals — Slideshow Images',
    sections: [
      { key: 'visuals_slideshow', label: 'All Visuals Images (for slideshow)' },
    ]
  },
  {
    title: 'Newsletter Section',
    sections: [
      { key: 'newsletter-bg', label: 'Newsletter Background' },
    ]
  },
  {
    title: 'About Us Page',
    sections: [
      { key: 'about-ceo', label: 'CEO Photo' },
    ]
  },
  {
    title: 'Portfolio Page',
    sections: [
      { key: 'portfolio-1', label: 'Work 1' },
      { key: 'portfolio-2', label: 'Work 2' },
      { key: 'portfolio-3', label: 'Work 3' },
      { key: 'portfolio-4', label: 'Work 4' },
      { key: 'portfolio-5', label: 'Work 5' },
      { key: 'portfolio-6', label: 'Work 6' },
    ]
  },
  {
    title: 'Gallery Page',
    sections: [
      { key: 'gallery-1', label: 'Image 1' },
      { key: 'gallery-2', label: 'Image 2' },
      { key: 'gallery-3', label: 'Image 3' },
      { key: 'gallery-4', label: 'Image 4' },
      { key: 'gallery-5', label: 'Image 5' },
      { key: 'gallery-6', label: 'Image 6' },
      { key: 'gallery-7', label: 'Image 7' },
      { key: 'gallery-8', label: 'Image 8' },
      { key: 'gallery-9', label: 'Image 9' },
      { key: 'gallery-10', label: 'Image 10' },
      { key: 'gallery-11', label: 'Image 11' },
      { key: 'gallery-12', label: 'Image 12' },
    ]
  },
];

const allSections = HOMEPAGE_SECTION_GROUPS.flatMap(g => g.sections);

function HomepageManager() {
  const [images, setImages] = useState<HomepageImage[]>([]);
  const [selectedSection, setSelectedSection] = useState(allSections[0].key);
  const [notice, setNotice] = useState<{ tone: 'ok' | 'bad'; text: string } | null>(null);

  const loadImages = async () => {
    try {
      const res = await fetch('/api/homepage-images');
      if (res.ok) { const data = await res.json(); setImages(Array.isArray(data) ? data : []); }
      else { setImages([]); }
    } catch (e) { console.error('Failed to load images:', e); setImages([]); }
  };

  // Fetching on mount: the state update lands in the promise continuation, not
  // synchronously in the effect body.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadImages(); }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/homepage-images?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      await loadImages();
      setNotice({ tone: 'ok', text: 'Image removed.' });
    } else {
      setNotice({ tone: 'bad', text: 'Could not delete that image.' });
    }
  };

  const getImagesForSection = (section: string) => images.filter(img => img.section === section);
  const isSlideshowSection = (key: string) => key.includes('_slideshow');
  const selected = allSections.find(s => s.key === selectedSection);
  const selectedIsSlideshow = isSlideshowSection(selectedSection);

  return (
    <div className="space-y-8">
      {HOMEPAGE_SECTION_GROUPS.map((group) => (
        <div key={group.title} className="bg-surface rounded-card p-6 border border-line">
          <h2 className="text-xl font-bold text-ink mb-2">{group.title}</h2>
          <p className="text-ink-muted text-sm mb-6">{isSlideshowSection(group.sections[0]?.key || '') ? 'Upload multiple images for the slideshow' : 'Select a slot below to upload an image'}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {group.sections.map((section) => {
              const sectionImages = getImagesForSection(section.key);
              const isSelected = selectedSection === section.key;
              
              return (
                <div
                  key={section.key}
                  className={`bg-surface rounded-card p-4 border transition-colors duration-200 ${
                    isSelected ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-line'
                  }`}
                >
                  <h3 className="text-sm font-medium text-ink mb-3">{section.label}</h3>
                  
                  {sectionImages.length > 0 ? (
                    <div className="space-y-2 mb-3">
                      {sectionImages.map((img, idx) => (
                        <div key={img.id} className="relative">
                          <Image src={img.imageUrl} alt={`${section.label} ${idx + 1}`} fill sizes="(min-width: 1024px) 20vw, 50vw" className="h-24 object-cover rounded-card" />
                          <button
                            onClick={() => handleDelete(img.id)}
                            aria-label={`Delete ${section.label} ${idx + 1}`}
                            className="absolute top-1 right-1 inline-flex items-center gap-1 bg-ink/80 px-2 py-1 text-xs text-ink-inverse rounded hover:bg-ink"
                          >Delete</button>
                        </div>
                      ))}
                    </div>
                  ) : ( <div className="w-full h-24 bg-cream rounded-card mb-3 flex items-center justify-center text-ink-subtle text-sm">No image</div> )}

                  <button
                    onClick={() => { setSelectedSection(section.key); setNotice(null); }}
                    aria-pressed={isSelected}
                    className={`text-xs font-medium transition-colors duration-200 hover:text-brand-700 ${
                      isSelected ? 'text-brand-600' : 'text-brand-500 hover:underline'
                    }`}
                  >
                    {isSelected ? 'Selected — uploading here' : 'Select to upload'}
                  </button>
                  {isSlideshowSection(section.key) && sectionImages.length > 0 && (
                    <span className="text-xs text-ink-subtle ml-2">({sectionImages.length} images)</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="bg-surface rounded-card p-6 border border-line">
        <h2 className="text-lg font-bold text-ink">
          Upload to &ldquo;{selected?.label ?? selectedSection}&rdquo;
        </h2>
        <p className="mt-1 text-sm text-ink-subtle">
          {selectedIsSlideshow
            ? 'Each upload is added to this slideshow. Repeat as many times as you need.'
            : 'This slot holds one image. Uploading again replaces it.'}
        </p>

        <UploadField
          key={selectedSection}
          type="homepage"
          section={selectedSection}
          multi={selectedIsSlideshow}
          label="Choose image"
          value=""
          onChange={async () => {
            await loadImages();
            setNotice({ tone: 'ok', text: 'Image uploaded.' });
          }}
          className="mt-5"
        />
      </div>

      {notice ? (
        <p
          role="status"
          className={`rounded-card border p-3 text-sm ${
            notice.tone === 'ok'
              ? 'border-brand-200 bg-brand-50 text-brand-700'
              : 'border-brand-300 bg-brand-50 text-brand-700'
          }`}
        >
          {notice.text}
        </p>
      ) : null}
    </div>
  );
}