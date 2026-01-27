'use client'

import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/api/admin'
import type { PromoCode, PaginatedResponse } from '@/lib/types'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { Button } from '@/components/ui/Button'

export default function AdminPromoCodesPage() {
  const [promoCodes, setPromoCodes] = useState<PaginatedResponse<PromoCode> | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPromoCodes = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getPromoCodes()
      setPromoCodes(data)
    } catch (error) {
      console.error('Error fetching promo codes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromoCodes()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить промокод?')) return

    try {
      await adminApi.deletePromoCode(id)
      fetchPromoCodes()
    } catch (error) {
      alert('Ошибка при удалении промокода')
    }
  }

  const columns: Column<PromoCode>[] = [
    {
      key: 'code',
      label: 'Код',
      render: (promo) => (
        <span className="font-mono font-bold text-gray-900">{promo.code}</span>
      ),
    },
    {
      key: 'discount_type',
      label: 'Тип',
      render: (promo) => (
        <span className="text-gray-600">
          {promo.discount_type === 'percentage' ? 'Процент' : 'Фикс. сумма'}
        </span>
      ),
    },
    {
      key: 'discount_value',
      label: 'Скидка',
      render: (promo) => (
        <span className="font-medium text-gray-900">
          {promo.discount_type === 'percentage'
            ? `${promo.discount_value}%`
            : `${promo.discount_value} ₽`}
        </span>
      ),
    },
    {
      key: 'min_order_amount',
      label: 'Мин. сумма',
      render: (promo) => (
        <span className="text-gray-600">
          {promo.min_order_amount ? `${promo.min_order_amount} ₽` : '—'}
        </span>
      ),
    },
    {
      key: 'usage',
      label: 'Использовано',
      render: (promo) => (
        <span className="text-gray-600">
          {promo.usage_count || 0}
          {promo.usage_limit ? ` / ${promo.usage_limit}` : ''}
        </span>
      ),
    },
    {
      key: 'valid_dates',
      label: 'Действует',
      render: (promo) => (
        <div className="text-sm text-gray-600">
          <div>{new Date(promo.valid_from).toLocaleDateString('ru-RU')}</div>
          <div>{new Date(promo.valid_until).toLocaleDateString('ru-RU')}</div>
        </div>
      ),
    },
    {
      key: 'is_active',
      label: 'Статус',
      render: (promo) => {
        const now = new Date()
        const validFrom = new Date(promo.valid_from)
        const validUntil = new Date(promo.valid_until)

        let status = 'active'
        if (!promo.is_active) status = 'inactive'
        else if (now < validFrom || now > validUntil) status = 'expired'

        return <StatusBadge status={status} type="promo" />
      },
    },
    {
      key: 'actions',
      label: 'Действия',
      render: (promo) => (
        <div className="flex items-center gap-2">
          <button className="text-pink-600 hover:text-pink-700 font-medium">
            Изменить
          </button>
          <button
            onClick={() => handleDelete(promo.id)}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Удалить
          </button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Промокоды</h1>
        <Button>+ Создать промокод</Button>
      </div>

      <DataTable
        columns={columns}
        data={promoCodes?.data || []}
        loading={loading}
        pagination={promoCodes?.meta}
        emptyMessage="Нет промокодов"
      />
    </div>
  )
}
