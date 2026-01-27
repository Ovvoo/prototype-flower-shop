/**
 * Типы для работы с промокодами
 * Переиспользуемые типы для PromoCode API
 */

export interface PromoCode {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  min_order_amount?: number;
  max_discount?: number;
  usage_count?: number;
  usage_limit?: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
}

export interface ValidatePromoCodeRequest {
  code: string;
  cart_total: number;
}

export interface ValidatePromoCodeResponse {
  valid: boolean;
  promo_code?: PromoCode;
  calculated_discount?: number;
  cart_total_after_discount?: number;
  error?: string;
}
