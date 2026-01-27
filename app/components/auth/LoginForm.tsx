// 🔑 Login Form Component
// Форма входа с валидацией через React Hook Form + Yup

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { loginSchema, LoginFormValues } from '@/lib/validation/authSchema'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface LoginFormProps {
  onSuccess?: () => void
  onSwitchToRegister?: () => void
}

/**
 * Форма входа в систему
 */
export function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      remember_me: false,
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setApiError(null)

    try {
      // TODO: Интеграция с API (когда backend будет готов)
      // const user = await login(data)
      // if (user) {
      //   onSuccess?.()
      // }
      console.log('Login data:', data)

      // Mock успешный вход (пока без API)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSuccess?.()
    } catch (error) {
      setApiError('Неверный email или пароль')
      console.error('Login error:', error)
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

      {/* Password */}
      <Input
        {...register('password')}
        type="password"
        label="Пароль"
        placeholder="••••••••"
        error={errors.password?.message}
        disabled={isLoading}
        required
        autoComplete="current-password"
      />

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer">
          <input
            {...register('remember_me')}
            type="checkbox"
            className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            disabled={isLoading}
          />
          <span className="ml-2 text-sm text-gray-600">Запомнить меня</span>
        </label>

        <button
          type="button"
          className="text-sm text-pink-600 hover:text-pink-700 transition-colors"
          disabled={isLoading}
        >
          Забыли пароль?
        </button>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Вход...' : 'Войти'}
      </Button>

      {/* Switch to Register */}
      {onSwitchToRegister && (
        <p className="text-center text-sm text-gray-600">
          Нет аккаунта?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
            disabled={isLoading}
          >
            Зарегистрируйтесь
          </button>
        </p>
      )}
    </form>
  )
}
