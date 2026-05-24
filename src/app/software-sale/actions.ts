'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'

const RECIPIENT_NUMBER = '919847113888'

export async function submitSoftwareSale(formData: any) {
  const supabase = createAdminClient()

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

  try {
    // 1. Save to database
    const { data, error } = await supabase.from('software_sales').insert({
      date_from,
      date_to,
      shop_name,
      agent_name,
      software_sale_1: parseFloat(software_sale_1) || 0,
      whatsapp_count: parseFloat(whatsapp_count) || 0,
      whatsapp_cm: parseFloat(whatsapp_cm) || 0,
      whatsapp_total: parseFloat(whatsapp_total) || 0,
      old_amount: parseFloat(old_amount) || 0,
      total: parseFloat(total) || 0,
      win_amount: parseFloat(win_amount) || 0,
      paid_amount: parseFloat(paid_amount) || 0,
      collected_amount: parseFloat(collected_amount) || 0,
      balance: parseFloat(balance) || 0
    })

    if (error) {
      console.error('Error storing software sale:', error)
      return { success: false, error: error.message }
    }

    // 2. Return the formatted message to be copied to clipboard
    const message = [
      `*SOFTWARE SALE REPORT*`,
      `----------------------------`,
      `📅 *Date:* ${date_from} to ${date_to}`,
      `🏪 *Shop:* ${shop_name}`,
      `👤 *Agent:* ${agent_name}`,
      `----------------------------`,
      `🔹 *Software Sale 1:* ₹${parseFloat(software_sale_1) || 0}`,
      `🔹 *WhatsApp Sale:* ${parseFloat(whatsapp_count) || 0} × ₹${parseFloat(whatsapp_cm) || 0} = ₹${parseFloat(whatsapp_total) || 0}`,
      `🔸 *Old Amount:* ₹${parseFloat(old_amount) || 0}`,
      `----------------------------`,
      `💰 *TOTAL:* ₹${parseFloat(total) || 0}`,
      `🏆 *Win Amount:* ₹${parseFloat(win_amount) || 0}`,
      `💵 *Paid Amount:* ₹${parseFloat(paid_amount) || 0}`,
      `📥 *Collected Amount:* ₹${parseFloat(collected_amount) || 0}`,
      `📉 *BALANCE:* ₹${parseFloat(balance) || 0}`,
      `----------------------------`,
      `✅ *Submitted by Admin*`
    ].join('\n')

    return { success: true, message: message }
  } catch (err) {
    console.error('Unexpected error submitting software sale:', err)
    return { success: false, error: 'Failed to submit sale' }
  }
}

export async function getSoftwareSalesHistory() {
  const cookieStore = await cookies()
  const supabase = createAdminClient()
  const activeShopName = cookieStore.get('active_shop_name')?.value
  
  try {
    let query = supabase
      .from('software_sales')
      .select('*')
      .order('created_at', { ascending: false })

    if (activeShopName && activeShopName !== 'All') {
      query = query.eq('shop_name', activeShopName)
    }

    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching software sales history:', error)
      return []
    }
    
    return data || []
  } catch {
    return []
  }
}

export async function getLastOldAmount() {
  const supabase = createAdminClient()
  
  try {
    const { data, error } = await supabase
      .from('software_sales')
      .select('old_amount, balance, collected_amount, shop_name, date_to')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error || !data) return null
    
    const balance = data.balance || 0
    const collected = data.collected_amount || 0
    const pending = balance - collected

    return {
      old_amount: data.old_amount || 0,
      balance: balance,
      collected_amount: collected,
      pending: pending,
      shop_name: data.shop_name || '',
      date_to: data.date_to || ''
    }
  } catch {
    return null
  }
}
