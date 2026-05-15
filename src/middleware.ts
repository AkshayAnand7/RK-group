import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const isAdminRoute = (pathname.startsWith('/admin') || (pathname.startsWith('/software-sale') && pathname !== '/software-sale/login')) && pathname !== '/admin/login';
  const isStaffRoute = pathname.startsWith('/staff');

  // For simulation: Get auth cookies
  const isAdminAuth = request.cookies.get('admin_session')?.value === 'true';
  const isStaffAuth = request.cookies.get('staff_session')?.value === 'true';

  // 1. Protect Admin Routes
  if (isAdminRoute && !isAdminAuth) {
    const loginUrl = new URL(pathname.startsWith('/software-sale') ? '/software-sale/login' : '/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Protect Staff Routes
  if (isStaffRoute && !isStaffAuth) {
    const loginUrl = new URL('/', request.url); // Send back to home for selection
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/admin/:path*',
    '/staff/:path*',
    '/software-sale/:path*',
  ],
};
