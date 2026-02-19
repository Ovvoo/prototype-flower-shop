/**
 * Server-side Fetch Utilities
 * Утилиты для получения данных на сервере (для generateMetadata)
 */

import type { Product, ProductWithRelated } from '@/lib/types';
import { isDemoMode, getMockResponse } from '@/lib/mock/handler';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Получить товар по ID (server-side)
 */
export async function fetchProduct(id: string | number): Promise<ProductWithRelated | null> {
  if (isDemoMode()) {
    const mock = getMockResponse(`/products/${id}`) as { data: Product; related_products: Product[] } | null;
    if (!mock) return null;
    return { product: mock.data, related_products: mock.related_products || [] };
  }

  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Failed to fetch product ${id}: ${response.status}`);
      return null;
    }

    const apiResponse = await response.json();

    return {
      product: apiResponse.data,
      related_products: apiResponse.related_products || [],
    };
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

/**
 * Получить категорию по ID или slug (server-side)
 */
export async function fetchCategory(idOrSlug: string | number) {
  if (isDemoMode()) {
    const mock = getMockResponse(`/categories/${idOrSlug}`) as { data: any } | null;
    return mock?.data || null;
  }

  try {
    const response = await fetch(`${API_URL}/categories/${idOrSlug}`, {
      cache: 'force-cache',
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const apiResponse = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error(`Error fetching category ${idOrSlug}:`, error);
    return null;
  }
}

/**
 * Получить список товаров (server-side)
 */
export async function fetchProducts(filters?: Record<string, any>) {
  if (isDemoMode()) {
    return getMockResponse('/products', filters);
  }

  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }

    const url = `${API_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const apiResponse = await response.json();
    return apiResponse;
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
}

/**
 * Получить страницу контента по slug (server-side)
 */
export async function fetchPage(slug: string) {
  if (isDemoMode()) {
    const mock = getMockResponse(`/pages/${slug}`) as { data: any } | null;
    return mock?.data || null;
  }

  try {
    const response = await fetch(`${API_URL}/pages/${slug}`, {
      cache: 'force-cache',
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const apiResponse = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error);
    return null;
  }
}

/**
 * Получить блог пост по slug (server-side)
 */
export async function fetchBlogPost(slug: string) {
  try {
    const response = await fetch(`${API_URL}/blog-posts/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const apiResponse = await response.json();
    return apiResponse.data;
  } catch (error) {
    console.error(`Error fetching blog post ${slug}:`, error);
    return null;
  }
}
