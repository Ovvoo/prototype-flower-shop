// 📧 Contact Form Component
// Форма контактных данных (Шаг 1)

'use client'

import { UseFormReturn } from 'react-hook-form'
import { CheckoutFormValues } from '@/lib/validation/checkoutSchema'
import { Input } from '@/components/ui/Input'

interface ContactFormProps {
  form: UseFormReturn<CheckoutFormValues>
}

/**
 * Форма контактных данных
 */
export function ContactForm({ form }: ContactFormProps) {
  const {
    register,
    formState: { errors },
  } = form

  return (
    <div className="bg-white rounded-lg p-6 border">
      <h3 className="text-lg font-semibold mb-4">Контактные данные</h3>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ФИО <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('customer_name')}
            type="text"
            placeholder="Иван Иванов"
            error={errors.customer_name?.message}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('customer_email')}
            type="email"
            placeholder="example@mail.ru"
            error={errors.customer_email?.message}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Телефон <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('customer_phone')}
            type="tel"
            placeholder="+7 (999) 123-45-67"
            error={errors.customer_phone?.message}
          />
          <p className="text-xs text-gray-500 mt-1">
            Формат: +7 (999) 123-45-67
          </p>
        </div>
      </div>
    </div>
  )
}
