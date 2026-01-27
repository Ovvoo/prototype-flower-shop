/**
 * Reviews API Service
 * Переиспользуемые методы для работы с отзывами
 */

import apiClient from './client';
import {
  Review,
  CreateReviewRequest,
  ReviewFilters,
  PaginatedResponse,
} from '@/lib/types';

export const reviewsApi = {
  /**
   * Получить список отзывов
   */
  getReviews(filters?: ReviewFilters): Promise<PaginatedResponse<Review>> {
    return apiClient.get<PaginatedResponse<Review>>('/reviews', filters);
  },

  /**
   * Создать отзыв
   */
  createReview(data: CreateReviewRequest): Promise<{ message: string; review: Review }> {
    return apiClient.post<{ message: string; review: Review }>('/reviews', data);
  },

  /**
   * Отметить отзыв как полезный
   */
  markHelpful(reviewId: number): Promise<{ message: string; helpful_count: number }> {
    return apiClient.post<{ message: string; helpful_count: number }>(
      `/reviews/${reviewId}/helpful`
    );
  },

  /**
   * Отметить отзыв как бесполезный
   */
  markUnhelpful(reviewId: number): Promise<{ message: string; unhelpful_count: number }> {
    return apiClient.post<{ message: string; unhelpful_count: number }>(
      `/reviews/${reviewId}/unhelpful`
    );
  },
};
