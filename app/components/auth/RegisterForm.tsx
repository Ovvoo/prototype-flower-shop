// 📝 Register Form Component
// Форма регистрации с валидацией через React Hook Form + Yup

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registerSchema, RegisterFormValues } from '@/lib/validation/authSchema'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface RegisterFormProps {
  onSuccess?: () => void
  onSwitchToLogin?: () => void
}

/**
 * Форма регистрации нового пользователя
 */
export function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setApiError(null)

    try {
      // TODO: Интеграция с API (когда backend будет готов)
      // const user = await register(data)
      // if (user) {
      //   onSuccess?.()
      // }
      console.log('Register data:', data)

      // Mock успешная регистрация (пока без API)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSuccess?.()
    } catch (error) {
      setApiError('Ошибка регистрации. Возможно, email уже используется.')
      console.error('Register error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* API Error */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {apiError}
        </div>
      )}

      {/* Name */}
      <Input
        {...register('name')}
        type="text"
        label="Имя"
        placeholder="Иван Иванов"
        error={errors.name?.message}
        disabled={isLoading}
        required
        autoComplete="name"
      />

      {/* Email */}
      <Input
        {...register('email')}
        type="email"
        label="Email"
        placeholder="ivan@example.com"
        error={errors.email?.message}
        disabled={isLoading}
        required
        autoComplete="email"
      />

      {/* Phone */}
      <Input
        {...register('phone')}
        type="tel"
        label="Телефон"
        placeholder="+7 (999) 123-45-67"
        error={errors.phone?.message}
        disabled={isLoading}
        required
        autoComplete="tel"
      />

      {/* Password */}
      <Input
        {...register('password')}
        type="password"
        label="Пароль"
        placeholder="••••••••"
        error={errors.password?.message}
        disabled={isLoading}
        required
        autoComplete="new-password"
      />

      {/* Password Confirmation */}
      <Input
        {...register('password_confirmation')}
        type="password"
        label="Подтверждение пароля"
        placeholder="••••••••"
        error={errors.password_confirmation?.message}
        disabled={isLoading}
        required
        autoComplete="new-password"
      />

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
      </Button>

      {/* Switch to Login */}
      {onSwitchToLogin && (
        <p className="text-center text-sm text-gray-600">
          Уже есть аккаунт?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
            disabled={isLoading}
          >
            Войдите
          </button>
        </p>
      )}
    </form>
  )
}
