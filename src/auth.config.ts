import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const path = nextUrl.pathname

      // Public routes that don't require authentication
      const publicRoutes = ['/login', '/']
      const isPublicRoute = publicRoutes.includes(path)

      if (isPublicRoute) {
        return true
      }

      // All other routes require authentication
      if (!isLoggedIn) {
        return false // NextAuth will redirect to signIn page
      }

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.user_id = (user as any).user_id
        token.role = (user as any).role
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        (session.user as any).user_id = token.user_id as string;
        (session.user as any).role = token.role as string;
      }
      return session
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
