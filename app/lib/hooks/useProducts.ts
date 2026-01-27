/**
 * useProducts Hook
 * Переиспользуемый хук для работы с товарами
 */

'use client';

import { useState, useEffect } from 'react';
import { productsApi } from '@/lib/api';
import {
  Product,
  ProductFilters,
  PaginatedResponse,
  ProductWithRelated,
  AvailableFilters,
  ApiError,
} from '@/lib/types';

export function useProducts(filters?: ProductFilters) {
  const [data, setData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await productsApi.getProducts(filters);
        setData(result);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(filters)]); // Зависимость от filters

  return { data, loading, error };
}

export function useProduct(id: number | string) {
  const [data, setData] = useState<ProductWithRelated | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await productsApi.getProduct(id);
        setData(result);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { data, loading, error };
}

export function useFeaturedProducts() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await productsApi.getFeaturedProducts();
        setData(result.data);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return { data, loading, error };
}

export function useNewProducts() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchNew = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await productsApi.getNewProducts();
        setData(result.data);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
      }
    };

    fetchNew();
  }, []);

  return { data, loading, error };
}

export function useAvailableFilters() {
  const [data, setData] = useState<AvailableFilters>({
    flower_types: [],
    colors: [],
    occasions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await productsApi.getAvailableFilters();
        setData(result);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  return { data, loading, error };
}
