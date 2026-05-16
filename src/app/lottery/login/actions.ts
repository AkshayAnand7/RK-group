'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function loginToLottery(email: string, password: string) {
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

    // Set a legacy cookie for the rest of the app to know they are logged in
    cookieStore.set('staff_session', 'true', { path: '/' })
    
    // Get their role from profiles
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    if (profile) {
      cookieStore.set('user_role', profile.role, { path: '/' })
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected login error:', err)
    return { success: false, error: 'Something went wrong' }
  }
}
