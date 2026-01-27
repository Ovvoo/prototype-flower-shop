// ⭐ Star Rating Component
// Компонент для отображения и выбора рейтинга

'use client'

interface StarRatingProps {
  rating: number // 0-5
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean // Можно ли выбирать рейтинг
  onChange?: (rating: number) => void
}

export function StarRating({
  rating,
  size = 'md',
  interactive = false,
  onChange
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const stars = [1, 2, 3, 4, 5]

  const handleClick = (value: number) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => {
        const filled = star <= rating
        const halfFilled = star === Math.ceil(rating) && rating % 1 !== 0

        return (
          <button
            key={star}
            type="button"
            onClick={() => handleClick(star)}
            disabled={!interactive}
            className={`
              ${sizeClasses[size]}
              ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
            `}
            aria-label={`${star} звезда`}
          >
            {halfFilled ? (
              <svg
                className="w-full h-full text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <defs>
                  <linearGradient id="half">
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="#e5e7eb" stopOpacity="1" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#half)"
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            ) : (
              <svg
                className={`w-full h-full ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            )}
          </button>
        )
      })}
    </div>
  )
}
