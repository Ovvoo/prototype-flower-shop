/**
 * Orders API Service
 * Переиспользуемые методы для работы с заказами
 */

import apiClient from './client';
import {
  Order,
  CreateOrderRequest,
  PaginatedResponse,
  OrderTrackingInfo,
} from '@/lib/types';

export const ordersApi = {
  /**
   * Получить список заказов текущего пользователя
   */
  getOrders(page?: number): Promise<PaginatedResponse<Order>> {
    return apiClient.get<PaginatedResponse<Order>>('/orders', { page });
  },

  /**
   * Создать новый заказ
   */
  createOrder(data: CreateOrderRequest): Promise<{ message: string; order: Order }> {
    return apiClient.post<{ message: string; order: Order }>('/orders', data);
  },

  /**
   * Получить детали заказа по номеру
   */
  getOrder(orderNumber: string): Promise<{ data: Order }> {
    return apiClient.get<{ data: Order }>(`/orders/${encodeURIComponent(orderNumber)}`);
  },

  /**
   * Отследить заказ
   */
  trackOrder(orderNumber: string): Promise<OrderTrackingInfo> {
    return apiClient.get<OrderTrackingInfo>(
      `/orders/${encodeURIComponent(orderNumber)}/track`
    );
  },
};
