// 📋 Order Details Component
// Компонент с деталями заказа (номер, дата, статус, доставка, итого)

import { Order } from '@/lib/types/order'
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge'

interface OrderDetailsProps {
  order: Order
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Order Info */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Заказ {order.order_number}</h1>
          <p className="text-gray-600">Создан {formatDate(order.created_at)}</p>
        </div>
        <OrderStatusBadge status={order.status} statusLabel={order.status_label} />
      </div>

      {/* Delivery Info */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Доставка</h2>
        <div className="space-y-2 text-gray-600">
          <p>
            <span className="font-medium">Дата:</span> {formatDate(order.delivery_date)}
          </p>
          <p>
            <span className="font-medium">Время:</span> {order.delivery_time}
          </p>
          <p>
            <span className="font-medium">Адрес:</span> {order.full_address}
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Итого</h2>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-gray-600">
            <span>Товары</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Скидка</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>Доставка</span>
            <span>{order.delivery_fee === 0 ? 'Бесплатно' : formatPrice(order.delivery_fee)}</span>
          </div>
        </div>
        <div className="pt-4 border-t">
          <div className="flex justify-between text-lg font-bold">
            <span>Итого</span>
            <span className="text-pink-600">{formatPrice(order.total_amount)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
