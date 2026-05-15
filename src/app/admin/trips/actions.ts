'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getTrips() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('trips').select(`
      *,
      driver:profiles(full_name),
      vehicle:vehicles(vehicle_number)
    `).order('date', { ascending: false })
    
    if (error) {
      console.error("Supabase error in getTrips:", error)
      return []
    }
    return data || []
  } catch (e) {
    console.error("Runtime error in getTrips:", e)
    return []
  }
}

export async function getVehicles() {
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase.from('vehicles').select('*').order('vehicle_number', { ascending: true })
    if (error) {
      console.error("Supabase error in getVehicles:", error)
      return []
    }
    return data || []
  } catch (e) {
    console.error("Runtime error in getVehicles:", e)
    return []
  }
}

export async function toggleTripLock(id: number, is_locked: boolean) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('trips').update({ is_locked }).eq('id', id)
  
  if (error) return { error: error.message }

  revalidatePath('/admin/trips')
  return { success: true }
}

export async function updateTrip(id: number, formData: FormData) {
  const supabase = createAdminClient()

  const from_location = formData.get('from') as string
  const to_location = formData.get('to') as string
  const total_amount = Number(formData.get('total'))
  const received_amount = Number(formData.get('received'))

  const { error } = await supabase.from('trips')
    .update({ from_location, to_location, total_amount, received_amount })
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/trips')
  return { success: true }
}

export async function deleteTrip(id: number) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('trips').delete().eq('id', id)
  
  if (error) return { error: error.message }

  revalidatePath('/admin/trips')
  return { success: true }
}
