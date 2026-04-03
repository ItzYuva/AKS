'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

function getSessionId(): string {
  if (typeof window === 'undefined') return ''
  let id = localStorage.getItem('analytics_visitor_id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('analytics_visitor_id', id)
  }
  return id
}

export default function AnalyticsTracker() {
  const pathname = usePathname()
  const lastTracked = useRef<string>('')
  const lastTime = useRef<number>(0)

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin')) return

    const now = Date.now()
    if (pathname === lastTracked.current && now - lastTime.current < 2000) return

    lastTracked.current = pathname
    lastTime.current = now

    const payload = JSON.stringify({
      page: pathname,
      referrer: document.referrer,
      sessionId: getSessionId(),
    })

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/track', new Blob([payload], { type: 'application/json' }))
    } else {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {})
    }
  }, [pathname])

  return null
}
