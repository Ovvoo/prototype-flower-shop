// 💳 Payment Method Selector Component
// Выбор способа оплаты (Шаг 4)

'use client'

import { UseFormReturn } from 'react-hook-form'
import { CheckoutFormValues } from '@/lib/validation/checkoutSchema'

interface PaymentMethodSelectorProps {
  form: UseFormReturn<CheckoutFormValues>
}

/**
 * Компонент выбора способа оплаты
 */
export function PaymentMethodSelector({ form }: PaymentMethodSelectorProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form

  const paymentMethod = watch('payment_method')

  return (
    <div className="bg-white rounded-lg p-6 border">
      <h3 className="text-lg font-semibold mb-4">Способ оплаты</h3>

      <div className="space-y-3">
        {/* Online Payment */}
        <label
          className={`
            flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer
            transition-all hover:shadow-md
            ${
              paymentMethod === 'online'
                ? 'border-pink-600 bg-pink-50'
                : 'border-gray-200 hover:border-pink-300'
            }
          `}
        >
          <input
            {...register('payment_method')}
            type="radio"
            value="online"
            className="mt-1 w-5 h-5 text-pink-600 border-gray-300 focus:ring-pink-500"
          />

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">
                Онлайн (карта, СБП)
              </span>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                Рекомендуем
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Оплата банковской картой или через Систему Быстрых Платежей.
              Безопасно и мгновенно.
            </p>

            {/* Payment Icons */}
            <div className="flex gap-2 mt-2">
              <div className="px-2 py-1 bg-white border rounded text-xs font-medium">
                Visa
              </div>
              <div className="px-2 py-1 bg-white border rounded text-xs font-medium">
                Mastercard
              </div>
              <div className="px-2 py-1 bg-white border rounded text-xs font-medium">
                МИР
              </div>
              <div className="px-2 py-1 bg-white border rounded text-xs font-medium">
                СБП
              </div>
            </div>
          </div>

          {paymentMethod === 'online' && (
            <svg
              className="w-6 h-6 text-pink-600 flex-shrink-0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </label>

        {/* Cash on Delivery */}
        <label
          className={`
            flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer
            transition-all hover:shadow-md
            ${
              paymentMethod === 'cash_on_delivery'
                ? 'border-pink-600 bg-pink-50'
                : 'border-gray-200 hover:border-pink-300'
            }
          `}
        >
          <input
            {...register('payment_method')}
            type="radio"
            value="cash_on_delivery"
            className="mt-1 w-5 h-5 text-pink-600 border-gray-300 focus:ring-pink-500"
          />

          <div className="flex-1">
            <span className="font-medium text-gray-900 block mb-1">
              Оплата при получении
            </span>
            <p className="text-sm text-gray-600">
              Наличными или картой курьеру при получении заказа.
            </p>
          </div>

          {paymentMethod === 'cash_on_delivery' && (
            <svg
              className="w-6 h-6 text-pink-600 flex-shrink-0"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </label>

        {/* Error Message */}
        {errors.payment_method && (
          <p className="text-sm text-red-600 mt-2">
            {errors.payment_method.message}
          </p>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-2">
          <svg
            className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-900">
              Безопасная оплата
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Все платежи защищены SSL-шифрованием. Мы не храним данные ваших
              карт.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
