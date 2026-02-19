'use client'

import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/api/admin'
import type { Product, PaginatedResponse } from '@/lib/types'
import type { AdminProductFilters } from '@/lib/types/admin'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { PriceDisplay } from '@/components/PriceDisplay'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { useCategories } from '@/lib/hooks/useCategories'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<PaginatedResponse<Product> | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AdminProductFilters>({
    page: 1,
  })

  const { data: categories } = useCategories()

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getProducts(filters)
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const handleFilterChange = (key: keyof AdminProductFilters, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === '' || value === undefined ? undefined : value,
      page: 1,
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить товар?')) return
    setDeleteError(null)

    try {
      await adminApi.deleteProduct(id)
      fetchProducts()
    } catch (err: any) {
      setDeleteError(err?.message || 'Ошибка при удалении товара')
    }
  }

  const columns: Column<Product>[] = [
    {
      key: 'image',
      label: 'Фото',
      render: (product) => (
        <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized={!product.images[0].startsWith('https://images.unsplash.com')}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">нет фото</div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Название',
      render: (product) => (
        <div>
          <div className="font-medium text-gray-900">{product.name}</div>
          <div className="text-sm text-gray-500">{product.category?.name || 'Без категории'}</div>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Цена',
      sortable: true,
      render: (product) => <PriceDisplay price={product.price} size="sm" />,
    },
    {
      key: 'stock',
      label: 'Остаток',
      render: (product) => (
        <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
          {product.stock} шт.
        </span>
      ),
    },
    {
      key: 'sales_count',
      label: 'Продажи',
      sortable: true,
      render: (product) => <span className="text-gray-600">{product.sales_count}</span>,
    },
    {
      key: 'is_active',
      label: 'Статус',
      render: (product) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            product.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {product.is_active ? 'Активен' : 'Скрыт'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Действия',
      render: (product) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/products/${product.id}`}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Изменить
          </Link>
          <button
            onClick={() => handleDelete(product.id)}
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
        <h1 className="text-3xl font-bold text-gray-900">Товары</h1>
        <Link href="/admin/products/new">
          <Button>+ Создать товар</Button>
        </Link>
      </div>

      {deleteError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {deleteError}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Поиск..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />

          <Select
            value={filters.category_id?.toString() || ''}
            onChange={(e) => {
              const val = parseInt(e.target.value)
              if (val) setFilters((prev) => ({ ...prev, category_id: val, page: 1 }))
              else setFilters((prev) => { const { category_id, ...rest } = prev; return { ...rest, page: 1 } })
            }}
          >
            <option value="">Все категории</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>

          <Select
            value={filters.in_stock === undefined ? '' : filters.in_stock.toString()}
            onChange={(e) => {
              const value = e.target.value === '' ? undefined : e.target.value === 'true'
              if (value !== undefined) {
                handleFilterChange('in_stock', value)
              } else {
                setFilters((prev) => {
                  const { in_stock, ...rest } = prev
                  return rest
                })
              }
            }}
          >
            <option value="">Все товары</option>
            <option value="true">В наличии</option>
            <option value="false">Нет в наличии</option>
          </Select>

          <Select
            value={filters.sort_by || 'created_at'}
            onChange={(e) => handleFilterChange('sort_by', e.target.value)}
          >
            <option value="created_at">По дате</option>
            <option value="price">По цене</option>
            <option value="sales_count">По продажам</option>
          </Select>

          <Button
            variant="secondary"
            onClick={() => setFilters({ page: 1 })}
          >
            Сбросить
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={products?.data || []}
        loading={loading}
        pagination={products?.meta}
        onPageChange={handlePageChange}
        emptyMessage="Нет товаров"
      />
    </div>
  )
}
