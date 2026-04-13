'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/session');
      const data = await res.json();
      if (!data.authenticated) {
        router.push('/admin-login');
      } else {
        setIsAuthenticated(true);
      }
    } catch {
      router.push('/admin-login');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin-login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Admin Header */}
      <header className="bg-[#111] border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold">
              <span className="text-white">THE</span>
              <span className="text-[#FF6B35]"> POLITY</span>
              <span className="text-white/50 text-sm ml-2">Admin</span>
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/60 hover:text-white text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
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
              onClick={() => setTab(item.key as Tab)}
              className={`px-4 py-2 rounded-lg font-semibold transition text-sm ${
                tab === item.key
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
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
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setItems(data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'portfolio');
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      setImage(data.url);
    } catch (error) { alert('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !image) { alert('Fill all fields'); return; }
    try {
      const res = await fetch('/api/portfolio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, description, image, category }) });
      const newItem = await res.json();
      setItems([newItem, ...items]);
      setTitle(''); setDescription(''); setCategory('Project'); setImage('');
      alert('Added!');
    } catch { alert('Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      await fetch(`/api/portfolio?id=${id}`, { method: 'DELETE' });
      setItems(items.filter(i => i.id !== id));
    } catch {}
  };

  return (
    <div className="bg-[#111] rounded-xl border border-white/10 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Add Portfolio Item</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
            <option>Project</option><option>Case Study</option><option>Campaign</option><option>Branding</option><option>Design</option>
          </select>
        </div>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Description" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40" />
        <div>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="text-white/60" />
          {uploading && <span className="text-white/40 ml-4">Uploading...</span>}
          {image && <div className="mt-2 w-20 h-20 rounded overflow-hidden"><img src={image} className="w-full h-full object-cover" /></div>}
        </div>
        <button type="submit" className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg font-medium hover:bg-[#FF9F66]">Add Item</button>
      </form>

      <div className="border-t border-white/10 mt-8 pt-8">
        <h3 className="text-lg font-bold text-white mb-4">Items ({items.length})</h3>
        {loading ? <p className="text-white/40">Loading...</p> : items.length === 0 ? <p className="text-white/40">No items</p> : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-white/10 overflow-hidden"><img src={item.image} className="w-full h-full object-cover" /></div>
                  <div><div className="text-white font-medium">{item.title}</div><div className="text-white/40 text-sm">{item.category}</div></div>
                </div>
                <button onClick={() => handleDelete(item.id)} className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 text-sm">Delete</button>
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
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setItems(data);
    } catch {}
    finally { setLoading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) { alert('Fill all fields'); return; }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'gallery');
    try {
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();
      const res = await fetch('/api/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, type, url: uploadData.url }) });
      const newItem = await res.json();
      setItems([newItem, ...items]);
      setTitle(''); setFile(null);
      alert('Added!');
    } catch { alert('Failed'); }
    finally { setUploading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      setItems(items.filter(i => i.id !== id));
    } catch {}
  };

  return (
    <div className="bg-[#111] rounded-xl border border-white/10 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Add Gallery Item</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40" />
          <select value={type} onChange={e => setType(e.target.value as 'image' | 'video')} className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
            <option value="image">Image</option><option value="video">Video</option>
          </select>
        </div>
        <div>
          <input type="file" accept={type === 'image' ? 'image/*' : 'video/*'} onChange={e => setFile(e.target.files?.[0] || null)} disabled={uploading} className="text-white/60" />
          {uploading && <span className="text-white/40 ml-4">Uploading...</span>}
        </div>
        <button type="submit" disabled={uploading} className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg font-medium hover:bg-[#FF9F66] disabled:opacity-50">{uploading ? 'Uploading...' : 'Add Item'}</button>
      </form>

      <div className="border-t border-white/10 mt-8 pt-8">
        <h3 className="text-lg font-bold text-white mb-4">Items ({items.length})</h3>
        {loading ? <p className="text-white/40">Loading...</p> : items.length === 0 ? <p className="text-white/40">No items</p> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map(item => (
              <div key={item.id} className="relative rounded-lg overflow-hidden">
                {item.type === 'image' ? <img src={item.url} className="w-full h-32 object-cover" /> : <div className="w-full h-32 bg-white/10 flex items-center justify-center text-white/40">🎬</div>}
                <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded">Delete</button>
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
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      const data = await response.json();
      setPosts(data);
    } catch {}
    finally { setLoading(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'portfolio');
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      setImage(data.url);
    } catch { alert('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt) { alert('Fill all fields'); return; }
    try {
      const res = await fetch('/api/blog', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, category, date, excerpt, image }) });
      const newPost = await res.json();
      setPosts([newPost, ...posts]);
      setTitle(''); setCategory('Strategy'); setExcerpt(''); setImage('');
      alert('Added!');
    } catch { alert('Failed'); }
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
    <div className="bg-[#111] rounded-xl border border-white/10 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Add Blog Post</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white" />
        </div>
        <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={3} placeholder="Excerpt" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40" />
        <div>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="text-white/60" />
          {uploading && <span className="text-white/40 ml-4">Uploading...</span>}
          {image && <div className="mt-2 w-20 h-20 rounded overflow-hidden"><img src={image} className="w-full h-full object-cover" /></div>}
        </div>
        <button type="submit" className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg font-medium hover:bg-[#FF9F66]">Add Post</button>
      </form>

      <div className="border-t border-white/10 mt-8 pt-8">
        <h3 className="text-lg font-bold text-white mb-4">Posts ({posts.length})</h3>
        {loading ? <p className="text-white/40">Loading...</p> : posts.length === 0 ? <p className="text-white/40">No posts</p> : (
          <div className="space-y-3">
            {posts.map(post => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-white/10 overflow-hidden">{post.image && <img src={post.image} className="w-full h-full object-cover" />}</div>
                  <div><div className="text-white font-medium">{post.title}</div><div className="text-white/40 text-sm">{post.category} | {post.date}</div></div>
                </div>
                <button onClick={() => handleDelete(post.id)} className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 text-sm">Delete</button>
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
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/work');
      const data = await response.json();
      setProjects(data);
    } catch {}
    finally { setLoading(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'portfolio');
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      setImage(data.url);
    } catch { alert('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) { alert('Fill all fields'); return; }
    try {
      const res = await fetch('/api/work', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, category, client, description, image }) });
      const newProject = await res.json();
      setProjects([newProject, ...projects]);
      setTitle(''); setCategory('Web Development'); setClient(''); setDescription(''); setImage('');
      alert('Added!');
    } catch { alert('Failed'); }
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
    <div className="bg-[#111] rounded-xl border border-white/10 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Add Work Project</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="text" value={client} onChange={e => setClient(e.target.value)} placeholder="Client name" className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40" />
        </div>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Description" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40" />
        <div>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="text-white/60" />
          {uploading && <span className="text-white/40 ml-4">Uploading...</span>}
          {image && <div className="mt-2 w-20 h-20 rounded overflow-hidden"><img src={image} className="w-full h-full object-cover" /></div>}
        </div>
        <button type="submit" className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg font-medium hover:bg-[#FF9F66]">Add Project</button>
      </form>

      <div className="border-t border-white/10 mt-8 pt-8">
        <h3 className="text-lg font-bold text-white mb-4">Projects ({projects.length})</h3>
        {loading ? <p className="text-white/40">Loading...</p> : projects.length === 0 ? <p className="text-white/40">No projects</p> : (
          <div className="space-y-3">
            {projects.map(project => (
              <div key={project.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded bg-white/10 overflow-hidden">{project.image && <img src={project.image} className="w-full h-full object-cover" />}</div>
                  <div><div className="text-white font-medium">{project.title}</div><div className="text-white/40 text-sm">{project.category} | {project.client}</div></div>
                </div>
                <button onClick={() => handleDelete(project.id)} className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 text-sm">Delete</button>
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
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/team');
      const data = await response.json();
      setMembers(data);
    } catch {}
    finally { setLoading(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'portfolio');
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await response.json();
      setImage(data.url);
    } catch { alert('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !bio) { alert('Fill all fields'); return; }
    try {
      const res = await fetch('/api/team', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, role, bio, image }) });
      const newMember = await res.json();
      setMembers([newMember, ...members]);
      setName(''); setRole(''); setBio(''); setImage('');
      alert('Added!');
    } catch { alert('Failed'); }
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
    <div className="bg-[#111] rounded-xl border border-white/10 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Add Team Member</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40" />
          <select value={role} onChange={e => setRole(e.target.value)} className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
            <option value="">Select role</option>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Bio" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40" />
        <div>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="text-white/60" />
          {uploading && <span className="text-white/40 ml-4">Uploading...</span>}
          {image && <div className="mt-2 w-20 h-20 rounded-full overflow-hidden"><img src={image} className="w-full h-full object-cover" /></div>}
        </div>
        <button type="submit" className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg font-medium hover:bg-[#FF9F66]">Add Member</button>
      </form>

      <div className="border-t border-white/10 mt-8 pt-8">
        <h3 className="text-lg font-bold text-white mb-4">Members ({members.length})</h3>
        {loading ? <p className="text-white/40">Loading...</p> : members.length === 0 ? <p className="text-white/40">No members</p> : (
          <div className="space-y-3">
            {members.map(member => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold">{member.name[0]}</div>
                  <div><div className="text-white font-medium">{member.name}</div><div className="text-white/40 text-sm">{member.role}</div></div>
                </div>
                <button onClick={() => handleDelete(member.id)} className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 text-sm">Delete</button>
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
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      setReviews(data);
    } catch {}
    finally { setLoading(false); }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !content) { alert('Fill all fields'); return; }
    try {
      const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, role, content, rating }) });
      const newReview = await res.json();
      setReviews([newReview, ...reviews]);
      setName(''); setRole(''); setContent(''); setRating(5);
      alert('Added!');
    } catch { alert('Failed'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return;
    try {
      await fetch(`/api/reviews?id=${id}`, { method: 'DELETE' });
      setReviews(reviews.filter(r => r.id !== id));
    } catch {}
  };

  return (
    <div className="bg-[#111] rounded-xl border border-white/10 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Add Review</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name" className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40" />
          <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="Role (e.g. CEO, Company)" className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40" />
        </div>
        <div>
          <label className="block text-white/60 text-sm mb-2">Rating</label>
          <select value={rating} onChange={e => setRating(parseInt(e.target.value))} className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white">
            {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>)}
          </select>
        </div>
        <textarea value={content} onChange={e => setContent(e.target.value)} rows={4} placeholder="Review content" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40" />
        <button type="submit" className="px-6 py-3 bg-[#FF6B35] text-white rounded-lg font-medium hover:bg-[#FF9F66]">Add Review</button>
      </form>

      <div className="border-t border-white/10 mt-8 pt-8">
        <h3 className="text-lg font-bold text-white mb-4">Reviews ({reviews.length})</h3>
        {loading ? <p className="text-white/40">Loading...</p> : reviews.length === 0 ? <p className="text-white/40">No reviews</p> : (
          <div className="space-y-3">
            {reviews.map(review => (
              <div key={review.id} className="p-4 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div><div className="text-white font-medium">{review.name}</div><div className="text-white/40 text-sm">{review.role}</div></div>
                  <div className="flex">{[...Array(review.rating)].map((_,i) => <span key={i} className="text-yellow-400">★</span>)}</div>
                </div>
                <p className="text-white/60 text-sm mb-2">&ldquo;{review.content}&rdquo;</p>
                <button onClick={() => handleDelete(review.id)} className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40 text-sm">Delete</button>
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

const HOMEPAGE_SECTIONS = [
  { key: 'hero-visual-1', label: 'Hero Visual: Media/Card 1' },
  { key: 'hero-visual-2', label: 'Hero Visual: IT Solutions/Card 2' },
  { key: 'hero-visual-3', label: 'Hero Visual: Projects/Card 3' },
  { key: 'hero-visual-4', label: 'Hero Visual: Creative/Card 4' },
  { key: 'service-it', label: 'Service: IT Consultancy' },
  { key: 'service-media', label: 'Service: Media' },
  { key: 'service-project', label: 'Service: Project Mgmt' },
  { key: 'blog-1', label: 'Creative Edge: Post 1' },
  { key: 'blog-2', label: 'Creative Edge: Post 2' },
  { key: 'blog-3', label: 'Creative Edge: Post 3' },
  { key: 'events-1', label: 'Events: Weddings' },
  { key: 'events-2', label: 'Events: Birthdays' },
  { key: 'events-3', label: 'Events: Graduations' },
  { key: 'events-4', label: 'Events: Corporate' },
  { key: 'photography-1', label: 'Photography: Products' },
  { key: 'photography-2', label: 'Photography: Real Estate' },
  { key: 'photography-3', label: 'Photography: Food' },
  { key: 'photography-4', label: 'Photography: Fashion' },
  { key: 'portraits-1', label: 'Portraits: Corporate' },
  { key: 'portraits-2', label: 'Portraits: Family' },
  { key: 'portraits-3', label: 'Portraits: Headshots' },
  { key: 'portraits-4', label: 'Portraits: Creative' },
  { key: 'photo-tourism-1', label: 'Photo Tourism: Mountains' },
  { key: 'photo-tourism-2', label: 'Photo Tourism: Beach' },
  { key: 'photo-tourism-3', label: 'Photo Tourism: City' },
  { key: 'photo-tourism-4', label: 'Photo Tourism: Nature' },
  { key: 'visuals-1', label: 'Visuals: Brand Design' },
  { key: 'visuals-2', label: 'Visuals: Social Media' },
  { key: 'visuals-3', label: 'Visuals: Product' },
  { key: 'visuals-4', label: 'Visuals: Video' },
  { key: 'newsletter-bg', label: 'Newsletter Background' },
  { key: 'about-ceo', label: 'About: CEO Photo' },
  { key: 'portfolio-1', label: 'Portfolio: Work 1' },
  { key: 'portfolio-2', label: 'Portfolio: Work 2' },
  { key: 'portfolio-3', label: 'Portfolio: Work 3' },
  { key: 'portfolio-4', label: 'Portfolio: Work 4' },
  { key: 'portfolio-5', label: 'Portfolio: Work 5' },
  { key: 'portfolio-6', label: 'Portfolio: Work 6' },
  { key: 'gallery-1', label: 'Gallery: Image 1' },
  { key: 'gallery-2', label: 'Gallery: Image 2' },
  { key: 'gallery-3', label: 'Gallery: Image 3' },
  { key: 'gallery-4', label: 'Gallery: Image 4' },
  { key: 'gallery-5', label: 'Gallery: Image 5' },
  { key: 'gallery-6', label: 'Gallery: Image 6' },
  { key: 'gallery-7', label: 'Gallery: Image 7' },
  { key: 'gallery-8', label: 'Gallery: Image 8' },
  { key: 'gallery-9', label: 'Gallery: Image 9' },
  { key: 'gallery-10', label: 'Gallery: Image 10' },
  { key: 'gallery-11', label: 'Gallery: Image 11' },
  { key: 'gallery-12', label: 'Gallery: Image 12' },
];

function HomepageManager() {
  const [images, setImages] = useState<HomepageImage[]>([]);
  const [selectedSection, setSelectedSection] = useState(HOMEPAGE_SECTIONS[0].key);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { loadImages(); }, []);

  const loadImages = async () => {
    try {
      const res = await fetch('/api/homepage-images');
      if (res.ok) { const data = await res.json(); setImages(data); }
    } catch (e) { console.error('Failed to load images:', e); }
  };

  const handleUpload = async () => {
    if (!file) { setMessage('Please select an image first'); return; }
    setUploading(true); setMessage('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'homepage');
      formData.append('section', selectedSection);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) { setMessage('Image uploaded successfully!'); setFile(null); loadImages(); } 
      else { setMessage(data.error || 'Upload failed'); }
    } catch (e) { setMessage('Upload failed: ' + (e instanceof Error ? e.message : 'Unknown error')); } 
    finally { setUploading(false); }
  };

  const getImageForSection = (section: string) => images.find(img => img.section === section)?.imageUrl || '';

  return (
    <div className="bg-[#111] rounded-2xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-6">Homepage Images</h2>
      <p className="text-white/60 text-sm mb-6">Upload images for the homepage sections.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {HOMEPAGE_SECTIONS.map((section) => (
          <div key={section.key} className="bg-[#0a0a0a] rounded-xl p-4 border border-white/10">
            <h3 className="text-sm font-medium text-white mb-3">{section.label}</h3>
            {getImageForSection(section.key) ? (
              <div className="relative mb-3">
                <img src={getImageForSection(section.key)} alt={section.label} className="w-full h-24 object-cover rounded-lg" />
                <button onClick={async () => { const img = images.find(i => i.section === section.key); if (img?.id) { await fetch(`/api/homepage-images?id=${img.id}`, { method: 'DELETE' }); loadImages(); }}} className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded">Delete</button>
              </div>
            ) : ( <div className="w-full h-24 bg-white/5 rounded-lg mb-3 flex items-center justify-center text-white/30 text-sm">No image</div> )}
            {selectedSection === section.key && ( <div className="mt-2"><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-xs text-white/60 mb-2" />{file && (<button onClick={handleUpload} disabled={uploading} className="w-full bg-[#FF6B35] text-white text-sm py-2 rounded-lg font-medium disabled:opacity-50">{uploading ? 'Uploading...' : 'Upload'}</button>)}</div> )}
            <button onClick={() => setSelectedSection(section.key)} className="text-xs text-[#FF6B35] hover:underline">{selectedSection === section.key ? 'Selected' : 'Select to upload'}</button>
          </div>
        ))}
      </div>
      {message && (<div className={`mt-4 p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{message}</div>)}
    </div>
  );
}