'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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

type DashboardTab = 'portfolio' | 'gallery';

export default function AdminDashboard() {
  const [tab, setTab] = useState<DashboardTab>('portfolio');
  const [status, setStatus] = useState<'checking' | 'authorized' | 'unauthorized'>('checking');
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const response = await fetch('/api/auth/session', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });
        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (data.authenticated) {
          setStatus('authorized');
          return;
        }
      } catch (error) {
        console.error('Failed to validate admin session:', error);
      }

      if (!cancelled) {
        setStatus('unauthorized');
        router.replace('/secure-admin-dashboard');
      }
    }

    checkSession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      router.replace('/secure-admin-dashboard');
      router.refresh();
    }
  };

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
          <div className="h-12 w-12 rounded-full border-4 border-orange-500 border-t-transparent" />
        </motion.div>
      </div>
    );
  }

  if (status !== 'authorized') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <motion.div
        className="border-b border-white/10 bg-white/5 backdrop-blur-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <motion.div className="flex items-center space-x-2">
            <motion.div
              className="h-8 w-8 rotate-45 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600"
              animate={{ rotate: [45, 50, 45] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <h1 className="text-2xl font-bold text-white">THE POLITY Admin</h1>
          </motion.div>
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg border border-red-500/50 bg-red-500/20 px-4 py-2 text-red-400 transition hover:bg-red-500/30"
          >
            Logout
          </motion.button>
        </div>
      </motion.div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div className="mb-8 flex space-x-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {(['portfolio', 'gallery'] as DashboardTab[]).map((tabName) => (
            <motion.button
              key={tabName}
              onClick={() => setTab(tabName)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-lg px-6 py-3 font-semibold capitalize transition ${
                tab === tabName
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                  : 'border border-white/20 bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {tabName} Manager
            </motion.button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {tab === 'portfolio' && <PortfolioManager key="portfolio" />}
          {tab === 'gallery' && <GalleryManager key="gallery" />}
        </AnimatePresence>
      </div>
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
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/portfolio', { cache: 'no-store' });
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'portfolio');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setImage(data.url);
    } catch (error) {
      console.error('Portfolio image upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !image) {
      alert('Please fill all fields and upload an image.');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, image, category }),
      });

      if (!response.ok) {
        throw new Error('Failed to create portfolio item');
      }

      const newItem = await response.json();
      setItems((current) => [newItem, ...current]);
      setTitle('');
      setDescription('');
      setCategory('Project');
      setImage('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      alert('Portfolio item added successfully.');
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      alert('Failed to add portfolio item');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/portfolio?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setItems((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      alert('Failed to delete portfolio item');
    }
  };

  return (
    <DashboardSection title="Add Portfolio Item">
      <form onSubmit={handleAddItem} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DashboardField label="Title">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Project title"
            />
          </DashboardField>

          <DashboardField label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option className="bg-gray-900">Project</option>
              <option className="bg-gray-900">Case Study</option>
              <option className="bg-gray-900">Campaign</option>
              <option className="bg-gray-900">Branding</option>
              <option className="bg-gray-900">Design</option>
            </select>
          </DashboardField>
        </div>

        <DashboardField label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Project description"
          />
        </DashboardField>

        <DashboardField label="Image">
          <label className="block cursor-pointer">
            <div className="rounded-lg border-2 border-dashed border-white/20 bg-white/5 px-4 py-3 text-center transition hover:bg-white/10">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              <p className="text-gray-400">{uploading ? 'Uploading...' : 'Click to upload image'}</p>
            </div>
          </label>
          {image && (
            <div className="mt-4 h-32 w-32 overflow-hidden rounded-lg border border-orange-500/50">
              <img src={image} alt="Portfolio preview" className="h-full w-full object-cover" />
            </div>
          )}
        </DashboardField>

        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Add Portfolio Item'}
        </button>
      </form>

      <DashboardListTitle title={`Portfolio Items (${items.length})`} />
      {loading ? (
        <p className="text-gray-400">Loading portfolio items...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-400">No portfolio items uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-lg border border-white/10 bg-white/5 transition hover:border-orange-500/50"
            >
              <div className="h-40 overflow-hidden bg-gradient-to-br from-orange-400/20 to-orange-600/20">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-white">{item.title}</h4>
                <p className="text-xs text-gray-400">{item.category}</p>
                <p className="mt-2 line-clamp-3 text-sm text-gray-300">{item.description}</p>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="mt-4 w-full rounded border border-red-500/50 bg-red-500/20 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/30"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );
}

function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'image' | 'video'>('image');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/gallery', { cache: 'no-store' });
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }

    if (selectedFile) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const resetForm = () => {
    setTitle('');
    setType('image');
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !file) {
      alert('Please add a title and choose a file.');
      return;
    }

    setUploading(true);
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'gallery');

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await uploadResponse.json();

      const response = await fetch('/api/gallery', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, url: uploadData.url }),
      });

      if (!response.ok) {
        throw new Error('Create failed');
      }

      const newItem = await response.json();
      setItems((current) => [newItem, ...current]);
      resetForm();
      alert('Gallery item added successfully.');
    } catch (error) {
      console.error('Error adding gallery item:', error);
      alert('Failed to add gallery item');
    } finally {
      setUploading(false);
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setItems((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      alert('Failed to delete gallery item');
    }
  };

  return (
    <DashboardSection title="Add Gallery Item">
      <form onSubmit={handleAddItem} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <DashboardField label="Title">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Media title"
            />
          </DashboardField>

          <DashboardField label="Type">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'image' | 'video')}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option className="bg-gray-900" value="image">Image</option>
              <option className="bg-gray-900" value="video">Video</option>
            </select>
          </DashboardField>
        </div>

        <DashboardField label={type === 'image' ? 'Upload Image' : 'Upload Video'}>
          <label className="block cursor-pointer">
            <div className="rounded-lg border-2 border-dashed border-white/20 bg-white/5 px-4 py-3 text-center transition hover:bg-white/10">
              <input
                ref={fileInputRef}
                type="file"
                accept={type === 'image' ? 'image/*' : 'video/*'}
                onChange={handleSelectFile}
                disabled={uploading}
                className="hidden"
              />
              <p className="text-gray-400">
                {uploading ? 'Uploading...' : `Click to upload ${type}`}
              </p>
            </div>
          </label>
          {previewUrl && (
            <div className="mt-4 overflow-hidden rounded-lg border border-orange-500/50 bg-black">
              {type === 'image' ? (
                <img src={previewUrl} alt="Gallery preview" className="h-48 w-full object-cover" />
              ) : (
                <video src={previewUrl} controls className="h-48 w-full object-cover" />
              )}
            </div>
          )}
        </DashboardField>

        <button
          type="submit"
          disabled={saving || uploading}
          className="w-full rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-orange-600 hover:to-orange-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Add Gallery Item'}
        </button>
      </form>

      <DashboardListTitle title={`Gallery Items (${items.length})`} />
      {loading ? (
        <p className="text-gray-400">Loading gallery items...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-400">No gallery items uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-lg border border-white/10 bg-white/5 transition hover:border-orange-500/50"
            >
              <div className="h-48 bg-black">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.title} className="h-full w-full object-cover" />
                ) : (
                  <video src={item.url} controls className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-white">{item.title}</h4>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{item.type}</p>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="mt-4 w-full rounded border border-red-500/50 bg-red-500/20 px-3 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/30"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );
}

function DashboardSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="mb-6 text-2xl font-bold text-white">{title}</h2>
        {children}
      </div>
    </motion.div>
  );
}

function DashboardField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-300">{label}</label>
      {children}
    </div>
  );
}

function DashboardListTitle({ title }: { title: string }) {
  return <h3 className="text-xl font-bold text-white">{title}</h3>;
}
