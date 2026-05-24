import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

// Role-based access matrix
const ROLE_ACCESS: Record<string, string[]> = {
  admin: ['/admin', '/lottery', '/travel', '/software-sale'],
  agent: ['/lottery', '/travel', '/software-sale'],
  lottery_staff: ['/lottery'],
  travel_staff: ['/travel'],
  staff: ['/travel'], // legacy role, same as travel_staff
}

// Default landing page per role after login
const ROLE_DEFAULT_PAGE: Record<string, string> = {
  admin: '/admin/dashboard',
  agent: '/software-sale',
  lottery_staff: '/lottery',
  travel_staff: '/travel',
  staff: '/travel',
}

// All protected route prefixes
const PROTECTED_PREFIXES = ['/admin', '/lottery', '/travel', '/software-sale']

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const user = req.auth?.user as any
  const role: string = user?.role || ''
  const path = nextUrl.pathname

  const isOnLogin = path === '/login'

  // Redirect /admin to /admin/dashboard
  if (path === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', nextUrl))
  }

  // --- LOGIN PAGE LOGIC ---
  if (isOnLogin) {
    // If already logged in, redirect to dashboard (don't show login page again)
    if (isLoggedIn) {
      const callbackUrl = nextUrl.searchParams.get('callbackUrl')
      if (callbackUrl) {
        // Validate that the user can actually access the callbackUrl
        const allowedPrefixes = ROLE_ACCESS[role] || []
        const canAccess = allowedPrefixes.some(prefix => callbackUrl.startsWith(prefix))
        if (canAccess) {
          return NextResponse.redirect(new URL(callbackUrl, nextUrl))
        }
      }
      // No callback or not allowed — send to their default dashboard
      const defaultPage = ROLE_DEFAULT_PAGE[role] || '/'
      return NextResponse.redirect(new URL(defaultPage, nextUrl))
    }
    // Not logged in on login page — allow through
    return NextResponse.next()
  }

  // --- PROTECTED ROUTES LOGIC ---
  const isProtectedRoute = PROTECTED_PREFIXES.some(prefix => path.startsWith(prefix))

  if (isProtectedRoute) {
    // Not logged in — redirect to login with callbackUrl
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', nextUrl)
      loginUrl.searchParams.set('callbackUrl', path)
      return NextResponse.redirect(loginUrl)
    }

    // Logged in — check role-based access
    const allowedPrefixes = ROLE_ACCESS[role] || []
    const canAccess = allowedPrefixes.some(prefix => path.startsWith(prefix))
    if (!canAccess) {
      // Redirect to home page, not login — prevents back-button loop to login
      return NextResponse.redirect(new URL('/', nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/travel/:path*',
    '/lottery/:path*',
    '/software-sale/:path*',
    '/login',
  ],
}
