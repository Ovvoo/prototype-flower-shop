// 📋 Order Details Page
// Страница детального просмотра заказа

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Order } from '@/lib/types/order'
import { OrderDetails } from '@/components/order/OrderDetails'
import { OrderItems } from '@/components/order/OrderItems'
import { Button } from '@/components/ui/Button'
import { ordersApi } from '@/lib/api/orders'
import { useCartContext } from '@/contexts/CartContext'
import { apiClient } from '@/lib/api'

interface OrderDetailsPageProps {
  params: Promise<{ orderNumber: string }>
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string>('')
  const { addItem } = useCartContext()

  // Проверка авторизации по наличию токена
  const isAuthenticated = apiClient.getToken() !== null

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params
      setOrderNumber(resolvedParams.orderNumber)
    }
    loadParams()
  }, [params])

  useEffect(() => {
    if (!orderNumber) return

    const fetchOrder = async () => {
      try {
        setIsLoading(true)
        const response = await ordersApi.getOrder(orderNumber)
        setOrder(response.data)
      } catch (error) {
        console.error('Failed to load order:', error)
        setError('Не удалось загрузить заказ')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderNumber])

  const handleRepeatOrder = () => {
    if (!order) return
    order.items.forEach((item) => {
      if (item.product) {
        addItem(item.product, item.quantity)
      }
    })
    alert(`${order.items.length} товар(ов) добавлено в корзину`)
    router.push('/cart')
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || (!order && !isLoading)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">Заказ не найден</h1>
          <p className="text-gray-600 mb-6">
            {error || `Заказ ${orderNumber} не существует или у вас нет доступа к нему`}
          </p>
          <Button variant="primary" onClick={() => router.push('/')}>
            Вернуться на главную
          </Button>
        </div>
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <Link href="/">
            <Button variant="ghost">← На главную</Button>
          </Link>
          {isAuthenticated && (
            <Link href="/profile/orders">
              <Button variant="ghost">📋 Мои заказы</Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <OrderItems items={order.items} />
          </div>

          {/* Right Column: Order Details & Summary */}
          <div className="space-y-6">
            <OrderDetails order={order} />
            <Button variant="primary" className="w-full" onClick={handleRepeatOrder}>
              🔄 Повторить заказ
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
