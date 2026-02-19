'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { adminApi } from '@/lib/api/admin'
import type { Product, Category } from '@/lib/types'
import type { ProductFormData } from '@/lib/types/admin'
import { Button } from '@/components/ui/Button'
import { Skeleton } from '@/components/ui/Skeleton'
import { AdminField, AdminCheckbox, adminInputCls } from '@/components/admin/AdminFormFields'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function AdminProductEditPage({ params }: PageProps) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [productId, setProductId] = useState<number | null>(null)

  const [form, setForm] = useState<Partial<ProductFormData>>({})

  useEffect(() => {
    params.then((p) => setProductId(Number(p.id)))
  }, [params])

  useEffect(() => {
    if (!productId) return

    const load = async () => {
      try {
        setLoading(true)
        const [prod, cats] = await Promise.all([
          adminApi.getProduct(productId),
          adminApi.getCategories(),
        ])
        setProduct(prod)
        setCategories(cats)
        setForm({
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          price: prod.price,
          compare_at_price: prod.compare_at_price ?? undefined,
          category_id: prod.category?.id,
          images: prod.images,
          stock: prod.stock,
          sku: prod.sku,
          is_featured: prod.is_featured,
          is_new: prod.is_new,
          is_active: prod.is_active,
        })
      } catch {
        setError('Не удалось загрузить товар')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [productId])

  const handleChange = (key: keyof ProductFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (!productId) return
    setSaving(true)
    setError(null)

    try {
      await adminApi.updateProduct(productId, form)
      router.push('/admin/products')
    } catch (err: any) {
      setError(err?.message || 'Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16" />)}
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button variant="secondary" onClick={() => router.back()}>← Назад</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products"><Button variant="ghost">← Товары</Button></Link>
        <h1 className="text-3xl font-bold text-gray-900">Редактировать товар</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Основное</h2>
            <AdminField label="Название">
              <input className={adminInputCls} value={form.name || ''} onChange={(e) => handleChange('name', e.target.value)} />
            </AdminField>
            <AdminField label="Slug (URL)">
              <input className={adminInputCls} value={form.slug || ''} onChange={(e) => handleChange('slug', e.target.value)} />
            </AdminField>
            <AdminField label="Описание">
              <textarea className={adminInputCls + ' resize-none'} rows={4} value={form.description || ''} onChange={(e) => handleChange('description', e.target.value)} />
            </AdminField>
            <AdminField label="Категория">
              <select className={adminInputCls} value={form.category_id || ''} onChange={(e) => handleChange('category_id', Number(e.target.value))}>
                <option value="">Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </AdminField>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Цены и остаток</h2>
            <div className="grid grid-cols-2 gap-4">
              <AdminField label="Цена (₽)">
                <input className={adminInputCls} type="number" min="0" value={form.price || ''} onChange={(e) => handleChange('price', Number(e.target.value))} />
              </AdminField>
              <AdminField label="Старая цена (₽)">
                <input className={adminInputCls} type="number" min="0" value={form.compare_at_price || ''} onChange={(e) => handleChange('compare_at_price', Number(e.target.value) || undefined)} />
              </AdminField>
              <AdminField label="Остаток (шт.)">
                <input className={adminInputCls} type="number" min="0" value={form.stock ?? ''} onChange={(e) => handleChange('stock', Number(e.target.value))} />
              </AdminField>
              <AdminField label="SKU">
                <input className={adminInputCls} value={form.sku || ''} onChange={(e) => handleChange('sku', e.target.value)} />
              </AdminField>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Изображения</h2>
            <p className="text-sm text-gray-500">URL изображений через запятую</p>
            <textarea
              className={adminInputCls + ' resize-none'}
              rows={3}
              value={(form.images || []).join('\n')}
              onChange={(e) => handleChange('images', e.target.value.split('\n').filter(Boolean))}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </div>

        {/* Right: Visibility */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Видимость</h2>
            <AdminCheckbox label="Активен (отображается в каталоге)" checked={!!form.is_active} onChange={(v) => handleChange('is_active', v)} />
            <AdminCheckbox label="Хит продаж (на главной)" checked={!!form.is_featured} onChange={(v) => handleChange('is_featured', v)} />
            <AdminCheckbox label="Новинка" checked={!!form.is_new} onChange={(v) => handleChange('is_new', v)} />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </div>
      </div>
    </div>
  )
}

