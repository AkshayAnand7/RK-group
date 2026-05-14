'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { sendWhatsAppMessage } from '@/lib/twilio'

export async function submitBooking(formData: any) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // 1. Insert into Supabase
  const { error } = await supabase.from('bookings').insert({
    staff_name: formData.staffName,
    customer_name: formData.customerName,
    customer_number: formData.customerNumber,
    vehicle: formData.vehicle,
    from_location: formData.fromLocation,
    to_location: formData.toLocation,
    trip_type: formData.tripType,
    total_amount: Number(formData.totalAmount) || 0,
    received_amount: Number(formData.receivedAmount) || 0,
    status: 'pending',
    date: formData.date || new Date().toISOString().split('T')[0]
  })

  if (error) return { error: error.message }

  // 2. Automated WhatsApp via Twilio
  const adminPhone = "+919809207080"
  const whatsappMessage = 
    `📅 *NEW TRAVEL BOOKING*\n\n` +
    `👤 *Staff:* ${formData.staffName}\n` +
    `🤝 *Customer:* ${formData.customerName} (${formData.customerNumber})\n` +
    `🚗 *Vehicle:* ${formData.vehicle}\n` +
    `📍 *From:* ${formData.fromLocation}\n` +
    `🏁 *To:* ${formData.toLocation}\n` +
    `🔄 *Type:* ${formData.tripType === 'round' ? 'Round Trip' : 'One Side'}\n` +
    `💰 *Total:* ₹${formData.totalAmount || 0}\n` +
    `💵 *Received:* ₹${formData.receivedAmount || 0}\n\n` +
    `✅ _Booking saved as PENDING_`

  await sendWhatsAppMessage(adminPhone, whatsappMessage)

  revalidatePath('/staff/travel/booking')
  return { success: true }
}

export async function getBookings() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return []
  return data
}

export async function updateBookingStatus(id: number, status: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // 1. Update Booking Status
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

  // 2. If accepted, create a TRIP record automatically
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
  
  revalidatePath('/staff/travel/booking')
  revalidatePath('/staff/travel/trips')
  return { success: true }
}
