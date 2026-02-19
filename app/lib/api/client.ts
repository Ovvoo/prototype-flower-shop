/**
 * Базовый API клиент
 * Переиспользуемый wrapper для работы с fetch
 */

import { ApiError } from '@/lib/types';

interface RequestConfig extends RequestInit {
  params?: Record<string, any>;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;

    // Загрузить токен из localStorage при инициализации (только на клиенте)
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  /**
   * Установить токен аутентификации
   */
  setToken(token: string | null) {
    this.token = token;

    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  /**
   * Получить текущий токен
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Построить URL с query параметрами
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(`${key}[]`, String(v)));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }

    return url.toString();
  }

  /**
   * Выполнить HTTP запрос
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    // Demo mode — return mock data without network request
    if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
      const { getMockResponse } = await import('@/lib/mock/handler');
      const mockData = getMockResponse(endpoint, config.params);
      if (mockData !== null) {
        return mockData as T;
      }
    }

    const { params, ...fetchConfig } = config;
    const url = this.buildURL(endpoint, params);

    // Установить заголовки
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(fetchConfig.headers as Record<string, string>),
    };

    // Добавить токен авторизации если есть
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers,
      });

      // Парсим JSON ответ
      const data = await response.json();

      // Обработка ошибок
      if (!response.ok) {
        const error: ApiError = {
          message: data.message || 'Произошла ошибка',
          errors: data.errors,
        };
        throw error;
      }

      return data as T;
    } catch (error) {
      // Если это уже наша ApiError, пробрасываем дальше
      if (error && typeof error === 'object' && 'message' in error) {
        throw error;
      }

      // Иначе создаем новую ошибку
      throw {
        message: 'Ошибка сети. Проверьте подключение к интернету.',
      } as ApiError;
    }
  }

  /**
   * GET запрос
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  /**
   * POST запрос
   */
  async post<T>(endpoint: string, body?: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      params,
    });
  }

  /**
   * PUT запрос
   */
  async put<T>(endpoint: string, body?: any, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      params,
    });
  }

  /**
   * DELETE запрос
   */
  async delete<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      params,
    });
  }
}

// Создаем единственный экземпляр клиента (singleton)
const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
);

export default apiClient;
