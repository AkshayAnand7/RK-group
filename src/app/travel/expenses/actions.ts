'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getExpenses() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('expenses').select('*').order('date', { ascending: false }).limit(10)
  if (error) return []
  return data || []
}

export async function submitExpense(formData: any) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('expenses').insert({
    date: formData.date,
    vehicle: formData.vehicle,
    category: formData.category.toLowerCase(),
    amount: Number(formData.amount),
    description: formData.description,
    staff_name: formData.staffName,
    module: 'travel',
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

  revalidatePath('/travel/expenses')
  revalidatePath('/admin/expenses')
  revalidatePath('/admin/dashboard')
  return { success: true }
}
