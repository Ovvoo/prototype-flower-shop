// 🔐 Auth Modal Component
// Модальное окно с табами для входа и регистрации

'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

type AuthTab = 'login' | 'register'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: AuthTab
  onSuccess?: () => void
}

/**
 * Модальное окно авторизации с табами
 */
export function AuthModal({
  isOpen,
  onClose,
  defaultTab = 'login',
  onSuccess,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>(defaultTab)

  const handleSuccess = () => {
    onSuccess?.()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="py-2">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('login')}
            className={`
              flex-1 py-3 px-4 text-center font-semibold transition-colors
              ${
                activeTab === 'login'
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            Вход
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`
              flex-1 py-3 px-4 text-center font-semibold transition-colors
              ${
                activeTab === 'register'
                  ? 'text-pink-600 border-b-2 border-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            Регистрация
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'login' ? (
            <LoginForm
              onSuccess={handleSuccess}
              onSwitchToRegister={() => setActiveTab('register')}
            />
          ) : (
            <RegisterForm
              onSuccess={handleSuccess}
              onSwitchToLogin={() => setActiveTab('login')}
            />
          )}
        </div>
      </div>
    </Modal>
  )
}
