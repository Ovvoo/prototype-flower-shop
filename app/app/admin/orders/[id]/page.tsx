'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminApi } from '@/lib/api/admin'
import type { Order } from '@/lib/types'
import type { UpdateOrderStatusRequest } from '@/lib/types/admin'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { PriceDisplay } from '@/components/PriceDisplay'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

const ORDER_STATUSES = [
  { value: 'new', label: 'Новый' },
  { value: 'confirmed', label: 'Подтверждён' },
  { value: 'preparing', label: 'Готовится' },
  { value: 'delivering', label: 'Доставляется' },
  { value: 'completed', label: 'Выполнен' },
  { value: 'cancelled', label: 'Отменён' },
]

interface PageProps {
  params: Promise<{ id: string }>
}

export default function AdminOrderDetailPage({ params }: PageProps) {
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [comment, setComment] = useState('')
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<number | null>(null)

  useEffect(() => {
    params.then((p) => setOrderId(Number(p.id)))
  }, [params])

  useEffect(() => {
    if (!orderId) return

    const fetchOrder = async () => {
      try {
        setLoading(true)
        const data = await adminApi.getOrder(orderId)
        setOrder(data)
        setSelectedStatus(data.status)
      } catch {
        setError('Не удалось загрузить заказ')
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  const handleUpdateStatus = async () => {
    if (!order || !orderId || selectedStatus === order.status) return
    setUpdating(true)
    setSuccessMsg(null)
    setError(null)

    try {
      const req: UpdateOrderStatusRequest = { status: selectedStatus as any, comment: comment || undefined }
      const updated = await adminApi.updateOrderStatus(orderId, req)
      setOrder(updated)
      setSelectedStatus(updated.status)
      setComment('')
      setSuccessMsg('Статус обновлён, клиенту отправлено email-уведомление')
    } catch (err: any) {
      setError(err?.message || 'Ошибка при обновлении статуса')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (error && !order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button variant="secondary" onClick={() => router.back()}>← Назад</Button>
      </div>
    )
  }

  if (!order) return null

  const addr = order.delivery_address as any

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/orders">
          <Button variant="ghost">← Заказы</Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{order.order_number}</h1>
        <StatusBadge status={order.status} type="order" />
        <StatusBadge status={order.payment_status} type="payment" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Order details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Клиент</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Имя</p>
                <p className="font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-gray-500">Телефон</p>
                <p className="font-medium">{order.customer_phone}</p>
              </div>
              <div>
                <p className="text-gray-500">Способ оплаты</p>
                <p className="font-medium">
                  {order.payment_method === 'online' ? 'Онлайн' : 'Наличные при доставке'}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Доставка</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="col-span-2">
                <p className="text-gray-500">Адрес</p>
                <p className="font-medium">
                  {addr?.city}, {addr?.street}, {addr?.house}
                  {addr?.apartment ? `, кв. ${addr.apartment}` : ''}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Дата доставки</p>
                <p className="font-medium">
                  {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString('ru-RU') : '—'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Время</p>
                <p className="font-medium">{order.delivery_time}</p>
              </div>
              {order.recipient_name && (
                <div>
                  <p className="text-gray-500">Получатель</p>
                  <p className="font-medium">{order.recipient_name} {order.recipient_phone}</p>
                </div>
              )}
              {order.greeting_card_text && (
                <div className="col-span-2">
                  <p className="text-gray-500">Открытка</p>
                  <p className="font-medium italic">«{order.greeting_card_text}»</p>
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Товары</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Товар</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Цена</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Кол-во</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сумма</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.product_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600"><PriceDisplay price={item.price} size="sm" /></td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.quantity} шт.</td>
                    <td className="px-6 py-4 text-sm font-medium"><PriceDisplay price={item.subtotal} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Summary + Status Update */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Итого</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Товары</span>
                <PriceDisplay price={order.subtotal} size="sm" />
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Скидка</span>
                  <span>−{order.discount} ₽</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Доставка</span>
                <span>{order.delivery_fee > 0 ? `${order.delivery_fee} ₽` : 'Бесплатно'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-bold text-base">
                <span>Итого</span>
                <PriceDisplay price={order.total_amount} size="sm" />
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Изменить статус</h2>

            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {successMsg}
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Комментарий (необязательно)"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm resize-none"
              />

              <Button
                onClick={handleUpdateStatus}
                disabled={updating || selectedStatus === order.status}
                className="w-full"
              >
                {updating ? 'Сохранение...' : 'Обновить статус'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
