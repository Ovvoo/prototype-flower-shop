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
  async getProduct(id: number | string): Promise<ProductWithRelated> {
    const response = await apiClient.get<{ data: Product; related_products: Product[] }>(`/products/${id}`);
    // Transform API response to ProductWithRelated format
    return {
      product: response.data,
      related_products: response.related_products || [],
    };
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
