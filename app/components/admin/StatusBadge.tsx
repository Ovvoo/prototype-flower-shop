import type { OrderStatus, PaymentStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus | string
  type?: 'order' | 'payment' | 'promo'
}

const statusColors = {
  // Order statuses
  new: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  processing: 'bg-yellow-100 text-yellow-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',

  // Payment statuses
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',

  // Promo code statuses
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  expired: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  // Order
  new: 'Новый',
  confirmed: 'Подтверждён',
  processing: 'Обработка',
  shipped: 'Доставляется',
  delivered: 'Доставлен',
  cancelled: 'Отменён',

  // Payment
  pending: 'Ожидание',
  paid: 'Оплачен',
  failed: 'Ошибка',
  refunded: 'Возврат',

  // Promo
  active: 'Активен',
  inactive: 'Неактивен',
  expired: 'Истёк',
}

export function StatusBadge({ status, type = 'order' }: StatusBadgeProps) {
  const color = statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
  const label = statusLabels[status] || status

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}
    >
      {label}
    </span>
  )
}
