'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getUsers() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name', { ascending: true })

  if (error) {
    console.error("Supabase Profiles Error:", error)
    return []
  }
  
  return data || []
}

export async function updateUserRole(id: string, role: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/users')
  return { success: true }
}

export async function deleteUser(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('profiles').delete().eq('id', id)
  
  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { success: true }
}
