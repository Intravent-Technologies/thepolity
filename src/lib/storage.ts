import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'public', 'data');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

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

export function getPortfolioItems(): PortfolioItem[] {
  try {
    const filePath = path.join(DATA_DIR, 'portfolio.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (error) {
    console.error('Error reading portfolio:', error);
  }
  return [];
}

export function savePortfolioItems(items: PortfolioItem[]): void {
  const filePath = path.join(DATA_DIR, 'portfolio.json');
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
}

export function getGalleryItems(): GalleryItem[] {
  try {
    const filePath = path.join(DATA_DIR, 'gallery.json');
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (error) {
    console.error('Error reading gallery:', error);
  }
  return [];
}

export function saveGalleryItems(items: GalleryItem[]): void {
  const filePath = path.join(DATA_DIR, 'gallery.json');
  fs.writeFileSync(filePath, JSON.stringify(items, null, 2));
}

export function addPortfolioItem(item: Omit<PortfolioItem, 'id' | 'createdAt'>): PortfolioItem {
  const items = getPortfolioItems();
  const newItem: PortfolioItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  savePortfolioItems(items);
  return newItem;
}

export function addGalleryItem(item: Omit<GalleryItem, 'id' | 'createdAt'>): GalleryItem {
  const items = getGalleryItems();
  const newItem: GalleryItem = {
    ...item,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  items.push(newItem);
  saveGalleryItems(items);
  return newItem;
}

export function deletePortfolioItem(id: string): void {
  const items = getPortfolioItems();
  const itemToDelete = items.find((item) => item.id === id);
  const filtered = items.filter((item) => item.id !== id);
  savePortfolioItems(filtered);
  deleteUploadedAsset(itemToDelete?.image);
}

export function deleteGalleryItem(id: string): void {
  const items = getGalleryItems();
  const itemToDelete = items.find((item) => item.id === id);
  const filtered = items.filter((item) => item.id !== id);
  saveGalleryItems(filtered);
  deleteUploadedAsset(itemToDelete?.url);
}

function deleteUploadedAsset(assetPath?: string): void {
  if (!assetPath || !assetPath.startsWith('/uploads/')) {
    return;
  }

  const normalizedPath = assetPath.replace(/^\/+/, '').split('/').join(path.sep);
  const fullPath = path.join(process.cwd(), 'public', normalizedPath);

  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
}
