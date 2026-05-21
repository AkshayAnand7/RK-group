import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const user = req.auth?.user as any
  const role = user?.role

  const path = nextUrl.pathname

  const isOnAdmin = path.startsWith('/admin')
  const isOnTravel = path.startsWith('/travel')
  const isOnLottery = path.startsWith('/lottery')
  const isOnSoftwareSale = path.startsWith('/software-sale')
  const isOnLogin = path === '/login'

  // Redirect /admin to /admin/dashboard
  if (path === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', nextUrl))
  }

  // 1. Redirect unauthenticated users to login
  if ((isOnAdmin || isOnTravel || isOnLottery || isOnSoftwareSale) && !isLoggedIn) {
    // Save where they were trying to go
    const loginUrl = new URL('/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(loginUrl)
  }

  // 2. If on login page and already logged in, redirect ONLY if no callbackUrl
  if (isOnLogin && isLoggedIn) {
    const callbackUrl = nextUrl.searchParams.get('callbackUrl')
    if (callbackUrl) {
      // User has a specific destination — let them see login or redirect there
      return NextResponse.redirect(new URL(callbackUrl, nextUrl))
    }
    // No callback — send to their default dashboard
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl))
    } else if (role === 'agent') {
      return NextResponse.redirect(new URL('/software-sale', nextUrl))
    } else if (role === 'travel_staff' || role === 'staff') {
      // Temporary fallback for legacy roles
      return NextResponse.redirect(new URL('/travel', nextUrl)) 
    } else if (role === 'lottery_staff') {
      return NextResponse.redirect(new URL('/lottery', nextUrl))
    }
  }

  // 3. Role-Based Route Protection
  //    Admin can access EVERYTHING (superuser)
  if (role === 'admin') {
    return NextResponse.next()
  }

  // Non-admin role restrictions
  if (isOnAdmin) {
    return NextResponse.redirect(new URL('/login?error=Unauthorized', nextUrl))
  }
  
  if (isOnSoftwareSale && role !== 'agent') {
    return NextResponse.redirect(new URL('/login?error=Unauthorized', nextUrl))
  }

  if (isOnTravel && role !== 'travel_staff' && role !== 'staff') {
    return NextResponse.redirect(new URL('/login?error=Unauthorized', nextUrl))
  }
  if (isOnLottery && role !== 'lottery_staff' && role !== 'staff') {
    return NextResponse.redirect(new URL('/login?error=Unauthorized', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/travel/:path*',
    '/lottery/:path*',
    '/software-sale/:path*',
    '/login'
  ]
}
