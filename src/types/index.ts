export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  trending: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  inStock?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
}