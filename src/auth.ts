import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import bcrypt from 'bcryptjs'
import { createClient } from '@supabase/supabase-js'

// Use Supabase service role client to query auth_users table
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const user_id = credentials?.user_id as string
          const password = credentials?.password as string

          if (!user_id || !password) {
            console.log('[AUTH] Missing credentials')
            return null
          }

          const supabase = getSupabaseAdmin()
          const { data: user, error } = await supabase
            .from('auth_users')
            .select('*')
            .eq('user_id', user_id)
            .single()

          if (error || !user) {
            console.log('[AUTH] User not found:', user_id, error?.message)
            return null
          }

          if (!user.is_active) {
            console.log('[AUTH] User disabled:', user_id)
            return null
          }

          const passwordMatch = await bcrypt.compare(password, user.password)

          if (!passwordMatch) {
            console.log('[AUTH] Wrong password for:', user_id)
            return null
          }

          console.log('[AUTH] Login success:', user_id, user.role)
          return {
            id: user.id,
            user_id: user.user_id,
            name: user.full_name,
            role: user.role,
          }
        } catch (err) {
          console.error('[AUTH] Unexpected error:', err)
          return null
        }
      },
    }),
  ],
})

