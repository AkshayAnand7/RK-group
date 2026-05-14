'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getTrips() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase.from('trips').select(`
    *,
    driver:profiles(full_name),
    vehicle:vehicles(vehicle_number)
  `).order('date', { ascending: false })
  
  if (error) throw error
  return data
}

export async function toggleTripLock(id: number, is_locked: boolean) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from('trips').update({ is_locked }).eq('id', id)
  
  if (error) return { error: error.message }

  revalidatePath('/admin/trips')
  return { success: true }
}

export async function deleteTrip(id: number) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from('trips').delete().eq('id', id)
  
  if (error) return { error: error.message }

  revalidatePath('/admin/trips')
  return { success: true }
}
