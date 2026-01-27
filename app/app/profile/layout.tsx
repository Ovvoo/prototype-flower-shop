// 🏠 Profile Layout
// Layout для страниц личного кабинета с sidebar

import { ProfileSidebar } from '@/components/profile/ProfileSidebar'

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <ProfileSidebar />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  )
}
