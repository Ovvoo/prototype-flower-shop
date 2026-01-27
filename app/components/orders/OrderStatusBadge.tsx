// 🏷️ Order Status Badge Component
// Переиспользуемый компонент для отображения статуса заказа

import { OrderStatus } from '@/lib/types/order'

interface OrderStatusBadgeProps {
  status: OrderStatus
  statusLabel?: string
}

const statusConfig: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  new: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    label: 'Новый',
  },
  confirmed: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    label: 'Подтверждён',
  },
  preparing: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    label: 'Готовится',
  },
  delivering: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-700',
    label: 'Доставляется',
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-700',
    label: 'Доставлен',
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-700',
    label: 'Отменён',
  },
}

/**
 * Компонент бейджа статуса заказа
 */
export function OrderStatusBadge({ status, statusLabel }: OrderStatusBadgeProps) {
  const config = statusConfig[status]
  const label = statusLabel || config.label

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {label}
    </span>
  )
}
