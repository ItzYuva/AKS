'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTheme } from '@/app/context/ThemeContext'
import {
  FaHome,
  FaNewspaper,
  FaProjectDiagram,
  FaUser,
  FaEnvelope,
  FaSignOutAlt,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaChartBar,
  FaFilePdf,
} from 'react-icons/fa'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: FaHome },
  { href: '/admin/analytics', label: 'Analytics', icon: FaChartBar },
  { href: '/admin/blogs', label: 'Blogs', icon: FaNewspaper },
  { href: '/admin/projects', label: 'Projects', icon: FaProjectDiagram },
  { href: '/admin/about', label: 'About', icon: FaUser },
  { href: '/admin/contact', label: 'Contact', icon: FaEnvelope },
  { href: '/admin/resume', label: 'Resume', icon: FaFilePdf },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-zinc-200 dark:border-white/15">
        <h1 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">Admin Panel</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage your portfolio</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-zinc-200 dark:border-white/15 space-y-2">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          {theme === 'dark' ? <FaSun className="h-5 w-5" /> : <FaMoon className="h-5 w-5" />}
          <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <FaSignOutAlt className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-[#0c0c0e] shadow-lg md:hidden"
      >
        {mobileOpen ? <FaTimes className="h-5 w-5" /> : <FaBars className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-[#0c0c0e] border-r border-zinc-200 dark:border-white/15 transform transition-transform md:transform-none ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
