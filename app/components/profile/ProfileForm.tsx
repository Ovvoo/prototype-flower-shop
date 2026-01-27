// 📝 Profile Form Component
// Форма редактирования профиля пользователя

'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { updateProfileSchema, UpdateProfileFormValues } from '@/lib/validation/profileSchema'
import { User } from '@/lib/types'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ChangePasswordForm } from './ChangePasswordForm'
import type { ChangePasswordFormValues } from '@/lib/validation/profileSchema'

interface ProfileFormProps {
  user: User
  onUpdateProfile?: (data: UpdateProfileFormValues) => Promise<void>
  onChangePassword?: (data: ChangePasswordFormValues) => Promise<void>
}

/**
 * Форма редактирования профиля пользователя
 */
export function ProfileForm({ user, onUpdateProfile, onChangePassword }: ProfileFormProps) {
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Форма профиля
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: yupResolver(updateProfileSchema) as any,
    defaultValues: {
      name: user.name,
      phone: user.phone,
      birth_date: user.birth_date || undefined,
    },
  })

  const onSubmitProfile = async (data: UpdateProfileFormValues) => {
    setIsLoadingProfile(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      await onUpdateProfile?.(data)
      setSuccessMessage('Профиль успешно обновлен')
    } catch (error) {
      setErrorMessage('Ошибка при обновлении профиля')
      console.error('Update profile error:', error)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handlePasswordChange = async (data: ChangePasswordFormValues) => {
    await onChangePassword?.(data)
    setSuccessMessage('Пароль успешно изменен')
    setShowPasswordForm(false)
  }

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Личные данные</h2>

          <div className="space-y-4">
            {/* Name */}
            <Input
              {...register('name')}
              type="text"
              label="Имя"
              placeholder="Иван Иванов"
              error={errors.name?.message}
              disabled={isLoadingProfile}
              required
            />

            {/* Email (disabled) */}
            <Input
              type="email"
              label="Email"
              value={user.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-sm text-gray-500 -mt-2">Email нельзя изменить</p>

            {/* Phone */}
            <Input
              {...register('phone')}
              type="tel"
              label="Телефон"
              placeholder="+7 (999) 123-45-67"
              error={errors.phone?.message}
              disabled={isLoadingProfile}
              required
            />

            {/* Birth Date */}
            <Input
              {...register('birth_date')}
              type="date"
              label="Дата рождения"
              error={errors.birth_date?.message}
              disabled={isLoadingProfile}
            />
          </div>

          <Button type="submit" className="mt-6" disabled={isLoadingProfile}>
            {isLoadingProfile ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </div>
      </form>

      {/* Change Password Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Безопасность</h2>

        {!showPasswordForm ? (
          <Button
            variant="secondary"
            onClick={() => setShowPasswordForm(true)}
            disabled={isLoadingProfile}
          >
            Сменить пароль
          </Button>
        ) : (
          <ChangePasswordForm
            onSubmit={handlePasswordChange}
            onCancel={() => setShowPasswordForm(false)}
          />
        )}
      </div>
    </div>
  )
}
