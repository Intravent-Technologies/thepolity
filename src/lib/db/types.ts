export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image: string;
}

export interface WorkProject {
  id: string;
  title: string;
  category: string;
  client: string;
  description: string;
  image: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface HomepageImage {
  id: string;
  section: string;
  imageUrl: string;
}

export type UploadType = 'portfolio' | 'gallery';

export interface UploadedAsset {
  url: string;
  filename: string;
}