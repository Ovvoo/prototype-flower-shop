/**
 * Auth API Service
 * Переиспользуемые методы для аутентификации
 */

import apiClient from './client';
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  User,
  UpdateProfileRequest,
} from '@/lib/types';

export const authApi = {
  /**
   * Регистрация нового пользователя
   */
  register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  /**
   * Вход в систему
   */
  login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  /**
   * Выход из системы
   */
  logout(): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/auth/logout');
  },

  /**
   * Получить данные текущего пользователя
   */
  getMe(): Promise<{ data: User }> {
    return apiClient.get<{ data: User }>('/auth/me');
  },

  /**
   * Обновить профиль
   */
  updateProfile(data: UpdateProfileRequest): Promise<{ message: string; user: User }> {
    return apiClient.put<{ message: string; user: User }>('/auth/profile', data);
  },
};
