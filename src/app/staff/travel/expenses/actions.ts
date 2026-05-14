'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getExpenses() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase.from('expenses').select('*').order('date', { ascending: false }).limit(10)
  if (error) return []
  return data
}

export async function submitExpense(formData: any) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from('expenses').insert({
    date: formData.date,
    vehicle: formData.vehicle,
    category: formData.category.toLowerCase(),
    amount: Number(formData.amount),
    description: formData.description,
    staff_name: formData.staffName,
    created_at: new Date().toISOString()
  })

  if (error) return { error: error.message }

  // Create notification
  await supabase.from('notifications').insert({
    type: 'alert',
    title: 'New Expense Reported',
    message: `${formData.category} expense of ₹${formData.amount} reported for ${formData.vehicle} by ${formData.staffName}.`,
    created_at: new Date().toISOString()
  })

  revalidatePath('/staff/travel/expenses')
  revalidatePath('/admin/expenses')
  revalidatePath('/admin/dashboard')
  return { success: true }
}
