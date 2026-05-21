'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createAdminClient } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getStaffMembers() {
  const cookieStore = await cookies()
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('Error fetching staff:', error)
    return []
  }
  return data
}

export async function addStaff(formData: FormData) {
  const supabase = createAdminClient()

  const staff_id = (formData.get('staff_id') as string).toUpperCase()
  const full_name = formData.get('full_name') as string
  const phone = formData.get('phone') as string || null
  const department = formData.get('department') as string || 'general'

  const { error } = await supabase.from('staff').insert({
    staff_id,
    full_name,
    phone,
    department,
    status: 'active'
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/staff')
  return { success: true }
}

export async function updateStaff(id: number, formData: FormData) {
  const supabase = createAdminClient()

  const full_name = formData.get('full_name') as string
  const phone = formData.get('phone') as string || null
  const department = formData.get('department') as string || 'general'
  const status = formData.get('status') as string || 'active'

  const { error } = await supabase.from('staff')
    .update({ full_name, phone, department, status })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/staff')
  return { success: true }
}

export async function deleteStaff(id: number) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('staff').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/staff')
  return { success: true }
}
