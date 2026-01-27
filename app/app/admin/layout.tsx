import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const metadata = {
  title: 'Админка | Цветочный салон',
  description: 'Административная панель',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
