// 🔐 Auth Validation Schema
// Yup схемы для валидации форм входа и регистрации

import * as yup from 'yup'

/**
 * Regex для валидации телефона в формате +7 (999) 999-99-99
 */
const PHONE_REGEX = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/

/**
 * Схема валидации формы входа
 */
export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Введите email')
    .email('Некорректный формат email')
    .max(255, 'Email слишком длинный'),

  password: yup
    .string()
    .required('Введите пароль')
    .min(8, 'Пароль должен содержать минимум 8 символов'),

  remember_me: yup.boolean().default(false),
})

/**
 * Схема валидации формы регистрации
 */
export const registerSchema = yup.object({
  name: yup
    .string()
    .required('Введите ваше имя')
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(255, 'Имя слишком длинное'),

  email: yup
    .string()
    .required('Введите email')
    .email('Некорректный формат email')
    .max(255, 'Email слишком длинный'),

  phone: yup
    .string()
    .required('Введите номер телефона')
    .matches(PHONE_REGEX, 'Формат: +7 (999) 999-99-99'),

  password: yup
    .string()
    .required('Введите пароль')
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .max(100, 'Пароль слишком длинный'),

  password_confirmation: yup
    .string()
    .required('Подтвердите пароль')
    .oneOf([yup.ref('password')], 'Пароли не совпадают'),
})

/**
 * Типы для форм (автоматически из схем Yup)
 */
export type LoginFormValues = yup.InferType<typeof loginSchema>
export type RegisterFormValues = yup.InferType<typeof registerSchema>
