/**
 * Promo Codes API Service
 * Переиспользуемые методы для работы с промокодами
 */

import apiClient from './client';
import {
  ValidatePromoCodeRequest,
  ValidatePromoCodeResponse,
} from '@/lib/types';

export const promoApi = {
  /**
   * Валидировать промокод
   */
  validatePromoCode(data: ValidatePromoCodeRequest): Promise<ValidatePromoCodeResponse> {
    return apiClient.post<ValidatePromoCodeResponse>('/promo-codes/validate', data);
  },
};
