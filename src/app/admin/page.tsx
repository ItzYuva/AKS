'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaNewspaper, FaProjectDiagram, FaUser, FaEnvelope } from 'react-icons/fa'

interface Stats {
  blogs: number
  projects: number
  aboutExists: boolean
  contactExists: boolean
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ blogs: 0, projects: 0, aboutExists: false, contactExists: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/blogs').then(r => r.json()),
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/about').then(r => r.json()),
      fetch('/api/contact-info').then(r => r.json()),
    ]).then(([blogs, projects, about, contact]) => {
      setStats({
        blogs: Array.isArray(blogs) ? blogs.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0,
        aboutExists: !!about?._id,
        contactExists: !!contact?._id,
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const cards = [
    { label: 'Blogs', count: stats.blogs, icon: FaNewspaper, href: '/admin/blogs', color: 'bg-blue-500' },
    { label: 'Projects', count: stats.projects, icon: FaProjectDiagram, href: '/admin/projects', color: 'bg-green-500' },
    { label: 'About', count: stats.aboutExists ? 'Set' : 'Not Set', icon: FaUser, href: '/admin/about', color: 'bg-purple-500' },
    { label: 'Contact', count: stats.contactExists ? 'Set' : 'Not Set', icon: FaEnvelope, href: '/admin/contact', color: 'bg-orange-500' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.label}
                href={card.href}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{card.count}</p>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{card.label}</p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
