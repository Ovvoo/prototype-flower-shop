// 🎁 Recipient Form Component
// Форма данных получателя (Шаг 3)

'use client'

import { UseFormReturn } from 'react-hook-form'
import { CheckoutFormValues } from '@/lib/validation/checkoutSchema'
import { CHECKOUT_CONSTANTS } from '@/lib/types/checkout'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

interface RecipientFormProps {
  form: UseFormReturn<CheckoutFormValues>
}

/**
 * Форма данных получателя
 */
export function RecipientForm({ form }: RecipientFormProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = form

  const giftWrap = watch('gift_wrap') as boolean | undefined
  const greetingText = watch('greeting_card_text') as string | undefined

  return (
    <div className="bg-white rounded-lg p-6 border">
      <h3 className="text-lg font-semibold mb-4">
        Данные получателя и дополнения
      </h3>

      <div className="space-y-4">
        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 Если получатель не вы, укажите его данные. Если поля пустые,
            используются данные заказчика.
          </p>
        </div>

        {/* Recipient Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ФИО получателя
          </label>
          <Input
            {...register('recipient_name')}
            type="text"
            placeholder="Оставьте пустым, если получатель - вы"
            error={errors.recipient_name?.message}
          />
        </div>

        {/* Recipient Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Телефон получателя
          </label>
          <Input
            {...register('recipient_phone')}
            type="tel"
            placeholder="+7 (999) 123-45-67"
            error={errors.recipient_phone?.message}
          />
          <p className="text-xs text-gray-500 mt-1">
            Курьер позвонит по этому номеру при доставке
          </p>
        </div>

        {/* Greeting Card */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Текст поздравительной открытки
          </label>
          <Textarea
            {...register('greeting_card_text')}
            rows={4}
            placeholder="Напишите пожелание или поздравление"
            maxLength={CHECKOUT_CONSTANTS.GREETING_CARD_MAX_LENGTH}
            error={errors.greeting_card_text?.message}
          />
          <p className="text-xs text-gray-500 mt-1">
            Ваше сообщение будет написано на открытке от руки
          </p>
        </div>

        {/* Gift Wrap */}
        <div className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <input
            {...register('gift_wrap')}
            type="checkbox"
            id="gift_wrap"
            className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
          />
          <label
            htmlFor="gift_wrap"
            className="flex-1 cursor-pointer select-none"
          >
            <span className="font-medium text-gray-900">
              Подарочная упаковка
            </span>
            <span className="text-sm text-gray-500 block">
              +{CHECKOUT_CONSTANTS.GIFT_WRAP_PRICE} ₽ · Красивая упаковка с
              лентой
            </span>
          </label>
          {giftWrap && (
            <span className="text-green-600 text-sm font-medium">
              ✓ Добавлено
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
