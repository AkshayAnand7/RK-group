'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getUsers() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name', { ascending: true })

  if (error) throw error
  return data
}

export async function updateUserRole(id: string, role: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/users')
  return { success: true }
}

export async function deleteUser(id: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // Note: This only deletes the profile, not the auth user.
  // In production, you'd usually use a service role to delete the auth user too.
  const { error } = await supabase.from('profiles').delete().eq('id', id)
  
  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { success: true }
}
