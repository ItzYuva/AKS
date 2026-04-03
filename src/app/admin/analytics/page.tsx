'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  FaEye,
  FaUsers,
  FaComment,
  FaChartLine,
  FaGlobe,
  FaDesktop,
  FaMobileAlt,
  FaTabletAlt,
  FaRedo,
} from 'react-icons/fa'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts'

type Range = '7d' | '30d' | '90d' | 'all'

interface AnalyticsData {
  overview: {
    totalViews: number
    uniqueVisitors: number
    totalChatQuestions: number
    avgViewsPerDay: number
  }
  viewsByDay: { date: string; views: number; uniqueVisitors: number }[]
  topPages: { page: string; views: number }[]
  topCountries: { country: string; views: number }[]
  topRegions: { region: string; views: number }[]
  topCities: { city: string; views: number }[]
  deviceBreakdown: { device: string; count: number }[]
  browserBreakdown: { browser: string; count: number }[]
  topProjects: { title: string; views: number }[]
  topBlogs: { title: string; slug: string; views: number }[]
  recentChatQuestions: { question: string; createdAt: string }[]
  topChatQuestions: { question: string; count: number }[]
}

const DEVICE_COLORS: Record<string, string> = {
  desktop: '#007AFF',
  mobile: '#34C759',
  tablet: '#FF9500',
}

const BROWSER_COLORS = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#8E8E93']

const DEVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  desktop: FaDesktop,
  mobile: FaMobileAlt,
  tablet: FaTabletAlt,
}

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
  )
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [range, setRange] = useState<Range>('30d')

  const fetchData = useCallback(async (r: Range) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/analytics/stats?range=${r}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setData(json)
    } catch {
      setError('Failed to load analytics data.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData(range)
  }, [range, fetchData])

  const ranges: { label: string; value: Range }[] = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: '90 Days', value: '90d' },
    { label: 'All Time', value: 'all' },
  ]

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => fetchData(range)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <FaRedo className="h-4 w-4" />
          Retry
        </button>
      </div>
    )
  }

  const overviewCards = data
    ? [
        { label: 'Total Page Views', value: data.overview.totalViews, icon: FaEye, color: 'bg-blue-500' },
        { label: 'Unique Visitors', value: data.overview.uniqueVisitors, icon: FaUsers, color: 'bg-green-500' },
        { label: 'Chat Questions', value: data.overview.totalChatQuestions, icon: FaComment, color: 'bg-purple-500' },
        { label: 'Avg Daily Views', value: data.overview.avgViewsPerDay, icon: FaChartLine, color: 'bg-orange-500' },
      ]
    : []

  const maxPageViews = data ? Math.max(...data.topPages.map((p) => p.views), 1) : 1
  const maxCountryViews = data ? Math.max(...data.topCountries.map((c) => c.views), 1) : 1

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <div className="flex gap-2 flex-wrap">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                range === r.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6"
              >
                <Skeleton className="w-12 h-12 rounded-lg mb-4" />
                <Skeleton className="w-20 h-8 mb-2" />
                <Skeleton className="w-28 h-4" />
              </div>
            ))
          : overviewCards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.label}
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6"
                >
                  <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold">{card.value.toLocaleString()}</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{card.label}</p>
                </div>
              )
            })}
      </div>

      {/* Views Over Time */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Views Over Time</h2>
        {loading ? (
          <Skeleton className="w-full h-72" />
        ) : data && data.viewsByDay.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.viewsByDay}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34C759" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#34C759" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis
                dataKey="date"
                className="text-gray-500 dark:text-gray-400"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => {
                  const d = new Date(v)
                  return `${d.getMonth() + 1}/${d.getDate()}`
                }}
              />
              <YAxis className="text-gray-500 dark:text-gray-400" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-bg, #fff)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                }}
              />
              <Area type="monotone" dataKey="views" stroke="#007AFF" fill="url(#viewsGrad)" strokeWidth={2} name="Views" />
              <Area type="monotone" dataKey="uniqueVisitors" stroke="#34C759" fill="url(#visitorsGrad)" strokeWidth={2} name="Unique Visitors" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-12">No data yet</p>
        )}
      </div>

      {/* Top Pages */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Top Pages</h2>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-10" />
            ))}
          </div>
        ) : data && data.topPages.length > 0 ? (
          <div className="space-y-3">
            {data.topPages.slice(0, 10).map((p) => (
              <div key={p.page} className="flex items-center gap-3">
                <span className="text-sm font-mono w-48 truncate text-gray-700 dark:text-gray-300" title={p.page}>
                  {p.page}
                </span>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full bg-primary/20 rounded-full flex items-center justify-end px-2"
                    style={{ width: `${Math.max((p.views / maxPageViews) * 100, 8)}%` }}
                  >
                    <span className="text-xs font-medium text-primary">{p.views}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data yet</p>
        )}
      </div>

      {/* Geography */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Countries */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaGlobe className="text-primary" /> Top Countries
          </h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-8" />
              ))}
            </div>
          ) : data && data.topCountries.length > 0 ? (
            <div className="space-y-3">
              {data.topCountries.map((c) => (
                <div key={c.country} className="flex items-center gap-3">
                  <span className="text-sm w-32 truncate text-gray-700 dark:text-gray-300">{c.country}</span>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full bg-primary/30 rounded-full"
                      style={{ width: `${Math.max((c.views / maxCountryViews) * 100, 8)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12 text-right">
                    {c.views}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data yet</p>
          )}
        </div>

        {/* Top Regions & Cities */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Top Regions & Cities</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-8" />
              ))}
            </div>
          ) : data ? (
            <div>
              {data.topRegions.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Regions</h3>
                  <div className="space-y-2">
                    {data.topRegions.slice(0, 5).map((r) => (
                      <div key={r.region} className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{r.region}</span>
                        <span className="font-medium text-gray-600 dark:text-gray-400">{r.views}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {data.topCities.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Cities</h3>
                  <div className="space-y-2">
                    {data.topCities.slice(0, 5).map((c) => (
                      <div key={c.city} className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{c.city}</span>
                        <span className="font-medium text-gray-600 dark:text-gray-400">{c.views}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {data.topRegions.length === 0 && data.topCities.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data yet</p>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Device & Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Devices */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Devices</h2>
          {loading ? (
            <Skeleton className="w-full h-48" />
          ) : data && data.deviceBreakdown.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.deviceBreakdown}
                    dataKey="count"
                    nameKey="device"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    strokeWidth={0}
                  >
                    {data.deviceBreakdown.map((entry) => (
                      <Cell key={entry.device} fill={DEVICE_COLORS[entry.device] || '#8E8E93'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2">
                {data.deviceBreakdown.map((d) => {
                  const Icon = DEVICE_ICONS[d.device] || FaDesktop
                  return (
                    <div key={d.device} className="flex items-center gap-2 text-sm">
                      <span style={{ color: DEVICE_COLORS[d.device] || '#8E8E93' }}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="capitalize text-gray-700 dark:text-gray-300">{d.device}</span>
                      <span className="font-medium text-gray-500 dark:text-gray-400">({d.count})</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data yet</p>
          )}
        </div>

        {/* Browsers */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Browsers</h2>
          {loading ? (
            <Skeleton className="w-full h-48" />
          ) : data && data.browserBreakdown.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.browserBreakdown}
                    dataKey="count"
                    nameKey="browser"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    strokeWidth={0}
                  >
                    {data.browserBreakdown.map((_, i) => (
                      <Cell key={i} fill={BROWSER_COLORS[i % BROWSER_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {data.browserBreakdown.map((b, i) => (
                  <div key={b.browser} className="flex items-center gap-1.5 text-sm">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: BROWSER_COLORS[i % BROWSER_COLORS.length] }}
                    />
                    <span className="text-gray-700 dark:text-gray-300">{b.browser}</span>
                    <span className="font-medium text-gray-500 dark:text-gray-400">({b.count})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No data yet</p>
          )}
        </div>
      </div>

      {/* Content Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Blogs */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Top Blogs</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-10" />
              ))}
            </div>
          ) : data && data.topBlogs.length > 0 ? (
            <div className="space-y-3">
              {data.topBlogs.map((b) => {
                const maxBlog = Math.max(...data.topBlogs.map((x) => x.views), 1)
                return (
                  <div key={b.slug}>
                    <div className="flex justify-between text-sm mb-1">
                      <Link
                        href={`/blogs/${b.slug}`}
                        className="text-gray-700 dark:text-gray-300 hover:text-primary truncate mr-2"
                      >
                        {b.title}
                      </Link>
                      <span className="font-medium text-gray-500 dark:text-gray-400 shrink-0">{b.views} views</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(b.views / maxBlog) * 100}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No blog views yet</p>
          )}
        </div>

        {/* Top Projects */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Project Views</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-10" />
              ))}
            </div>
          ) : data && data.topProjects.length > 0 ? (
            <div className="space-y-3">
              {data.topProjects.map((p) => (
                <div key={p.title} className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{p.title}</span>
                  <span className="font-medium text-gray-500 dark:text-gray-400">{p.views} views</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No project views yet</p>
          )}
        </div>
      </div>

      {/* Chatbot Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Questions */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaComment className="text-primary" /> Recent Questions
          </h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-8" />
              ))}
            </div>
          ) : data && data.recentChatQuestions.length > 0 ? (
            <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
              {data.recentChatQuestions.map((q, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300">{q.question}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(q.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No questions yet</p>
          )}
        </div>

        {/* Most Asked Questions */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold mb-4">Most Asked Questions</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-full h-8" />
              ))}
            </div>
          ) : data && data.topChatQuestions.length > 0 ? (
            <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
              {data.topChatQuestions.map((q, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate mr-3">{q.question}</p>
                  <span className="shrink-0 bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                    {q.count}x
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No questions yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
