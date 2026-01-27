/**
 * Типы для работы с пользователями и аутентификацией
 * Переиспользуемые типы для Auth API
 */

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  birth_date: string | null;
  created_at: string;
}

export type UserRole = 'admin' | 'manager' | 'customer';

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  birth_date?: string;
}
