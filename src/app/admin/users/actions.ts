'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function getUsers() {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('auth_users')
      .select('*')
      .order('full_name', { ascending: true })

    if (error) {
      console.error("Supabase Auth Users Error:", error)
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
    .from('auth_users')
    .update({ role })
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/users')
  return { success: true }
}

export async function createUser(formData: FormData) {
  const supabase = createAdminClient()

  const user_id = formData.get('user_id') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const role = formData.get('role') as string

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Generate a unique ID (e.g. cuid_...)
  const newId = `cuid_${user_id.toLowerCase()}_${Date.now()}`

  // Insert into auth_users
  const { error } = await supabase
    .from('auth_users')
    .insert({
      id: newId,
      user_id: user_id,
      password: hashedPassword,
      full_name: full_name,
      role: role,
      is_active: true
    })

  if (error) return { error: error.message }
  
  // If the new user is an agent, automatically add them to the agents list
  if (role === 'agent') {
    await supabase.from('agents').insert({
      agent_id: user_id.toUpperCase(),
      full_name: full_name,
      phone: null,
      company: null,
      commission_rate: 0,
      status: 'active'
    })
    // We intentionally don't return if this fails, as the user was still created successfully
  }
  
  revalidatePath('/admin/users')
  return { success: true }
}

export async function deleteUser(id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('auth_users').delete().eq('id', id)
  
  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { success: true }
}
