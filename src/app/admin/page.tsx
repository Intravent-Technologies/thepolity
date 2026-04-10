'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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

export default function AdminDashboard() {
  const [tab, setTab] = useState<'portfolio' | 'gallery'>('portfolio');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          {/* Tab Navigation */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setTab('portfolio')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                tab === 'portfolio'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Portfolio Manager
            </button>
            <button
              onClick={() => setTab('gallery')}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                tab === 'gallery'
                  ? 'bg-orange-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Gallery Manager
            </button>
          </div>

          {/* Portfolio Manager */}
          {tab === 'portfolio' && <PortfolioManager />}

          {/* Gallery Manager */}
          {tab === 'gallery' && <GalleryManager />}
        </div>
      </main>
      <Footer />
    </>
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

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'portfolio');

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setImage(data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !image) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, image, category }),
      });

      const newItem = await response.json();
      setItems([...items, newItem]);
      setTitle('');
      setDescription('');
      setCategory('Project');
      setImage('');
      alert('Portfolio item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await fetch(`/api/portfolio?id=${id}`, { method: 'DELETE' });
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Portfolio Item</h2>

        <form onSubmit={handleAddItem} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Project title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option>Project</option>
                <option>Case Study</option>
                <option>Campaign</option>
                <option>Branding</option>
                <option>Design</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Project description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
              />
              {uploading && <span className="text-sm text-gray-600">Uploading...</span>}
            </div>
            {image && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Image uploaded:</p>
                <div className="w-32 h-32 rounded overflow-hidden">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold"
          >
            Add Portfolio Item
          </button>
        </form>
      </div>

      {/* Items List */}
      <div className="border-t p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Portfolio Items</h3>

        {loading ? (
          <p className="text-gray-600">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-600">No portfolio items yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-16 h-16 rounded overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
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

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !file) {
      alert('Please fill all fields');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'gallery');

    try {
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadResponse.json();

      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type, url: uploadData.url }),
      });

      const newItem = await response.json();
      setItems([...items, newItem]);
      setTitle('');
      setFile(null);
      setType('image');
      alert('Gallery item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Gallery Item</h2>

        <form onSubmit={handleAddItem} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Gallery item title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as 'image' | 'video')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === 'image' ? 'Upload Image' : 'Upload Video'}
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept={type === 'image' ? 'image/*' : 'video/*'}
                onChange={e => setFile(e.target.files?.[0] || null)}
                disabled={uploading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
              />
              {uploading && <span className="text-sm text-gray-600">Uploading...</span>}
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-semibold disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Add Gallery Item'}
          </button>
        </form>
      </div>

      {/* Items List */}
      <div className="border-t p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Gallery Items</h3>

        {loading ? (
          <p className="text-gray-600">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-600">No gallery items yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <div
                key={item.id}
                className="rounded-lg overflow-hidden shadow hover:shadow-lg transition"
              >
                <div className="h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl">🎬</div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
