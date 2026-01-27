// 📋 Profile Sidebar Component
// Боковое меню навигации в личном кабинете

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarItem {
  label: string
  href: string
  icon: string
}

const sidebarItems: SidebarItem[] = [
  { label: 'Мой профиль', href: '/profile', icon: '👤' },
  { label: 'Мои заказы', href: '/profile/orders', icon: '📦' },
  { label: 'Адреса доставки', href: '/profile/addresses', icon: '📍' },
]

/**
 * Sidebar навигация для личного кабинета
 */
export function ProfileSidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Личный кабинет</h2>

      <nav className="space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${
                  isActive
                    ? 'bg-pink-50 text-pink-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
