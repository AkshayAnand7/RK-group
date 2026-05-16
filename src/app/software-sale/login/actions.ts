'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function loginToSoftwareSale(email: string, password: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Login error:', error.message)
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: 'Login failed. Please try again.' }
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected login error:', err)
    return { success: false, error: 'Something went wrong' }
  }
}
