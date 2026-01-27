// ProductCard Component
// Reusable product card for catalog, home page, related products

'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/lib/types'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  priority?: boolean
}

export function ProductCard({ product, onAddToCart, priority = false }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all group">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square bg-gray-200 overflow-hidden">
          <Image
            src={product.main_image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            priority={priority}
            quality={85}
          />
          {product.is_new && (
            <span className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-pink-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold z-10">
              Новинка
            </span>
          )}
          {product.discount_percent && (
            <span className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-red-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold z-10">
              -{product.discount_percent}%
            </span>
          )}
        </div>
      </Link>
      <div className="p-4 sm:p-6">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-bold text-base sm:text-lg mb-2 hover:text-pink-600 transition line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-xl sm:text-2xl font-bold text-pink-600">
              {product.price.toLocaleString()} ₽
            </span>
            {product.compare_at_price && (
              <span className="ml-2 text-xs sm:text-sm text-gray-400 line-through">
                {product.compare_at_price.toLocaleString()} ₽
              </span>
            )}
          </div>
          {onAddToCart && (
            <button
              onClick={(e) => {
                e.preventDefault()
                onAddToCart(product)
              }}
              className="w-full sm:w-auto bg-pink-600 text-white px-4 py-3 min-h-[44px] sm:min-h-[40px] rounded-lg hover:bg-pink-700 transition text-sm font-medium touch-manipulation"
            >
              В корзину
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
