// 📦 Order Card Component
// Карточка заказа для списка с превью товаров и действиями

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Order } from '@/lib/types/order'
import { Button } from '@/components/ui/Button'
import { OrderStatusBadge } from './OrderStatusBadge'

interface OrderCardProps {
  order: Order
  onRepeatOrder?: (order: Order) => void
}

/**
 * Форматирование даты
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

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

/**
 * Компонент карточки заказа
 */
export function OrderCard({ order, onRepeatOrder }: OrderCardProps) {
  const maxVisibleItems = 3
  const visibleItems = order.items.slice(0, maxVisibleItems)
  const remainingCount = order.items.length - maxVisibleItems

  const handleRepeatOrder = () => {
    if (onRepeatOrder) {
      onRepeatOrder(order)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <Link
            href={`/order/${order.order_number.replace('#', '')}`}
            className="text-xl font-bold text-gray-900 hover:text-pink-600 transition"
          >
            Заказ {order.order_number}
          </Link>
          <p className="text-sm text-gray-500 mt-1">{formatDate(order.created_at)}</p>
        </div>
        <OrderStatusBadge status={order.status} statusLabel={order.status_label} />
      </div>

      {/* Items Preview */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-3">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
            >
              {item.product_image ? (
                <Image
                  src={item.product_image}
                  alt={item.product_name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  Нет фото
                </div>
              )}
            </div>
          ))}
          {remainingCount > 0 && (
            <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">+{remainingCount}</span>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="space-y-1">
          {order.items.map((item) => (
            <p key={item.id} className="text-sm text-gray-600">
              {item.product_name} × {item.quantity}
            </p>
          ))}
        </div>
      </div>

      {/* Delivery Info */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Доставка:</span> {formatDate(order.delivery_date)},{' '}
          {order.delivery_time}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Адрес:</span> {order.full_address}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Итого</p>
          <p className="text-2xl font-bold text-pink-600">{formatPrice(order.total_amount)}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRepeatOrder}
            disabled={!onRepeatOrder}
          >
            Повторить
          </Button>
          <Button variant="primary" size="sm" href={`/order/${order.order_number.replace('#', '')}`}>
            Подробнее
          </Button>
        </div>
      </div>
    </div>
  )
}
