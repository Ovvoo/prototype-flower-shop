/**
 * Типы для работы с заказами
 * Переиспользуемые типы для Orders API
 */

import { Product } from './product';
import { User } from './user';

export interface Order {
  id: number;
  order_number: string;
  user: User | null;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  delivery_fee: number;
  total_amount: number;
  status: OrderStatus;
  status_label: string;
  payment_status: PaymentStatus;
  payment_status_label: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: DeliveryAddress;
  full_address: string;
  delivery_date: string;
  delivery_time: string;
  recipient_name: string | null;
  recipient_phone: string | null;
  greeting_card_text: string | null;
  gift_wrap: boolean;
  payment_method: PaymentMethod;
  promo_code: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  product?: Product;
}

export interface DeliveryAddress {
  city: string;
  street: string;
  house: string;
  apartment?: string;
  entrance?: string;
  floor?: string;
  intercom?: string;
}

export type OrderStatus = 'new' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'online' | 'cash_on_delivery';

export interface CreateOrderRequest {
  items: {
    product_id: number;
    quantity: number;
  }[];
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: DeliveryAddress;
  delivery_date: string;
  delivery_time: string;
  recipient_name?: string;
  recipient_phone?: string;
  greeting_card_text?: string;
  gift_wrap?: boolean;
  payment_method: PaymentMethod;
  promo_code?: string;
}

export interface OrderTrackingInfo {
  order_number: string;
  status: OrderStatus;
  status_label: string;
  payment_status: PaymentStatus;
  payment_status_label: string;
  delivery_date: string;
  delivery_time: string;
  history: OrderHistoryItem[];
}

export interface OrderHistoryItem {
  old_status: string;
  new_status: string;
  comment: string | null;
  created_at: string;
}
