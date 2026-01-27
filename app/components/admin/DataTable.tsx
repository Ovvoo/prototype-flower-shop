'use client'

import React from 'react'
import type { PaginationInfo } from '@/lib/types/common'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'

export interface Column<T> {
  key: string
  label: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  pagination?: PaginationInfo
  onPageChange?: (page: number) => void
  onSort?: (key: string) => void
  emptyMessage?: string
}

export function DataTable<T extends { id: number | string }>({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  onSort,
  emptyMessage = 'Нет данных',
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-t border-gray-200">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4">
                      <Skeleton className="h-4" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:text-gray-700' : ''
                  }`}
                  onClick={() => column.sortable && onSort?.(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    {column.sortable && <span className="text-gray-400">⇅</span>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-gray-900">
                    {column.render ? column.render(item) : String((item as any)[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.last_page > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Показано <span className="font-medium">{data.length}</span> из{' '}
            <span className="font-medium">{pagination.total}</span> записей
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange?.(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
            >
              ← Назад
            </Button>

            <div className="flex items-center gap-1">
              {[...Array(Math.min(pagination.last_page, 5))].map((_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange?.(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      pagination.current_page === page
                        ? 'bg-pink-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange?.(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
            >
              Вперёд →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
