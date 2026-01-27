// 👤 Profile Page
// Страница профиля пользователя

'use client'

import { useState, useEffect } from 'react'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { User } from '@/lib/types'
import { UpdateProfileFormValues, ChangePasswordFormValues } from '@/lib/validation/profileSchema'

/**
 * Страница профиля пользователя
 */
export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Загрузка данных пользователя через authApi.getMe()
    // Сейчас используем mock данные
    const fetchUser = async () => {
      try {
        // Mock данные
        await new Promise((resolve) => setTimeout(resolve, 500))

        const mockUser: User = {
          id: 1,
          name: 'Иван Иванов',
          email: 'ivan@example.com',
          phone: '+7 (999) 123-45-67',
          role: 'customer',
          birth_date: '1990-05-15',
          created_at: '2024-01-15T10:00:00Z',
        }

        setUser(mockUser)
      } catch (error) {
        console.error('Failed to load user:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleUpdateProfile = async (data: UpdateProfileFormValues) => {
    // TODO: Интеграция с API
    // await authApi.updateProfile(data)
    console.log('Update profile:', data)

    // Mock обновление
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (user) {
      setUser({
        ...user,
        name: data.name,
        phone: data.phone,
        birth_date: data.birth_date || null,
      })
    }
  }

  const handleChangePassword = async (data: ChangePasswordFormValues) => {
    // TODO: Интеграция с API
    // await authApi.changePassword(data)
    console.log('Change password:', data)

    // Mock смена пароля
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <p className="text-gray-600">Не удалось загрузить данные профиля</p>
      </div>
    )
  }

  return (
    <ProfileForm
      user={user}
      onUpdateProfile={handleUpdateProfile}
      onChangePassword={handleChangePassword}
    />
  )
}
