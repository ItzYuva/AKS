'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaNewspaper, FaProjectDiagram, FaUser, FaEnvelope, FaChartLine, FaArrowRight } from 'react-icons/fa'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface Stats {
  blogs: number
  projects: number
  aboutExists: boolean
  contactExists: boolean
}

interface MiniAnalytics {
  totalViews: number
  viewsByDay: { date: string; views: number }[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ blogs: 0, projects: 0, aboutExists: false, contactExists: false })
  const [analytics, setAnalytics] = useState<MiniAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/blogs').then(r => r.json()),
      fetch('/api/projects').then(r => r.json()),
      fetch('/api/about').then(r => r.json()),
      fetch('/api/contact-info').then(r => r.json()),
      fetch('/api/analytics/stats?range=7d').then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([blogs, projects, about, contact, analyticsData]) => {
      setStats({
        blogs: Array.isArray(blogs) ? blogs.length : 0,
        projects: Array.isArray(projects) ? projects.length : 0,
        aboutExists: !!about?._id,
        contactExists: !!contact?._id,
      })
      if (analyticsData) {
        setAnalytics({
          totalViews: analyticsData.overview?.totalViews || 0,
          viewsByDay: analyticsData.viewsByDay || [],
        })
      }
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
        <>
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

          {/* Mini Analytics Section */}
          {analytics && (
            <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FaChartLine className="text-primary h-5 w-5" />
                  <h2 className="text-lg font-semibold">Recent Analytics</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                    {analytics.totalViews.toLocaleString()} views (last 7 days)
                  </span>
                </div>
                <Link
                  href="/admin/analytics"
                  className="flex items-center gap-1 text-primary text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  View Full Analytics <FaArrowRight className="h-3 w-3" />
                </Link>
              </div>
              {analytics.viewsByDay.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={analytics.viewsByDay}>
                    <defs>
                      <linearGradient id="miniViewsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      className="text-gray-400"
                      tickFormatter={(v) => {
                        const d = new Date(v)
                        return `${d.getMonth() + 1}/${d.getDate()}`
                      }}
                    />
                    <YAxis tick={{ fontSize: 11 }} className="text-gray-400" width={30} />
                    <Tooltip
                      contentStyle={{
                        fontSize: '12px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                      }}
                    />
                    <Area type="monotone" dataKey="views" stroke="#007AFF" fill="url(#miniViewsGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-sm">No views recorded yet</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
