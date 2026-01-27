'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/orders', label: 'Заказы', icon: '📦' },
  { href: '/admin/products', label: 'Товары', icon: '🌸' },
  { href: '/admin/categories', label: 'Категории', icon: '📂' },
  { href: '/admin/promo-codes', label: 'Промокоды', icon: '🎟️' },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    router.push('/login')
  }

  return (
    <>
      <div className="p-6 border-b border-gray-200">
        <Link href="/admin" className="block" onClick={onNavigate}>
          <h1 className="text-2xl font-bold text-pink-600">🌸 Админка</h1>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl min-h-[48px]
                transition-colors touch-manipulation
                ${isActive
                  ? 'bg-pink-50 text-pink-700 font-medium'
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

      <div className="p-4 border-t border-gray-200">
        <Link href="/" className="block mb-2" onClick={onNavigate}>
          <Button variant="secondary" className="w-full">
            🏠 На сайт
          </Button>
        </Link>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full text-red-600 hover:bg-red-50"
        >
          Выйти
        </Button>
      </div>
    </>
  )
}

export function AdminSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile FAB */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40
          bg-pink-600 text-white p-4 rounded-full shadow-lg
          min-h-[56px] min-w-[56px] flex items-center justify-center
          hover:bg-pink-700 transition touch-manipulation"
        aria-label="Открыть меню"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white
            shadow-xl flex flex-col animate-slide-in-left">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-pink-600">Меню</h2>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center
                  hover:bg-gray-100 rounded-lg transition touch-manipulation"
                aria-label="Закрыть меню"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarContent onNavigate={() => setIsMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  )
}
