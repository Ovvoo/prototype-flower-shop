// ✍️ Review Form Component
// Форма добавления отзыва

'use client'

import { useState } from 'react'
import { StarRating } from './StarRating'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

interface ReviewFormData {
  rating: number
  title: string
  comment: string
  images: string[]
}

interface ReviewFormProps {
  productId: number
  onSubmit: (data: ReviewFormData) => Promise<void>
  isAuthenticated: boolean
  onAuthRequired?: () => void
}

export function ReviewForm({
  productId,
  onSubmit,
  isAuthenticated,
  onAuthRequired
}: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    title: '',
    comment: '',
    images: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      if (onAuthRequired) {
        onAuthRequired()
      }
      return
    }

    // Validation
    if (formData.rating === 0) {
      setError('Пожалуйста, выберите рейтинг')
      return
    }

    if (formData.comment.trim().length < 10) {
      setError('Отзыв должен содержать минимум 10 символов')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      await onSubmit(formData)

      // Reset form
      setFormData({
        rating: 0,
        title: '',
        comment: '',
        images: []
      })
      setShowForm(false)
      alert('Спасибо за ваш отзыв! Он будет опубликован после модерации.')
    } catch (err) {
      setError('Не удалось отправить отзыв. Попробуйте ещё раз.')
      console.error('Submit review error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!showForm) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold mb-2">У вас есть опыт использования этого товара?</h3>
        <p className="text-gray-600 mb-4">
          Поделитесь своим мнением и помогите другим покупателям сделать правильный выбор!
        </p>
        <Button
          variant="primary"
          onClick={() => {
            if (!isAuthenticated && onAuthRequired) {
              onAuthRequired()
            } else {
              setShowForm(true)
            }
          }}
        >
          ✍️ Написать отзыв
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Написать отзыв</h3>

      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ваша оценка <span className="text-red-500">*</span>
          </label>
          <StarRating
            rating={formData.rating}
            size="lg"
            interactive
            onChange={(rating) => setFormData({ ...formData, rating })}
          />
          {formData.rating === 0 && (
            <p className="text-sm text-gray-500 mt-1">Нажмите на звёзды для выбора оценки</p>
          )}
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Заголовок отзыва
          </label>
          <Input
            type="text"
            placeholder="Кратко опишите ваше впечатление"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.title.length}/100 символов
          </p>
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ваш отзыв <span className="text-red-500">*</span>
          </label>
          <Textarea
            placeholder="Расскажите подробнее о вашем опыте использования товара..."
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={5}
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.comment.length}/1000 символов (минимум 10)
          </p>
        </div>

        {/* Images Upload */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Фотографии (до 3 шт)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-gray-600 mb-1">
              Перетащите изображения сюда или нажмите для выбора
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG до 5 МБ каждое
            </p>
            <p className="text-xs text-gray-400 mt-2">
              (Функция загрузки будет доступна после настройки хранилища)
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || formData.rating === 0 || formData.comment.trim().length < 10}
          >
            {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowForm(false)}
          >
            Отмена
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Отзыв будет опубликован после проверки модератором
        </p>
      </form>
    </div>
  )
}
