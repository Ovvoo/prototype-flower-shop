/**
 * useCategories Hook
 * Переиспользуемый хук для работы с категориями
 */

'use client';

import { useState, useEffect } from 'react';
import { categoriesApi } from '@/lib/api';
import { Category, ApiError } from '@/lib/types';

export function useCategories() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await categoriesApi.getCategories();
        setData(result.data);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { data, loading, error };
}

export function useCategory(slug: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await categoriesApi.getCategory(slug);
        setData(result);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  return { data, loading, error };
}
