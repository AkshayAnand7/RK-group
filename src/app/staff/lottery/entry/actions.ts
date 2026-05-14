'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { sendWhatsAppMessage } from '@/lib/twilio'

export async function submitCollection(formData: any, shopName: string, shopId: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // 1. Insert the collection record
  const { error: collectionError } = await supabase.from('collections').insert({
    shop_id: shopId,
    shop_name: shopName,
    staff_name: formData.staffName,
    amount: Number(formData.collection),
    expense: Number(formData.expense || 0),
    advance: Number(formData.advance || 0),
    prize: Number(formData.prize || 0),
    date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString()
  })

  if (collectionError) return { error: collectionError.message }

  // 2. Create a notification for the admin
  await supabase.from('notifications').insert({
    type: 'collection',
    title: 'Daily Collection Submitted',
    message: `${shopName} has submitted their daily collection of ₹${formData.collection}.`,
    shop_id: shopId,
    created_at: new Date().toISOString()
  })

  // 3. Automated WhatsApp via Twilio
  const adminPhone = "+919809207080"
  const whatsappMessage = 
    `📊 *RK Lottery Daily Report*\n\n` +
    `🏪 *Shop:* ${shopName}\n` +
    `💻 *Software Sale:* ₹${formData.collection}\n` +
    `📉 *Expense:* ₹${formData.expense || 0}\n` +
    `💰 *Advance:* ₹${formData.advance || 0}\n` +
    `🏆 *Prize:* ₹${formData.prize || 0}\n` +
    `💎 *Net Balance:* ₹${Number(formData.collection) - Number(formData.expense || 0) - Number(formData.advance || 0) - Number(formData.prize || 0) - Number(formData.pending || 0)}\n\n` +
    `✅ _Submitted by: ${formData.staffName}_`

  try {
    await sendWhatsAppMessage(adminPhone, whatsappMessage)
  } catch (e) {
    console.error("WhatsApp failed but data was saved:", e)
  }

  revalidatePath('/admin/notifications')
  revalidatePath('/admin/collections')
  revalidatePath('/admin/dashboard')
  return { success: true }
}

