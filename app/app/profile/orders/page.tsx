// 📦 Orders History Page
// Страница истории заказов пользователя

'use client'

import { useState, useEffect, useMemo } from 'react'
import { Order, OrderStatus } from '@/lib/types/order'
import { OrderCard } from '@/components/orders/OrderCard'
import { OrdersFilter, OrdersFilterParams } from '@/components/orders/OrdersFilter'
import { mockOrders } from '@/lib/mock/orders'
import { useCartContext } from '@/contexts/CartContext'

/**
 * Страница истории заказов
 */
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<OrdersFilterParams>({
    status: 'all',
    sortBy: 'date_desc',
  })

  const { addItem } = useCartContext()

  // Загрузка заказов
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // TODO: Загрузка через ordersApi.getOrders()
        // Сейчас используем mock данные
        await new Promise((resolve) => setTimeout(resolve, 800))
        setOrders(mockOrders)
      } catch (error) {
        console.error('Failed to load orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Фильтрация и сортировка
  const filteredOrders = useMemo(() => {
    let result = [...orders]

    // Фильтр по статусу
    if (filters.status && filters.status !== 'all') {
      result = result.filter((order) => order.status === filters.status)
    }

    // Сортировка
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'date_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'amount_desc':
          return b.total_amount - a.total_amount
        case 'amount_asc':
          return a.total_amount - b.total_amount
        default:
          return 0
      }
    })

    return result
  }, [orders, filters])

  // Повторить заказ - добавить все товары в корзину
  const handleRepeatOrder = (order: Order) => {
    order.items.forEach((item) => {
      if (item.product) {
        addItem(item.product, item.quantity)
      }
    })

    // TODO: Показать уведомление
    alert(`${order.items.length} товар(ов) добавлено в корзину`)
  }

  // Loading state
  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Мои заказы</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-16 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Мои заказы</h1>
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">У вас пока нет заказов</h2>
          <p className="text-gray-600 mb-6">
            Оформите свой первый заказ в нашем каталоге цветов
          </p>
          <a
            href="/catalog"
            className="inline-block bg-pink-600 text-white px-8 py-3 rounded-lg hover:bg-pink-700 transition font-semibold"
          >
            Перейти в каталог
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Мои заказы</h1>

      {/* Фильтр */}
      <OrdersFilter filters={filters} onChange={setFilters} />

      {/* Список заказов */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ничего не найдено</h2>
          <p className="text-gray-600">Попробуйте изменить фильтры</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} onRepeatOrder={handleRepeatOrder} />
          ))}
        </div>
      )}

      {/* Количество заказов */}
      <div className="mt-6 text-center text-sm text-gray-500">
        Показано заказов: {filteredOrders.length} из {orders.length}
      </div>
    </div>
  )
}
