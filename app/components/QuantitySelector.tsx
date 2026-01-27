// QuantitySelector Component
// Reusable quantity selector for product page and cart

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md'
}

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = 'md',
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  const buttonStyles = size === 'sm'
    ? 'px-3 py-3 min-w-[44px] min-h-[44px]'  // ✅ WCAG 2.2 - 44×44px
    : 'px-4 py-3 min-w-[48px] min-h-[48px]'  // ✅ 48×48px

  const valueStyles = size === 'sm'
    ? 'px-4 py-3 min-h-[44px]'
    : 'px-6 py-3 min-h-[48px]'

  return (
    <div className="flex items-center border rounded-lg">
      <button
        onClick={handleDecrement}
        disabled={value <= min}
        className={`${buttonStyles} hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation flex items-center justify-center`}
        aria-label="Уменьшить количество"
      >
        −
      </button>
      <span className={`${valueStyles} font-bold flex items-center justify-center`}>{value}</span>
      <button
        onClick={handleIncrement}
        disabled={value >= max}
        className={`${buttonStyles} hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation flex items-center justify-center`}
        aria-label="Увеличить количество"
      >
        +
      </button>
    </div>
  )
}
