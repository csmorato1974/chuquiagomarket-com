export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  images: string[];
  sellerId: string;
  sellerName: string;
  createdAt: Date;
  location?: string;
  freeShipping?: boolean;
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
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
}

export const CATEGORIES: CategoryInfo[] = [
  { id: 'electronics', name: 'Electrónica', image: 'electronics' },
  { id: 'fashion', name: 'Moda', image: 'fashion' },
  { id: 'home', name: 'Hogar', image: 'home' },
  { id: 'sports', name: 'Deportes', image: 'sports' },
  { id: 'vehicles', name: 'Vehículos', image: 'vehicles' },
  { id: 'other', name: 'Otros', image: 'other' },
];
