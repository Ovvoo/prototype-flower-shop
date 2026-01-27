'use client'

import { useAdminStats } from '@/lib/hooks/useAdminStats'
import { AdminCard } from '@/components/admin/AdminCard'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { PriceDisplay } from '@/components/PriceDisplay'
import { Skeleton } from '@/components/ui/Skeleton'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const { stats, loading, error } = useAdminStats()

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32 mt-2" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="mt-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-20" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdminCard
          title="Заказы сегодня"
          value={stats.orders_today}
          icon="📦"
        />
        <AdminCard
          title="Выручка сегодня"
          value={`${stats.revenue_today.toLocaleString('ru-RU')} ₽`}
          icon="💰"
        />
        <AdminCard
          title="Новые заказы"
          value={stats.new_orders_count}
          icon="🔔"
        />
        <AdminCard
          title="Средний чек"
          value={`${stats.avg_order_value_today.toLocaleString('ru-RU')} ₽`}
          icon="📊"
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Последние заказы</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Номер
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Клиент
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Товары
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Сумма
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stats.recent_orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {order.order_number}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{order.customer_name}</div>
                      <div className="text-gray-500">{order.customer_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.items.length} шт.
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <PriceDisplay price={order.total_amount} size="sm" />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} type="order" />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-pink-600 hover:text-pink-700 font-medium"
                    >
                      Подробнее →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {stats.recent_orders.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-500">
            Нет заказов
          </div>
        )}

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
          <Link
            href="/admin/orders"
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Посмотреть все заказы →
          </Link>
        </div>
      </div>
    </div>
  )
}
