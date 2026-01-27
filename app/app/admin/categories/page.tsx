'use client'

import { useState, useEffect } from 'react'
import { adminApi } from '@/lib/api/admin'
import type { Category } from '@/lib/types'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import Link from 'next/link'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить категорию?')) return

    try {
      await adminApi.deleteCategory(id)
      fetchCategories()
    } catch (error: any) {
      alert(error.message || 'Ошибка при удалении категории')
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Категории</h1>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    )
  }

  const rootCategories = categories.filter((cat) => !cat.parent_id)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Категории</h1>
        <Button>+ Создать категорию</Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-200">
        {rootCategories.map((category) => {
          const children = categories.filter((cat) => cat.parent_id === category.id)

          return (
            <div key={category.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-500">
                    Slug: {category.slug} • Сортировка: {category.sort_order || 0}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      category.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {category.is_active ? 'Активна' : 'Скрыта'}
                  </span>
                  <button className="text-pink-600 hover:text-pink-700 font-medium">
                    Изменить
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Удалить
                  </button>
                </div>
              </div>

              {children.length > 0 && (
                <div className="ml-6 space-y-2">
                  {children.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{child.name}</p>
                        <p className="text-sm text-gray-500">
                          Slug: {child.slug}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            child.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {child.is_active ? 'Активна' : 'Скрыта'}
                        </span>
                        <button className="text-pink-600 hover:text-pink-700 text-sm font-medium">
                          Изменить
                        </button>
                        <button
                          onClick={() => handleDelete(child.id)}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}

        {categories.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            Нет категорий
          </div>
        )}
      </div>
    </div>
  )
}
