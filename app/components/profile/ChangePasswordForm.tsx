// 🔒 Change Password Form Component
// Форма смены пароля

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { changePasswordSchema, ChangePasswordFormValues } from '@/lib/validation/profileSchema'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordFormValues) => Promise<void>
  onCancel: () => void
}

/**
 * Форма смены пароля
 */
export function ChangePasswordForm({ onSubmit, onCancel }: ChangePasswordFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema) as any,
  })

  const handleFormSubmit = async (data: ChangePasswordFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      await onSubmit(data)
      reset()
    } catch (err) {
      setError('Ошибка при смене пароля. Проверьте текущий пароль.')
      console.error('Change password error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Current Password */}
      <Input
        {...register('current_password')}
        type="password"
        label="Текущий пароль"
        placeholder="••••••••"
        error={errors.current_password?.message}
        disabled={isLoading}
        required
        autoComplete="current-password"
      />

      {/* New Password */}
      <Input
        {...register('new_password')}
        type="password"
        label="Новый пароль"
        placeholder="••••••••"
        error={errors.new_password?.message}
        disabled={isLoading}
        required
        autoComplete="new-password"
      />

      {/* New Password Confirmation */}
      <Input
        {...register('new_password_confirmation')}
        type="password"
        label="Подтверждение нового пароля"
        placeholder="••••••••"
        error={errors.new_password_confirmation?.message}
        disabled={isLoading}
        required
        autoComplete="new-password"
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Изменение...' : 'Изменить пароль'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Отмена
        </Button>
      </div>
    </form>
  )
}
