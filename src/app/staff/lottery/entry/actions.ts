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
    amount: formData.collection,
    date: new Date().toISOString().split('T')[0]
  })

  if (collectionError) return { error: collectionError.message }

  // 2. Create a notification for the admin
  await supabase.from('notifications').insert({
    type: 'collection',
    title: 'Daily Collection Submitted',
    message: `${shopName} has submitted their daily collection of ₹${formData.collection}.`,
    shop_id: shopId
  })

  // 3. Automated WhatsApp via Twilio
  const adminPhone = "+919809207080"
  const whatsappMessage = 
    `📊 *RK Lottery Daily Report*\n\n` +
    `🏪 *Shop:* ${shopName}\n` +
    `💻 *Software Sale:* ₹${formData.collection}\n` +
    `💎 *Net Balance:* ₹${Number(formData.collection) - Number(formData.expense) - Number(formData.advance) - Number(formData.prize) - Number(formData.pending)}\n\n` +
    `✅ _Submitted by: ${formData.staffName}_`

  await sendWhatsAppMessage(adminPhone, whatsappMessage)

  revalidatePath('/admin/notifications')
  return { success: true }
}

