'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function login(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Fetch profile to get role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', data.user.id)
    .single()

  if (profile) {
    cookieStore.set('user_role', profile.role || 'staff', { path: '/' })
    cookieStore.set('user_name', profile.full_name || email, { path: '/' })
    
    if (profile.role === 'super_admin') {
      cookieStore.set('admin_session', 'true', { path: '/' })
    } else {
      cookieStore.set('staff_session', 'true', { path: '/' })
    }
  }

  return { success: true, role: profile?.role }
}

export async function logout() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  await supabase.auth.signOut()
  
  cookieStore.delete('admin_session')
  cookieStore.delete('staff_session')
  cookieStore.delete('user_role')
  cookieStore.delete('user_name')
  cookieStore.delete('active_shop_id')
  cookieStore.delete('active_shop_name')
}
