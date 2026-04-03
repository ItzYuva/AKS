import { NextRequest } from 'next/server'
import connectDB from '@/lib/mongodb'
import PageView from '@/models/PageView'
import { getGeoData } from '@/lib/geoip'
import { hashIp } from '@/lib/hashIp'
import { parseUserAgent } from '@/lib/parseUserAgent'

// Rate limiting
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW = 60 * 1000
const RATE_LIMIT_MAX = 30

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) || []
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW)
  recent.push(now)
  rateLimitMap.set(ip, recent)
  return recent.length > RATE_LIMIT_MAX
}

export async function POST(req: NextRequest) {
  try {
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0].trim() || 'unknown'

    if (isRateLimited(ip)) {
      return Response.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const { page, referrer, sessionId } = body

    if (!page || typeof page !== 'string') {
      return Response.json({ error: 'Page is required' }, { status: 400 })
    }

    const ua = req.headers.get('user-agent') || ''
    const { device, browser } = parseUserAgent(ua)
    const geo = await getGeoData(ip)
    const hashedIp = hashIp(ip)

    await connectDB()

    await PageView.create({
      page,
      referrer: referrer || '',
      userAgent: ua,
      ip: hashedIp,
      country: geo.country,
      region: geo.region,
      city: geo.city,
      device,
      browser,
      sessionId: sessionId || '',
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Analytics track error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
