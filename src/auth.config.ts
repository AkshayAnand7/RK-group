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
      // Let ALL requests through to the middleware handler.
      // The middleware's auth() wrapper handles route protection
      // with proper role-based checks and redirects.
      // Returning true here means "allow the request to proceed to middleware".
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
