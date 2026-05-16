'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function submitSoftwareSale(formData: any) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const {
    date_from,
    date_to,
    shop_name,
    agent_name,
    software_sale_1,
    whatsapp_count,
    whatsapp_cm,
    whatsapp_total,
    old_amount,
    total,
    win_amount,
    paid_amount,
    collected_amount,
    balance
  } = formData

  const { data, error } = await supabase.from('software_sales').insert({
    date_from,
    date_to,
    shop_name,
    agent_name,
    software_sale_1: parseFloat(software_sale_1),
    whatsapp_count: parseFloat(whatsapp_count) || 0,
    whatsapp_cm: parseFloat(whatsapp_cm) || 0,
    whatsapp_total: parseFloat(whatsapp_total) || 0,
    old_amount: parseFloat(old_amount),
    total: parseFloat(total),
    win_amount: parseFloat(win_amount),
    paid_amount: parseFloat(paid_amount),
    collected_amount: parseFloat(collected_amount),
    balance: parseFloat(balance)
  })

  if (error) {
    console.error('Error storing software sale:', error)
    return { error: error.message }
  }

  return { success: true }
}

export async function getSoftwareSalesHistory() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  const { data, error } = await supabase.from('software_sales').select('*').order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching software sales history:', error)
    return []
  }
  
  return data
}
