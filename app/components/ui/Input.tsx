// 🔤 Input Component
// Переиспользуемый компонент input с валидацией

import { forwardRef, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  label?: string
}

/**
 * Базовый Input компонент
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, className = '', ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          className={`
            w-full px-4 py-3 min-h-[48px] text-base sm:text-sm rounded-lg border transition-all
            focus:outline-none focus:ring-2 focus:ring-pink-500
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${className}
          `}
          {...props}
        />

        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
