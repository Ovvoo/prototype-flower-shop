// 🔍 Orders Filter Component
// Фильтр и сортировка для списка заказов

'use client'

import { OrderStatus } from '@/lib/types/order'

export interface OrdersFilterParams {
  status?: OrderStatus | 'all'
  sortBy: 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc'
}

interface OrdersFilterProps {
  filters: OrdersFilterParams
  onChange: (filters: OrdersFilterParams) => void
}

/**
 * Компонент фильтрации и сортировки заказов
 */
export function OrdersFilter({ filters, onChange }: OrdersFilterProps) {
  const handleStatusChange = (status: OrderStatus | 'all') => {
    onChange({ ...filters, status })
  }

  const handleSortChange = (sortBy: OrdersFilterParams['sortBy']) => {
    onChange({ ...filters, sortBy })
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Статус заказа</label>
          <select
            value={filters.status || 'all'}
            onChange={(e) => handleStatusChange(e.target.value as OrderStatus | 'all')}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          >
            <option value="all">Все заказы</option>
            <option value="new">Новые</option>
            <option value="confirmed">Подтверждённые</option>
            <option value="preparing">Готовятся</option>
            <option value="delivering">Доставляются</option>
            <option value="completed">Доставленные</option>
            <option value="cancelled">Отменённые</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Сортировка</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as OrdersFilterParams['sortBy'])}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
          >
            <option value="date_desc">Сначала новые</option>
            <option value="date_asc">Сначала старые</option>
            <option value="amount_desc">По убыванию суммы</option>
            <option value="amount_asc">По возрастанию суммы</option>
          </select>
        </div>
      </div>
    </div>
  )
}
