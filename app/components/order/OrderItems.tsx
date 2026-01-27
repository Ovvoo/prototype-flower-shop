// 📦 Order Items Component
// Компонент со списком товаров в заказе

import Image from 'next/image'
import { Order } from '@/lib/types/order'

interface OrderItemsProps {
  items: Order['items']
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function OrderItems({ items }: OrderItemsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Товары</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0">
            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
              {item.product_image && (
                <Image
                  src={item.product_image}
                  alt={item.product_name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{item.product_name}</h3>
              <p className="text-sm text-gray-600">Количество: {item.quantity}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">{formatPrice(item.subtotal)}</p>
              <p className="text-sm text-gray-500">
                {formatPrice(item.price)} × {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
