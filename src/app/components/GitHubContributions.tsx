'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fadeInUp, fadeIn } from '@/utils/animations'
import { FaCodeBranch, FaCalendarAlt, FaFire, FaStar } from 'react-icons/fa'

interface ContributionDay {
  date: string
  count: number
  level: number
}

interface Stats {
  currentStreak: number
  totalContributions: number
  bestDay: { date: string; count: number }
}

const HEATMAP_COLORS = {
  light: [
    'bg-gray-200',
    'bg-blue-200',
    'bg-blue-400',
    'bg-blue-500',
    'bg-[#007AFF]',
  ],
  dark: [
    'bg-[#1e293b]',
    'bg-[#1e3a5f]',
    'bg-[#0055b3]',
    'bg-[#006ae6]',
    'bg-[#007AFF]',
  ],
}

function calculateStats(contributions: ContributionDay[]): Stats {
  const today = new Date().toISOString().split('T')[0]

  // Current streak: count consecutive days with contributions ending at today (or yesterday)
  let currentStreak = 0
  const sorted = [...contributions]
    .filter(d => d.date <= today)
    .sort((a, b) => b.date.localeCompare(a.date))

  for (const day of sorted) {
    if (day.count > 0) {
      currentStreak++
    } else {
      // Allow today to be 0 if streak was up to yesterday
      if (day.date === today && currentStreak === 0) continue
      break
    }
  }

  // Total contributions this year
  const currentYear = new Date().getFullYear().toString()
  const totalContributions = contributions
    .filter(d => d.date.startsWith(currentYear))
    .reduce((sum, d) => sum + d.count, 0)

  // Best day
  const bestDay = contributions
    .filter(d => d.date <= today)
    .reduce(
      (best, d) => (d.count > best.count ? { date: d.date, count: d.count } : best),
      { date: '', count: 0 }
    )

  return { currentStreak, totalContributions, bestDay }
}

function getLast30Days(contributions: ContributionDay[]): ContributionDay[] {
  const today = new Date()
  const days: ContributionDay[] = []
  const contributionMap = new Map(contributions.map(d => [d.date, d]))

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const entry = contributionMap.get(dateStr)
    days.push(entry || { date: dateStr, count: 0, level: 0 })
  }

  return days
}

export default function GitHubContributions() {
  const [stats, setStats] = useState<Stats>({ currentStreak: 0, totalContributions: 0, bestDay: { date: '', count: 0 } })
  const [last30, setLast30] = useState<ContributionDay[]>([])
  const [loading, setLoading] = useState(true)
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)

  useEffect(() => {
    async function fetchContributions() {
      try {
        const res = await fetch('https://github-contributions-api.jogruber.de/v4/ItzYuva')
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()
        const contributions: ContributionDay[] = data.contributions || []

        setStats(calculateStats(contributions))
        setLast30(getLast30Days(contributions))
      } catch {
        // fallback empty
      } finally {
        setLoading(false)
      }
    }

    fetchContributions()
  }, [])

  const statCards = [
    {
      icon: FaCalendarAlt,
      label: 'Current Streak',
      value: `${stats.currentStreak} days`,
      accent: true,
    },
    {
      icon: FaFire,
      label: 'Total Contributions',
      value: stats.totalContributions.toLocaleString(),
      accent: false,
    },
    {
      icon: FaStar,
      label: 'Best Day',
      value: `${stats.bestDay.count} commits`,
      accent: false,
    },
  ]

  return (
    <section className="py-20">
      <motion.div
        className="container max-w-7xl mx-auto px-4"
        {...fadeInUp}
      >
        {/* Title */}
        <h2 className="text-3xl font-bold mb-12 text-center">
          GitHub <span className="text-primary">Activity</span>
        </h2>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* Contribution Activity header */}
          <motion.div className="flex items-center gap-3" {...fadeIn}>
            <FaCodeBranch className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Contribution Activity</h3>
          </motion.div>

          {/* Stat Cards */}
          {loading ? (
            <div className="h-28 flex items-center justify-center text-secondary">
              Loading GitHub activity...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {statCards.map((card, i) => {
                  const Icon = card.icon
                  return (
                    <motion.div
                      key={card.label}
                      className="bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-5"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Icon className="h-5 w-5 text-primary mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
                      <p className={`text-2xl font-bold ${card.accent ? 'text-primary' : ''}`}>
                        {card.value}
                      </p>
                    </motion.div>
                  )
                })}
              </div>

              {/* Last 30 Days */}
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Last 30 Days</p>
                <div className="flex gap-1.5 flex-wrap">
                  {last30.map((day, i) => (
                    <motion.div
                      key={day.date}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-md transition-all cursor-default ${HEATMAP_COLORS.light[day.level]} dark:${HEATMAP_COLORS.dark[day.level]}`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.02 }}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect()
                        setTooltip({
                          text: `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
                          x: rect.left + rect.width / 2,
                          y: rect.top,
                        })
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-end gap-1.5 mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <span>Less</span>
                  {[0, 1, 2, 3, 4].map(level => (
                    <div
                      key={level}
                      className={`w-4 h-4 rounded-sm ${HEATMAP_COLORS.light[level]} dark:${HEATMAP_COLORS.dark[level]}`}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="fixed z-50 px-3 py-1.5 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md pointer-events-none whitespace-nowrap"
            style={{
              left: tooltip.x,
              top: tooltip.y - 40,
              transform: 'translateX(-50%)',
            }}
          >
            {tooltip.text}
          </div>
        )}
      </motion.div>
    </section>
  )
}
