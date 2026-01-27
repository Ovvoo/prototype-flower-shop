// 📝 Textarea Component
// Переиспользуемый компонент textarea

import { forwardRef, TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  label?: string
  maxLength?: number
}

/**
 * Базовый Textarea компонент
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, label, className = '', maxLength, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 min-h-[120px] text-base sm:text-sm rounded-lg border transition-all resize-none
            focus:outline-none focus:ring-2 focus:ring-pink-500
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            ${className}
          `}
          {...props}
        />

        <div className="flex justify-between items-center mt-1">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {maxLength && (
            <p className="text-xs text-gray-500 ml-auto">
              {props.value?.toString().length || 0} / {maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
