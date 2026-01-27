/**
 * Sitemap Generator
 * Динамическая генерация sitemap.xml
 */

import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flowershop.ru';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

/**
 * Получить все товары для sitemap
 */
async function fetchProductsForSitemap() {
  try {
    const response = await fetch(`${API_URL}/products?per_page=1000`, {
      next: { revalidate: 3600 }, // Обновляем раз в час
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
    return [];
  }
}

/**
 * Получить все категории для sitemap
 */
async function fetchCategoriesForSitemap() {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
    return [];
  }
}

/**
 * Получить все блог посты для sitemap
 */
async function fetchBlogPostsForSitemap() {
  try {
    const response = await fetch(`${API_URL}/blog-posts?per_page=1000`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    // Блог может быть не реализован
    return [];
  }
}

/**
 * Получить все страницы контента для sitemap
 */
async function fetchPagesForSitemap() {
  try {
    const response = await fetch(`${API_URL}/pages`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    // Страницы могут быть не реализованы
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Получаем данные
  const products = await fetchProductsForSitemap();
  const categories = await fetchCategoriesForSitemap();
  const blogPosts = await fetchBlogPostsForSitemap();
  const pages = await fetchPagesForSitemap();

  const now = new Date();

  // Статические страницы
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/catalog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/cart`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // Товары
  const productPages: MetadataRoute.Sitemap = products.map((product: any) => ({
    url: `${SITE_URL}/product/${product.id}`,
    lastModified: product.updated_at || product.created_at || now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Категории
  const categoryPages: MetadataRoute.Sitemap = categories.map((category: any) => ({
    url: `${SITE_URL}/catalog?category=${category.slug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.7,
  }));

  // Блог посты
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post: any) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.updated_at || post.published_at || now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Страницы контента
  const contentPages: MetadataRoute.Sitemap = pages.map((page: any) => ({
    url: `${SITE_URL}/${page.slug}`,
    lastModified: page.updated_at || now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...productPages,
    ...categoryPages,
    ...blogPages,
    ...contentPages,
  ];
}
