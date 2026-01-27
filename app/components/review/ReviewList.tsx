// 📋 Review List Component
// Список отзывов с пагинацией и сортировкой

'use client'

import { useState } from 'react'
import { ReviewCard, Review } from './ReviewCard'

interface ReviewListProps {
  reviews: Review[]
  totalReviews: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onSortChange?: (sortBy: string) => void
  onRatingFilter?: (rating: number | null) => void
  onVote?: (reviewId: number, helpful: boolean) => void
}

export function ReviewList({
  reviews,
  totalReviews,
  currentPage,
  totalPages,
  onPageChange,
  onSortChange,
  onRatingFilter,
  onVote
}: ReviewListProps) {
  const [sortBy, setSortBy] = useState('recent')
  const [ratingFilter, setRatingFilter] = useState<number | null>(null)

  const handleSortChange = (value: string) => {
    setSortBy(value)
    if (onSortChange) {
      onSortChange(value)
    }
  }

  const handleRatingFilter = (rating: number | null) => {
    setRatingFilter(rating)
    if (onRatingFilter) {
      onRatingFilter(rating)
    }
  }

  return (
    <div>
      {/* Filters and Sort */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {/* Rating Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-gray-700">Фильтр:</span>
            <button
              onClick={() => handleRatingFilter(null)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${ratingFilter === null
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              Все отзывы
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => handleRatingFilter(rating)}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1
                  ${ratingFilter === rating
                    ? 'bg-pink-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
              >
                {rating} ⭐
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Сортировка:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="recent">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="highest">Высокий рейтинг</option>
              <option value="lowest">Низкий рейтинг</option>
              <option value="helpful">Самые полезные</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-lg">Пока нет отзывов</p>
          <p className="text-gray-400 text-sm mt-2">
            Станьте первым, кто оставит отзыв на этот товар!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} onVote={onVote} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Назад
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Показываем только 5 страниц вокруг текущей
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`
                          w-10 h-10 rounded-lg text-sm font-medium transition-colors
                          ${page === currentPage
                            ? 'bg-pink-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
                      >
                        {page}
                      </button>
                    )
                  } else if (page === currentPage - 3 || page === currentPage + 3) {
                    return (
                      <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-400">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
              </div>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Вперёд →
              </button>
            </div>
          )}

          {/* Reviews Counter */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Показано {reviews.length} из {totalReviews} отзывов
          </p>
        </>
      )}
    </div>
  )
}
