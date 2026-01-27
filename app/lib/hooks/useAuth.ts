/**
 * useAuth Hook
 * Переиспользуемый хук для аутентификации
 */

'use client';

import { useState } from 'react';
import { authApi, apiClient } from '@/lib/api';
import {
  RegisterRequest,
  LoginRequest,
  User,
  UpdateProfileRequest,
  ApiError,
} from '@/lib/types';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const register = async (data: RegisterRequest): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await authApi.register(data);

      // Сохранить токен
      apiClient.setToken(result.token);

      return result.user;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginRequest): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await authApi.login(data);

      // Сохранить токен
      apiClient.setToken(result.token);

      return result.user;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      await authApi.logout();

      // Удалить токен
      apiClient.setToken(null);

      return true;
    } catch (err) {
      setError(err as ApiError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileRequest): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await authApi.updateProfile(data);
      return result.user;
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    login,
    logout,
    updateProfile,
    loading,
    error,
  };
}
