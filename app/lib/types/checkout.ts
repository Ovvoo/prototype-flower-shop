// 🛒 Checkout Types
// Типы для процесса оформления заказа

import { CartItem } from './cart'
import { DeliveryAddress, PaymentMethod } from './order'

/**
 * Данные контакта заказчика
 */
export interface ContactData {
  customer_name: string
  customer_email: string
  customer_phone: string
}

/**
 * Данные доставки
 */
export interface DeliveryData {
  delivery_address: DeliveryAddress
  delivery_date: string
  delivery_time: DeliveryTimeSlot
}

/**
 * Временные слоты доставки
 */
export type DeliveryTimeSlot = '9-12' | '12-15' | '15-18' | '18-21'

/**
 * Данные получателя (если отличается от заказчика)
 */
export interface RecipientData {
  recipient_name?: string
  recipient_phone?: string
  greeting_card_text?: string
  gift_wrap: boolean
}

/**
 * Данные оплаты
 */
export interface PaymentData {
  payment_method: PaymentMethod
}

/**
 * Полные данные заказа
 */
export interface CheckoutFormData
  extends ContactData,
    DeliveryData,
    RecipientData,
    PaymentData {
  items: CartItem[]
  promo_code?: string
}

/**
 * Шаги оформления заказа
 */
export type CheckoutStep = 1 | 2 | 3 | 4

/**
 * Метаданные текущего шага
 */
export interface StepMeta {
  step: CheckoutStep
  title: string
  description: string
  isValid: boolean
  isComplete: boolean
}

// CreateOrderRequest импортируется из './order'
// Используйте import { CreateOrderRequest } from './order'

/**
 * Список городов доставки
 */
export const DELIVERY_CITIES = [
  'Москва',
  'Санкт-Петербург',
  'Казань',
  'Екатеринбург',
  'Новосибирск',
] as const

export type DeliveryCity = (typeof DELIVERY_CITIES)[number]

/**
 * Временные слоты с описанием
 */
export const DELIVERY_TIME_SLOTS: Array<{
  value: DeliveryTimeSlot
  label: string
}> = [
  { value: '9-12', label: '9:00 - 12:00' },
  { value: '12-15', label: '12:00 - 15:00' },
  { value: '15-18', label: '15:00 - 18:00' },
  { value: '18-21', label: '18:00 - 21:00' },
]

/**
 * Константы для бизнес-логики
 */
export const CHECKOUT_CONSTANTS = {
  GIFT_WRAP_PRICE: 200, // Стоимость подарочной упаковки
  FREE_DELIVERY_THRESHOLD: 3000, // Порог бесплатной доставки
  DELIVERY_FEE: 500, // Стоимость доставки
  GREETING_CARD_MAX_LENGTH: 200, // Максимальная длина текста открытки
  COMMENT_MAX_LENGTH: 500, // Максимальная длина комментария
} as const
