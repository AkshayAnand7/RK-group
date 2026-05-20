import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const user = req.auth?.user as any
  const role = user?.role

  const isOnAdmin = nextUrl.pathname.startsWith('/admin')
  const isOnTravel = nextUrl.pathname.startsWith('/travel')
  const isOnLottery = nextUrl.pathname.startsWith('/lottery')
  const isOnLogin = nextUrl.pathname === '/login'

  if (nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', nextUrl))
  }

  // 1. Redirect unauthenticated users to login
  if ((isOnAdmin || isOnTravel || isOnLottery) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }

  // 2. Redirect authenticated users trying to access login
  if (isOnLogin && isLoggedIn) {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl))
    } else if (role === 'travel_staff') {
      return NextResponse.redirect(new URL('/travel', nextUrl))
    } else if (role === 'lottery_staff') {
      return NextResponse.redirect(new URL('/lottery', nextUrl))
    }
  }

  // 3. Role-Based Route Protection
  if (isOnAdmin && role !== 'admin') {
    return NextResponse.redirect(new URL('/login?error=Unauthorized', nextUrl))
  }
  if (isOnTravel && role !== 'travel_staff') {
    return NextResponse.redirect(new URL('/login?error=Unauthorized', nextUrl))
  }
  if (isOnLottery && role !== 'lottery_staff') {
    return NextResponse.redirect(new URL('/login?error=Unauthorized', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/travel/:path*',
    '/lottery/:path*',
    '/login'
  ]
}
