/**
 * Mock API Handler
 * Маршрутизация запросов к mock-данным в демо-режиме
 */

import { mockProducts, mockCategories, mockAvailableFilters, mockPages } from './data';
import type { ProductFilters } from '@/lib/types';

/**
 * Проверяем, включён ли демо-режим
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}

/**
 * Обработать запрос и вернуть mock-данные
 * Возвращает null, если endpoint не обрабатывается
 */
export function getMockResponse(endpoint: string, params?: Record<string, any>): unknown | null {
  // Normalize: remove leading slash for matching
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // ── Products ──
  if (path === '/products/featured') {
    return { data: mockProducts.filter(p => p.is_featured) };
  }

  if (path === '/products/new') {
    return { data: mockProducts.filter(p => p.is_new) };
  }

  if (path === '/products/filters') {
    return mockAvailableFilters;
  }

  // Product by ID: /products/123
  const productIdMatch = path.match(/^\/products\/(\d+)$/);
  if (productIdMatch) {
    const id = parseInt(productIdMatch[1]);
    const product = mockProducts.find(p => p.id === id);
    if (!product) return null;
    const related = mockProducts
      .filter(p => p.id !== id && p.category?.id === product.category?.id)
      .slice(0, 3);
    return { data: product, related_products: related };
  }

  // Products list with filters: /products
  if (path === '/products') {
    return getFilteredProducts(params);
  }

  // ── Categories ──
  if (path === '/categories' || path === '/categories/tree') {
    return { data: mockCategories };
  }

  // Category by slug: /categories/bukety
  const categorySlugMatch = path.match(/^\/categories\/([a-z0-9-]+)$/);
  if (categorySlugMatch) {
    const slug = categorySlugMatch[1];
    const category = mockCategories.find(c => c.slug === slug);
    if (!category) return null;
    const products = mockProducts.filter(p => p.category?.id === category.id);
    return { data: category, products: { data: products, total: products.length } };
  }

  // ── Reviews ──
  if (path === '/reviews') {
    return {
      data: [],
      total: 0,
      last_page: 1,
      current_page: 1,
      per_page: 10,
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0,
        average_rating: 0,
        rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      },
    };
  }

  // ── Pages ──
  if (path === '/pages') {
    return { data: mockPages };
  }

  const pageSlugMatch = path.match(/^\/pages\/([a-z0-9-]+)$/);
  if (pageSlugMatch) {
    const slug = pageSlugMatch[1];
    const page = mockPages.find(p => p.slug === slug);
    if (!page) return null;
    return { data: page };
  }

  // ── Promo Codes ──
  if (path === '/promo-codes/validate') {
    return { valid: false, error: 'Промокоды недоступны в демо-режиме' };
  }

  // ── Orders (demo stubs) ──
  if (path === '/orders') {
    return { data: [], total: 0, last_page: 1, current_page: 1, per_page: 10 };
  }

  // ── Auth (demo stubs) ──
  if (path === '/auth/login' || path === '/auth/register') {
    return { message: 'Авторизация недоступна в демо-режиме' };
  }

  // Not handled — return null to fall through to real API
  return null;
}

/**
 * Фильтрация и пагинация продуктов
 */
function getFilteredProducts(params?: Record<string, any>) {
  let filtered = [...mockProducts];
  const filters = (params || {}) as Partial<ProductFilters> & Record<string, any>;

  // Category filter (supports both numeric ID and slug)
  if (filters.category_id) {
    const catId = Number(filters.category_id);
    if (!isNaN(catId)) {
      filtered = filtered.filter(p => p.category?.id === catId);
    } else {
      // Fallback: match by slug
      const slug = String(filters.category_id);
      filtered = filtered.filter(p => p.category?.slug === slug);
    }
  }

  // Price range
  if (filters.price_from) {
    filtered = filtered.filter(p => p.price >= Number(filters.price_from));
  }
  if (filters.price_to) {
    filtered = filtered.filter(p => p.price <= Number(filters.price_to));
  }

  // Flower types (OR logic)
  if (filters.flower_types) {
    const types = Array.isArray(filters.flower_types)
      ? filters.flower_types
      : [filters.flower_types];
    if (types.length > 0) {
      filtered = filtered.filter(p =>
        p.flower_types.some(ft => types.includes(ft))
      );
    }
  }

  // Colors (OR logic)
  if (filters.colors) {
    const colors = Array.isArray(filters.colors)
      ? filters.colors
      : [filters.colors];
    if (colors.length > 0) {
      filtered = filtered.filter(p =>
        p.colors.some(c => colors.includes(c))
      );
    }
  }

  // Occasions (OR logic)
  if (filters.occasions) {
    const occasions = Array.isArray(filters.occasions)
      ? filters.occasions
      : [filters.occasions];
    if (occasions.length > 0) {
      filtered = filtered.filter(p =>
        p.occasions.some(o => occasions.includes(o))
      );
    }
  }

  // Search
  if (filters.search) {
    const q = String(filters.search).toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  // Featured
  if (filters.featured) {
    filtered = filtered.filter(p => p.is_featured);
  }

  // New
  if (filters.new) {
    filtered = filtered.filter(p => p.is_new);
  }

  // Sort
  const sortBy = filters.sort_by || 'popularity';
  switch (sortBy) {
    case 'price_asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case 'rating':
      filtered.sort((a, b) => b.average_rating - a.average_rating);
      break;
    case 'popularity':
    default:
      filtered.sort((a, b) => b.sales_count - a.sales_count);
      break;
  }

  // Pagination
  const page = Number(filters.page) || 1;
  const perPage = Number(filters.per_page) || 24;
  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const start = (page - 1) * perPage;
  const paginatedData = filtered.slice(start, start + perPage);

  return {
    data: paginatedData,
    total,
    last_page: lastPage,
    current_page: page,
    per_page: perPage,
    links: { first: null, last: null, prev: null, next: null },
    meta: {
      current_page: page,
      last_page: lastPage,
      per_page: perPage,
      total,
      from: total > 0 ? start + 1 : 0,
      to: Math.min(start + perPage, total),
    },
  };
}
