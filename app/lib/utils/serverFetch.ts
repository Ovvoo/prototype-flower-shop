/**
 * Server-side Fetch Utilities
 * Утилиты для получения данных на сервере (для generateMetadata)
 */

import type { Product, ProductWithRelated } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Получить товар по ID (server-side)
 */
export async function fetchProduct(id: string | number): Promise<ProductWithRelated | null> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      cache: 'no-store', // Всегда свежие данные для SSR
    });

    if (!response.ok) {
      console.error(`Failed to fetch product ${id}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

/**
 * Получить категорию по ID или slug (server-side)
 */
export async function fetchCategory(idOrSlug: string | number) {
  try {
    const response = await fetch(`${API_URL}/categories/${idOrSlug}`, {
      cache: 'force-cache', // Кэшируем категории
      next: { revalidate: 3600 }, // Обновляем раз в час
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching category ${idOrSlug}:`, error);
    return null;
  }
}

/**
 * Получить список товаров (server-side)
 */
export async function fetchProducts(filters?: Record<string, any>) {
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return null;
  }
}

/**
 * Получить страницу контента по slug (server-side)
 */
export async function fetchPage(slug: string) {
  try {
    const response = await fetch(`${API_URL}/pages/${slug}`, {
      cache: 'force-cache',
      next: { revalidate: 3600 }, // Обновляем раз в час
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
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

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching blog post ${slug}:`, error);
    return null;
  }
}
