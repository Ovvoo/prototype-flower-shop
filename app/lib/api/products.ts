/**
 * Products API Service
 * Переиспользуемые методы для работы с товарами
 */

import apiClient from './client';
import {
  Product,
  ProductFilters,
  PaginatedResponse,
  ProductWithRelated,
  AvailableFilters,
} from '@/lib/types';

export const productsApi = {
  /**
   * Получить список товаров с фильтрацией
   */
  getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    return apiClient.get<PaginatedResponse<Product>>('/products', filters);
  },

  /**
   * Получить товар по ID
   */
  getProduct(id: number | string): Promise<ProductWithRelated> {
    return apiClient.get<ProductWithRelated>(`/products/${id}`);
  },

  /**
   * Получить популярные товары
   */
  getFeaturedProducts(): Promise<{ data: Product[] }> {
    return apiClient.get<{ data: Product[] }>('/products/featured');
  },

  /**
   * Получить новинки
   */
  getNewProducts(): Promise<{ data: Product[] }> {
    return apiClient.get<{ data: Product[] }>('/products/new');
  },

  /**
   * Получить доступные значения для фильтров
   */
  getAvailableFilters(): Promise<AvailableFilters> {
    return apiClient.get<AvailableFilters>('/products/filters');
  },
};
