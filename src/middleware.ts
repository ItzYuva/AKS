import { NextRequest, NextResponse } from 'next/server'

function isValidToken(token: string): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET || ''
  return secret !== '' && token === secret
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip login page and login API
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next()
  }

  // Protect /admin/* pages
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin_session')?.value
    if (!token || !isValidToken(token)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // Protect mutating API routes (POST/PUT/DELETE)
  if (pathname.startsWith('/api/') && request.method !== 'GET') {
    const isPublicApi = pathname === '/api/contact' || pathname === '/api/admin/login' || pathname === '/api/chat'
    if (!isPublicApi) {
      const token = request.cookies.get('admin_session')?.value
      if (!token || !isValidToken(token)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
}
