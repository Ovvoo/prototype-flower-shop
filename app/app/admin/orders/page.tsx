'use client'

import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/api/admin'
import type { Order, PaginatedResponse } from '@/lib/types'
import type { AdminOrderFilters } from '@/lib/types/admin'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { PriceDisplay } from '@/components/PriceDisplay'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import Link from 'next/link'

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<PaginatedResponse<Order> | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<AdminOrderFilters>({
    page: 1,
  })

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getOrders(filters)
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [filters])

  const handleFilterChange = (key: keyof AdminOrderFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
      page: 1,
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleResetFilters = () => {
    setFilters({ page: 1 })
  }

  const columns: Column<Order>[] = [
    {
      key: 'order_number',
      label: 'Номер',
      render: (order) => (
        <span className="font-medium text-gray-900">{order.order_number}</span>
      ),
    },
    {
      key: 'created_at',
      label: 'Дата',
      sortable: true,
      render: (order) => (
        <span className="text-gray-600">
          {new Date(order.created_at).toLocaleDateString('ru-RU')}
        </span>
      ),
    },
    {
      key: 'customer_name',
      label: 'Клиент',
      render: (order) => (
        <div>
          <div className="font-medium text-gray-900">{order.customer_name}</div>
          <div className="text-sm text-gray-500">{order.customer_phone}</div>
        </div>
      ),
    },
    {
      key: 'items',
      label: 'Товары',
      render: (order) => (
        <span className="text-gray-600">{order.items.length} шт.</span>
      ),
    },
    {
      key: 'total_amount',
      label: 'Сумма',
      sortable: true,
      render: (order) => <PriceDisplay price={order.total_amount} size="sm" />,
    },
    {
      key: 'status',
      label: 'Статус',
      render: (order) => <StatusBadge status={order.status} type="order" />,
    },
    {
      key: 'payment_status',
      label: 'Оплата',
      render: (order) => <StatusBadge status={order.payment_status} type="payment" />,
    },
    {
      key: 'actions',
      label: 'Действия',
      render: (order) => (
        <Link
          href={`/admin/orders/${order.id}`}
          className="text-pink-600 hover:text-pink-700 font-medium"
        >
          Подробнее →
        </Link>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Заказы</h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Поиск..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />

          <Select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">Все статусы</option>
            <option value="new">Новый</option>
            <option value="confirmed">Подтверждён</option>
            <option value="preparing">Готовится</option>
            <option value="delivering">Доставляется</option>
            <option value="completed">Выполнен</option>
            <option value="cancelled">Отменён</option>
          </Select>

          <Select
            value={filters.payment_status || ''}
            onChange={(e) => handleFilterChange('payment_status', e.target.value)}
          >
            <option value="">Все платежи</option>
            <option value="pending">Ожидание</option>
            <option value="paid">Оплачен</option>
            <option value="failed">Ошибка</option>
            <option value="refunded">Возврат</option>
          </Select>

          <Input
            type="date"
            placeholder="От даты"
            value={filters.date_from || ''}
            onChange={(e) => handleFilterChange('date_from', e.target.value)}
          />

          <Button variant="secondary" onClick={handleResetFilters}>
            Сбросить
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={orders?.data || []}
        loading={loading}
        pagination={orders?.meta}
        onPageChange={handlePageChange}
        emptyMessage="Нет заказов"
      />
    </div>
  )
}
