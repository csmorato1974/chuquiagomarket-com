export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
  sellerId: string;
  sellerName: string;
  createdAt: Date;
  location?: string;
}

export type Category = 
  | 'electronics'
  | 'fashion'
  | 'home'
  | 'sports'
  | 'vehicles'
  | 'other';

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'electronics', name: 'Electrónica', icon: '📱', color: 'category-electronics' },
  { id: 'fashion', name: 'Moda', icon: '👗', color: 'category-fashion' },
  { id: 'home', name: 'Hogar', icon: '🏠', color: 'category-home' },
  { id: 'sports', name: 'Deportes', icon: '⚽', color: 'category-sports' },
  { id: 'vehicles', name: 'Vehículos', icon: '🚗', color: 'category-vehicles' },
  { id: 'other', name: 'Otros', icon: '📦', color: 'category-other' },
];
