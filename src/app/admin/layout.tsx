'use client'

import { usePathname } from 'next/navigation'
import AdminSidebar from './components/AdminSidebar'
import NavigationProgress from './components/NavigationProgress'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <>
      <NavigationProgress />
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 bg-zinc-50 dark:bg-[#0a0a0a] overflow-auto">
          {children}
        </main>
      </div>
    </>
  )
}
