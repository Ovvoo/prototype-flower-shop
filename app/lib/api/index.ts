/**
 * Централизованный экспорт всех API сервисов
 * Переиспользуемые API методы для всего приложения
 */

export { default as apiClient } from './client';
export { productsApi } from './products';
export { categoriesApi } from './categories';
export { authApi } from './auth';
export { ordersApi } from './orders';
export { reviewsApi } from './reviews';
export { promoApi } from './promo';
