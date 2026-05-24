'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getTrips() {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error("Error fetching trips:", error)
    return []
  }
  return data || []
}

export async function getVehicles() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('vehicles').select('*').order('vehicle_number', { ascending: true })
  if (error) return []
  return data || []
}

export async function submitTrip(formData: any) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('trips').insert({
    date: formData.date,
    driver_id: null,
    vehicle_id: null,
    driver_name: formData.driverName,
    customer_name: formData.customerName,
    from_location: formData.from,
    to_location: formData.to,
    total_amount: Number(formData.amount),
    received_amount: Number(formData.received),
    trip_type: formData.type,
    is_locked: false,
    staff_name: formData.staffName,
    created_at: new Date().toISOString()
  })

  if (error) return { error: error.message }

  // Create notification
  await supabase.from('notifications').insert({
    type: 'travel',
    title: 'New Trip Reported',
    message: `${formData.from} to ${formData.to} trip submitted by ${formData.staffName}. Amount: ₹${formData.received}`,
    created_at: new Date().toISOString()
  })

  revalidatePath('/admin/trips')
  revalidatePath('/admin/dashboard')
  return { success: true }
}
