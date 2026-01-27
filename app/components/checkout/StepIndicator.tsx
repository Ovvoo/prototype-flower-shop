// 📍 Step Indicator Component
// Индикатор прогресса оформления заказа

'use client'

import { type CheckoutStep, type StepMeta } from '@/lib/types/checkout'

interface StepIndicatorProps {
  currentStep: CheckoutStep
  totalSteps: number
  stepMeta: StepMeta
}

/**
 * Компонент индикатора шагов
 */
export function StepIndicator({
  currentStep,
  totalSteps,
  stepMeta,
}: StepIndicatorProps) {
  return (
    <div className="mb-6 sm:mb-8">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = (index + 1) as CheckoutStep
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              {/* Step Circle */}
              <div
                className={`
                  flex items-center justify-center
                  w-12 h-12 sm:w-10 sm:h-10
                  rounded-full font-semibold text-sm transition-all
                  ${
                    isActive
                      ? 'bg-pink-600 text-white ring-4 ring-pink-100'
                      : isCompleted
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {isCompleted ? (
                  // Checkmark icon
                  <svg
                    className="w-5 h-5 sm:w-4 sm:h-4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>

              {/* Connecting Line */}
              {stepNumber < totalSteps && (
                <div
                  className={`
                    flex-1 h-0.5 sm:h-1 mx-1 sm:mx-2 transition-all
                    ${isCompleted ? 'bg-pink-600' : 'bg-gray-200'}
                  `}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Title & Description */}
      <div className="text-center px-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">{stepMeta.title}</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{stepMeta.description}</p>
      </div>
    </div>
  )
}
