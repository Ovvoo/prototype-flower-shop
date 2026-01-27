// PriceDisplay Component
// Reusable price display with optional compare_at_price

interface PriceDisplayProps {
  price: number
  compareAtPrice?: number | null
  size?: 'sm' | 'md' | 'lg'
}

export function PriceDisplay({ price, compareAtPrice, size = 'md' }: PriceDisplayProps) {
  const sizeStyles = {
    sm: { price: 'text-lg', compare: 'text-sm' },
    md: { price: 'text-2xl', compare: 'text-sm' },
    lg: { price: 'text-4xl', compare: 'text-2xl' },
  }

  const styles = sizeStyles[size]

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <span className={`${styles.price} font-bold text-pink-600`}>
        {price.toLocaleString()} ₽
      </span>
      {compareAtPrice && (
        <span className={`${styles.compare} text-gray-400 line-through`}>
          {compareAtPrice.toLocaleString()} ₽
        </span>
      )}
    </div>
  )
}
