/**
 * Categories API Service
 * Переиспользуемые методы для работы с категориями
 */

import apiClient from './client';
import { Category } from '@/lib/types';

export const categoriesApi = {
  /**
   * Получить список категорий (древовидная структура)
   */
  getCategories(): Promise<{ data: Category[] }> {
    return apiClient.get<{ data: Category[] }>('/categories');
  },

  /**
   * Получить категорию по slug
   */
  getCategory(slug: string): Promise<{ data: Category; products: any }> {
    return apiClient.get(`/categories/${slug}`);
  },

  /**
   * Получить дерево категорий для навигации
   */
  getCategoryTree(): Promise<{ data: Category[] }> {
    return apiClient.get<{ data: Category[] }>('/categories/tree');
  },
};
