'use server'

import { createAdminClient } from '@/utils/supabase/admin'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getUsers() {
  try {
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
  } catch (e) {
    console.error("Runtime error in getUsers:", e)
    return []
  }
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

export async function createUser(formData: FormData) {
  const supabase = createAdminClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const role = formData.get('role') as string

  // 1. Create User in Auth
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name }
  })

  if (authError) return { error: authError.message }

  // 2. Profile is handled by the SQL trigger we added earlier
  // But let's manually update the role since the trigger defaults to 'staff'
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ role, full_name, email })
    .eq('id', authUser.user.id)

  if (profileError) return { error: profileError.message }
  
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
