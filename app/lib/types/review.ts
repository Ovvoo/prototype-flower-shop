/**
 * Типы для работы с отзывами
 * Переиспользуемые типы для Reviews API
 */

import { User } from './user';

export interface Review {
  id: number;
  product_id: number;
  user: {
    name: string;
    avatar_url?: string;
  };
  order_id: number | null;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  status: ReviewStatus;
  admin_reply?: {
    text: string;
    replied_at: string;
  };
  helpful_count: number;
  unhelpful_count: number;
  user_vote?: 'helpful' | 'unhelpful' | null;
  created_at: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface CreateReviewRequest {
  product_id: number;
  order_id?: number;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export interface ReviewFilters {
  product_id?: number;
  rating?: number;
  sort_by?: 'latest' | 'helpful' | 'rating_high' | 'rating_low';
  page?: number;
}
