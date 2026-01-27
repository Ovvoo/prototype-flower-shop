// 🚚 Delivery Form Component
// Форма данных доставки (Шаг 2)

'use client'

import { UseFormReturn, FieldPath } from 'react-hook-form'
import { CheckoutFormValues } from '@/lib/validation/checkoutSchema'
import {
  DELIVERY_CITIES,
  DELIVERY_TIME_SLOTS,
} from '@/lib/types/checkout'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface DeliveryFormProps {
  form: UseFormReturn<CheckoutFormValues>
}

// Type assertion helper for nested field paths
type DeliveryAddressField = `delivery_address.${keyof CheckoutFormValues['delivery_address']}`

/**
 * Форма данных доставки
 */
export function DeliveryForm({ form }: DeliveryFormProps) {
  const {
    register,
    formState: { errors },
  } = form

  // Helper to safely get nested address errors
  const addressErrors = errors.delivery_address as Record<string, { message?: string }> | undefined

  // Минимальная дата - завтра
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="bg-white rounded-lg p-6 border">
      <h3 className="text-lg font-semibold mb-4">Доставка</h3>

      <div className="space-y-4">
        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Город <span className="text-red-500">*</span>
          </label>
          <Select
            {...register('delivery_address.city' as FieldPath<CheckoutFormValues>)}
            error={addressErrors?.city?.message}
          >
            <option value="">Выберите город</option>
            {DELIVERY_CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </div>

        {/* Street */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Улица <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('delivery_address.street' as FieldPath<CheckoutFormValues>)}
            type="text"
            placeholder="Ленина"
            error={addressErrors?.street?.message}
          />
        </div>

        {/* House, Apartment, Entrance */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дом <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('delivery_address.house' as FieldPath<CheckoutFormValues>)}
              type="text"
              placeholder="10"
              error={addressErrors?.house?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Квартира
            </label>
            <Input
              {...register('delivery_address.apartment' as FieldPath<CheckoutFormValues>)}
              type="text"
              placeholder="25"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Подъезд
            </label>
            <Input
              {...register('delivery_address.entrance' as FieldPath<CheckoutFormValues>)}
              type="text"
              placeholder="2"
            />
          </div>
        </div>

        {/* Floor, Intercom */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Этаж
            </label>
            <Input
              {...register('delivery_address.floor' as FieldPath<CheckoutFormValues>)}
              type="text"
              placeholder="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Домофон
            </label>
            <Input
              {...register('delivery_address.intercom' as FieldPath<CheckoutFormValues>)}
              type="text"
              placeholder="123"
            />
          </div>
        </div>

        {/* Delivery Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата доставки <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('delivery_date')}
              type="date"
              min={minDate}
              error={errors.delivery_date?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Время доставки <span className="text-red-500">*</span>
            </label>
            <Select
              {...register('delivery_time')}
              error={errors.delivery_time?.message}
            >
              {DELIVERY_TIME_SLOTS.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
