// 👤 Profile Validation Schema
// Yup схемы для валидации профиля пользователя

import * as yup from 'yup'

/**
 * Regex для валидации телефона в формате +7 (999) 999-99-99
 */
const PHONE_REGEX = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/

/**
 * Схема валидации обновления профиля (без пароля)
 */
export const updateProfileSchema = yup.object({
  name: yup
    .string()
    .required('Введите ваше имя')
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(255, 'Имя слишком длинное'),

  phone: yup
    .string()
    .required('Введите номер телефона')
    .matches(PHONE_REGEX, 'Формат: +7 (999) 999-99-99'),

  birth_date: yup
    .string()
    .optional()
    .nullable()
    .transform((value) => value || null)
    .test('is-valid-date', 'Некорректная дата', (value) => {
      if (!value) return true // Опционально
      const date = new Date(value)
      return !isNaN(date.getTime())
    })
    .test('is-past', 'Дата рождения не может быть в будущем', (value) => {
      if (!value) return true
      return new Date(value) < new Date()
    }),
})

/**
 * Схема валидации смены пароля
 */
export const changePasswordSchema = yup.object({
  current_password: yup
    .string()
    .required('Введите текущий пароль')
    .min(8, 'Пароль должен содержать минимум 8 символов'),

  new_password: yup
    .string()
    .required('Введите новый пароль')
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .max(100, 'Пароль слишком длинный')
    .notOneOf(
      [yup.ref('current_password')],
      'Новый пароль должен отличаться от текущего'
    ),

  new_password_confirmation: yup
    .string()
    .required('Подтвердите новый пароль')
    .oneOf([yup.ref('new_password')], 'Пароли не совпадают'),
})

/**
 * Типы для форм (автоматически из схем Yup)
 */
export type UpdateProfileFormValues = yup.InferType<typeof updateProfileSchema>
export type ChangePasswordFormValues = yup.InferType<typeof changePasswordSchema>
