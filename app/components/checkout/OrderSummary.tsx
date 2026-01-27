// 💰 Order Summary Component
// Sidebar с итоговой суммой заказа

'use client'

import Image from 'next/image'
import { useCartContext } from '@/contexts/CartContext'
import { CHECKOUT_CONSTANTS } from '@/lib/types/checkout'

/**
 * Форматирование цены
 */
function formatPrice(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(amount)
}

interface OrderSummaryProps {
  giftWrap?: boolean
}

/**
 * Компонент итоговой суммы заказа
 */
export function OrderSummary({ giftWrap = false }: OrderSummaryProps) {
  const {
    items,
    itemsCount,
    subtotal,
    discount,
    deliveryFee,
    total,
  } = useCartContext()

  // Добавить стоимость подарочной упаковки
  const giftWrapFee = giftWrap ? CHECKOUT_CONSTANTS.GIFT_WRAP_PRICE : 0
  const finalTotal = total + giftWrapFee

  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
      <h2 className="text-xl font-bold mb-4">Ваш заказ</h2>

      {/* Order Items */}
      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
        {items.map((item) => (
          <div key={item.product.id} className="flex gap-3">
            {/* Product Image */}
            <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
              <Image
                src={item.product.images[0] || '/placeholder-flower.jpg'}
                alt={item.product.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.product.name}
              </p>
              <p className="text-xs text-gray-500">{item.quantity} шт.</p>
            </div>

            {/* Price */}
            <span className="text-sm font-medium text-gray-900">
              {formatPrice(item.product.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="space-y-2 mb-4 pt-4 border-t border-gray-200">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Товары ({itemsCount})</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Скидка</span>
            <span className="font-medium">-{formatPrice(discount)}</span>
          </div>
        )}

        {/* Gift Wrap */}
        {giftWrap && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Подарочная упаковка</span>
            <span className="font-medium">{formatPrice(giftWrapFee)}</span>
          </div>
        )}

        {/* Delivery */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Доставка</span>
          <span className="font-medium">
            {deliveryFee === 0 ? (
              <span className="text-green-600">Бесплатно</span>
            ) : (
              formatPrice(deliveryFee)
            )}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between text-lg font-bold">
          <span>Итого</span>
          <span className="text-pink-600">{formatPrice(finalTotal)}</span>
        </div>
      </div>

      {/* Free Delivery Notice */}
      {subtotal < CHECKOUT_CONSTANTS.FREE_DELIVERY_THRESHOLD && (
        <div className="mt-4 text-xs text-center text-gray-500">
          До бесплатной доставки:{' '}
          {formatPrice(CHECKOUT_CONSTANTS.FREE_DELIVERY_THRESHOLD - subtotal)}
        </div>
      )}
    </div>
  )
}
