/**
 * Типы для работы с товарами
 * Переиспользуемые типы для Products API
 */

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  discount_percent: number | null;
  images: string[];
  main_image: string;
  category: Category | null;
  stock: number;
  sku: string;
  weight: number | null;
  height: number | null;
  flower_types: string[];
  colors: string[];
  occasions: string[];
  is_featured: boolean;
  is_new: boolean;
  is_active: boolean;
  average_rating: number;
  reviews_count: number;
  views_count: number;
  sales_count: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: number | null;
  sort_order: number;
  is_active: boolean;
  products_count?: number;
  children?: Category[];
  parent?: Category | null;
  breadcrumbs?: { id: number; name: string; slug: string }[];
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category_id?: number;
  price_from?: number;
  price_to?: number;
  flower_types?: string[];
  colors?: string[];
  occasions?: string[];
  in_stock?: boolean;
  featured?: boolean;
  new?: boolean;
  search?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'popularity' | 'newest' | 'rating';
  page?: number;
  per_page?: number;
}

export interface ProductWithRelated {
  product: Product;
  related_products: Product[];
}

export interface AvailableFilters {
  flower_types: string[];
  colors: string[];
  occasions: string[];
}
