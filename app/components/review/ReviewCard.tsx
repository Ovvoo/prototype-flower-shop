// 💬 Review Card Component
// Карточка одного отзыва

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { StarRating } from './StarRating'

export interface Review {
  id: number
  user: {
    name: string
    avatar_url?: string
  }
  rating: number
  title: string
  comment: string
  images: string[]
  created_at: string
  admin_reply?: {
    text: string
    replied_at: string
  }
  helpful_count: number
  unhelpful_count: number
  user_vote?: 'helpful' | 'unhelpful' | null
}

interface ReviewCardProps {
  review: Review
  onVote?: (reviewId: number, helpful: boolean) => void
}

export function ReviewCard({ review, onVote }: ReviewCardProps) {
  const [userVote, setUserVote] = useState<'helpful' | 'unhelpful' | null>(
    review.user_vote || null
  )
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count)
  const [unhelpfulCount, setUnhelpfulCount] = useState(review.unhelpful_count)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const handleVote = (helpful: boolean) => {
    const newVote = helpful ? 'helpful' : 'unhelpful'

    // Если уже проголосовал так же - убрать голос
    if (userVote === newVote) {
      setUserVote(null)
      if (helpful) {
        setHelpfulCount(helpfulCount - 1)
      } else {
        setUnhelpfulCount(unhelpfulCount - 1)
      }
    } else {
      // Если проголосовал по-другому - переключить
      if (userVote === 'helpful') {
        setHelpfulCount(helpfulCount - 1)
      } else if (userVote === 'unhelpful') {
        setUnhelpfulCount(unhelpfulCount - 1)
      }

      setUserVote(newVote)
      if (helpful) {
        setHelpfulCount(helpfulCount + 1)
      } else {
        setUnhelpfulCount(unhelpfulCount + 1)
      }
    }

    if (onVote) {
      onVote(review.id, helpful)
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
            {review.user.avatar_url ? (
              <Image
                src={review.user.avatar_url}
                alt={review.user.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            ) : (
              review.user.name.charAt(0).toUpperCase()
            )}
          </div>

          <div>
            <p className="font-semibold text-gray-900">{review.user.name}</p>
            <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
          </div>
        </div>

        <StarRating rating={review.rating} size="sm" />
      </div>

      {/* Title */}
      {review.title && (
        <h3 className="font-semibold text-gray-900 mb-2">{review.title}</h3>
      )}

      {/* Comment */}
      <p className="text-gray-700 mb-4 whitespace-pre-line">{review.comment}</p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {review.images.map((image, index) => (
            <div
              key={index}
              className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100"
            >
              <Image
                src={image}
                alt={`Фото отзыва ${index + 1}`}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Admin Reply */}
      {review.admin_reply && (
        <div className="bg-pink-50 border-l-4 border-pink-600 p-4 mb-4 rounded">
          <p className="font-semibold text-pink-900 mb-1">Ответ администрации:</p>
          <p className="text-gray-700 text-sm">{review.admin_reply.text}</p>
          <p className="text-xs text-gray-500 mt-2">
            {formatDate(review.admin_reply.replied_at)}
          </p>
        </div>
      )}

      {/* Helpful Buttons */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">Был ли отзыв полезен?</p>
        <button
          onClick={() => handleVote(true)}
          className={`
            flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${userVote === 'helpful'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          👍 Да ({helpfulCount})
        </button>
        <button
          onClick={() => handleVote(false)}
          className={`
            flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${userVote === 'unhelpful'
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }
          `}
        >
          👎 Нет ({unhelpfulCount})
        </button>
      </div>
    </div>
  )
}
