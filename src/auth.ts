import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { authConfig } from './auth.config'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
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
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ user_id: z.string(), password: z.string() })
          .safeParse(credentials)

        if (!parsedCredentials.success) {
          throw new Error('Invalid input format')
        }

        const { user_id, password } = parsedCredentials.data

        const supabase = getSupabaseAdmin()
        const { data: user, error } = await supabase
          .from('auth_users')
          .select('*')
          .eq('user_id', user_id)
          .single()

        if (error || !user) {
          throw new Error('Invalid user ID')
        }

        if (!user.is_active) {
          throw new Error('User disabled')
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
          throw new Error('Wrong password')
        }

        return {
          id: user.id,
          user_id: user.user_id,
          name: user.full_name,
          role: user.role,
        }
      },
    }),
  ],
})
