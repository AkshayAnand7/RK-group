'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getAdminBookings(search?: string) {
  const supabase = createAdminClient()

  let query = supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`customer_name.ilike.%${search}%,customer_number.ilike.%${search}%,staff_name.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) {
    console.error("Error fetching admin bookings:", error)
    return []
  }
  return data
}

export async function updateBookingStatus(id: number, status: string) {
  const supabase = createAdminClient()

  // Update Booking Status
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError) return { error: fetchError.message }

  const { error: updateError } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)

  if (updateError) return { error: updateError.message }

  // If accepted, create a TRIP record automatically
  if (status === 'accepted') {
    const { error: tripError } = await supabase
      .from('trips')
      .insert({
        date: booking.date,
        staff_name: booking.staff_name,
        vehicle: booking.vehicle,
        from_location: booking.from_location,
        to_location: booking.to_location,
        trip_type: booking.trip_type,
        total_amount: booking.total_amount || 0,
        received_amount: booking.received_amount || 0,
        status: 'active'
      })

    if (tripError) console.error("Failed to create trip record:", tripError)
  }
  
  revalidatePath('/admin/bookings')
  revalidatePath('/admin/trips')
  return { success: true }
}

export async function deleteBooking(id: number) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('bookings').delete().eq('id', id)
  
  if (error) return { error: error.message }

  revalidatePath('/admin/bookings')
  return { success: true }
}
