/**
 * Pages API Client
 * Публичные контентные страницы (CMS)
 */

import { apiClient } from './index';

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  cover_image: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export const pagesApi = {
  /**
   * Получить список всех опубликованных страниц
   */
  async getPages(): Promise<Page[]> {
    const response = await apiClient.get<{ data: Page[] }>('/pages');
    return response.data;
  },

  /**
   * Получить страницу по slug
   */
  async getPage(slug: string): Promise<Page> {
    const response = await apiClient.get<{ data: Page }>(`/pages/${slug}`);
    return response.data;
  },
};
