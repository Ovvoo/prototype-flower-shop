// 📝 Checkout Validation Schema
// Yup схемы для валидации формы оформления заказа

import * as yup from 'yup'
import { CHECKOUT_CONSTANTS } from '../types/checkout'

/**
 * Regex для валидации телефона в формате +7 (999) 999-99-99
 */
const PHONE_REGEX = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/

/**
 * Схема валидации контактных данных (Шаг 1)
 */
export const contactSchema = yup.object({
  customer_name: yup
    .string()
    .required('Введите ваше имя')
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(255, 'Имя слишком длинное'),

  customer_email: yup
    .string()
    .required('Введите email')
    .email('Некорректный формат email')
    .max(255, 'Email слишком длинный'),

  customer_phone: yup
    .string()
    .required('Введите номер телефона')
    .matches(PHONE_REGEX, 'Формат: +7 (999) 999-99-99'),
})

/**
 * Схема валидации адреса доставки
 */
export const deliveryAddressSchema = yup.object({
  city: yup.string().required('Выберите город'),

  street: yup
    .string()
    .required('Введите улицу')
    .min(2, 'Название улицы слишком короткое')
    .max(255, 'Название улицы слишком длинное'),

  house: yup
    .string()
    .required('Введите номер дома')
    .max(20, 'Номер дома слишком длинный'),

  apartment: yup.string().max(10, 'Номер квартиры слишком длинный'),

  entrance: yup.string().max(10, 'Номер подъезда слишком длинный'),

  floor: yup.string().max(10, 'Номер этажа слишком длинный'),

  intercom: yup.string().max(20, 'Код домофона слишком длинный'),
})

/**
 * Схема валидации данных доставки (Шаг 2)
 */
export const deliverySchema = yup.object({
  delivery_address: deliveryAddressSchema,

  delivery_date: yup
    .string()
    .required('Выберите дату доставки')
    .test('is-future', 'Дата доставки должна быть не раньше завтра', (value) => {
      if (!value) return false
      const selectedDate = new Date(value)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      return selectedDate >= tomorrow
    }),

  delivery_time: yup
    .string()
    .required('Выберите время доставки')
    .oneOf(
      ['9-12', '12-15', '15-18', '18-21'],
      'Выберите время из предложенных вариантов'
    ),
})

/**
 * Схема валидации данных получателя (Шаг 3)
 */
export const recipientSchema = yup.object({
  recipient_name: yup
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(255, 'Имя слишком длинное'),

  recipient_phone: yup
    .string()
    .matches(PHONE_REGEX, 'Формат: +7 (999) 999-99-99'),

  greeting_card_text: yup
    .string()
    .max(
      CHECKOUT_CONSTANTS.GREETING_CARD_MAX_LENGTH,
      `Максимум ${CHECKOUT_CONSTANTS.GREETING_CARD_MAX_LENGTH} символов`
    ),

  gift_wrap: yup.boolean().required(),
})

/**
 * Схема валидации способа оплаты (Шаг 4)
 */
export const paymentSchema = yup.object({
  payment_method: yup
    .string()
    .required('Выберите способ оплаты')
    .oneOf(
      ['online', 'cash_on_delivery'],
      'Выберите способ из предложенных вариантов'
    ),
})

/**
 * Полная схема валидации всей формы checkout
 */
export const checkoutSchema = yup.object({
  // Шаг 1: Контактные данные
  ...contactSchema.fields,

  // Шаг 2: Доставка
  ...deliverySchema.fields,

  // Шаг 3: Получатель
  ...recipientSchema.fields,

  // Шаг 4: Оплата
  ...paymentSchema.fields,

  // Дополнительные поля
  promo_code: yup.string().max(50, 'Промокод слишком длинный'),
})

/**
 * Тип для валидированных данных формы
 */
export type CheckoutFormValues = yup.InferType<typeof checkoutSchema>
