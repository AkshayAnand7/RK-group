'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { createAdminClient } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getVehicles() {
  const cookieStore = await cookies()
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('vehicle_number', { ascending: true })
  if (error) {
    console.error('Error fetching vehicles:', error)
    return []
  }
  return data
}

export async function addVehicle(formData: FormData) {
  const supabase = createAdminClient()

  const vehicle_number = (formData.get('vehicle_number') as string).toUpperCase()
  const model = formData.get('model') as string

  const { error } = await supabase.from('vehicles').insert({
    vehicle_number,
    model,
    status: 'active'
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/vehicles')
  return { success: true }
}

export async function updateVehicle(id: number, formData: FormData) {
  const supabase = createAdminClient()

  const vehicle_number = (formData.get('vehicle_number') as string).toUpperCase()
  const model = formData.get('model') as string
  const status = formData.get('status') as string || 'active'

  const { error } = await supabase.from('vehicles')
    .update({ vehicle_number, model, status })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/vehicles')
  return { success: true }
}

export async function deleteVehicle(id: number) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('vehicles').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/vehicles')
  return { success: true }
}
