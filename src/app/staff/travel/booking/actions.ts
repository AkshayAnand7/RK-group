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
    advance_amount: Number(formData.advanceAmount) || 0,
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
    `💰 *Advance:* ₹${formData.advanceAmount || 0}\n\n` +
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

  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/staff/travel/booking')
  return { success: true }
}
