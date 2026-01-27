// 🛒 Cart Types
// Типы для работы с корзиной

import { Product } from './product'

/**
 * Элемент корзины
 */
export interface CartItem {
  product: Product
  quantity: number
}

/**
 * Данные корзины для отображения
 */
export interface CartSummary {
  items: CartItem[]
  itemsCount: number
  subtotal: number
  discount: number
  deliveryFee: number
  total: number
  promoCode: string | null
}
