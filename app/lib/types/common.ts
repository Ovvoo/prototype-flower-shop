/**
 * Общие переиспользуемые типы
 */

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  app: string;
}

export interface PaginationInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  path?: string;
  average_rating?: number;
  rating_distribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  last_page: number;
  current_page?: number;
  per_page?: number;
  links?: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta?: PaginationInfo;
}
