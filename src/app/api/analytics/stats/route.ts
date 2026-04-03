import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import PageView from '@/models/PageView'
import ChatLog from '@/models/ChatLog'
import Blog from '@/models/Blog'

function getDateFilter(range: string): Date | null {
  const now = new Date()
  switch (range) {
    case '7d':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case '30d':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case '90d':
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    case 'all':
      return null
    default:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const range = req.nextUrl.searchParams.get('range') || '30d'
    const dateFrom = getDateFilter(range)
    const dateFilter = dateFrom ? { createdAt: { $gte: dateFrom } } : {}

    const [
      totalViews,
      uniqueVisitors,
      totalChatQuestions,
      viewsByDay,
      topPages,
      topCountries,
      topRegions,
      topCities,
      deviceBreakdown,
      browserBreakdown,
      blogPageViews,
      recentChatQuestions,
      topChatQuestions,
    ] = await Promise.all([
      // Total views
      PageView.countDocuments(dateFilter),

      // Unique visitors (distinct sessionId)
      PageView.distinct('sessionId', { ...dateFilter, sessionId: { $ne: '' } }).then(
        (ids: string[]) => ids.length
      ),

      // Total chat questions
      ChatLog.countDocuments(dateFilter),

      // Views by day
      PageView.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            views: { $sum: 1 },
            uniqueVisitors: { $addToSet: '$sessionId' },
          },
        },
        {
          $project: {
            date: '$_id',
            views: 1,
            uniqueVisitors: { $size: '$uniqueVisitors' },
          },
        },
        { $sort: { date: 1 } },
      ]),

      // Top pages
      PageView.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$page', views: { $sum: 1 } } },
        { $project: { page: '$_id', views: 1, _id: 0 } },
        { $sort: { views: -1 } },
        { $limit: 20 },
      ]),

      // Top countries
      PageView.aggregate([
        { $match: { ...dateFilter, country: { $ne: '' } } },
        { $group: { _id: '$country', views: { $sum: 1 } } },
        { $project: { country: '$_id', views: 1, _id: 0 } },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),

      // Top regions
      PageView.aggregate([
        { $match: { ...dateFilter, region: { $ne: '' } } },
        { $group: { _id: '$region', views: { $sum: 1 } } },
        { $project: { region: '$_id', views: 1, _id: 0 } },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),

      // Top cities
      PageView.aggregate([
        { $match: { ...dateFilter, city: { $ne: '' } } },
        { $group: { _id: '$city', views: { $sum: 1 } } },
        { $project: { city: '$_id', views: 1, _id: 0 } },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),

      // Device breakdown
      PageView.aggregate([
        { $match: { ...dateFilter, device: { $ne: '' } } },
        { $group: { _id: '$device', count: { $sum: 1 } } },
        { $project: { device: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),

      // Browser breakdown
      PageView.aggregate([
        { $match: { ...dateFilter, browser: { $ne: '' } } },
        { $group: { _id: '$browser', count: { $sum: 1 } } },
        { $project: { browser: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),

      // Blog page views (pages matching /blogs/*)
      PageView.aggregate([
        {
          $match: {
            ...dateFilter,
            page: { $regex: /^\/blogs\/[^/]+$/ },
          },
        },
        { $group: { _id: '$page', views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 10 },
      ]),

      // Recent chat questions
      ChatLog.find(dateFilter)
        .sort({ createdAt: -1 })
        .limit(50)
        .select('question createdAt')
        .lean(),

      // Top chat questions (grouped by exact match)
      ChatLog.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$question', count: { $sum: 1 } } },
        { $project: { question: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]),
    ])

    // Resolve blog slugs to titles
    const blogSlugs = blogPageViews.map((b: { _id: string; views: number }) =>
      b._id.replace('/blogs/', '')
    )
    const blogs = await Blog.find({ slug: { $in: blogSlugs } })
      .select('title slug')
      .lean()
    const blogMap = new Map(blogs.map((b) => [b.slug, b.title]))

    const topBlogs = blogPageViews.map((b: { _id: string; views: number }) => {
      const slug = b._id.replace('/blogs/', '')
      return {
        title: blogMap.get(slug) || slug,
        slug,
        views: b.views,
      }
    })

    // Project views: count views to /projects page
    const projectPageView = topPages.find(
      (p: { page: string; views: number }) => p.page === '/projects'
    )
    const topProjects = projectPageView
      ? [{ title: 'Projects Page', views: projectPageView.views }]
      : []

    // Calculate avg views per day
    const dayCount = viewsByDay.length || 1
    const avgViewsPerDay = Math.round(totalViews / dayCount)

    return Response.json({
      overview: {
        totalViews,
        uniqueVisitors,
        totalChatQuestions,
        avgViewsPerDay,
      },
      viewsByDay,
      topPages,
      topCountries,
      topRegions,
      topCities,
      deviceBreakdown,
      browserBreakdown,
      topProjects,
      topBlogs,
      recentChatQuestions,
      topChatQuestions,
    })
  } catch (error) {
    console.error('Analytics stats error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
