'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getExpenses() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase.from('expenses').select('*').order('date', { ascending: false })
  if (error) throw error
  return data
}

export async function addExpense(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const date = formData.get('date') as string
  const amount = parseFloat(formData.get('amount') as string)
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const module = formData.get('module') as 'lottery' | 'travel'
  const vehicle_id = formData.get('vehicle_id') as string || null

  const { error } = await supabase.from('expenses').insert({
    date,
    amount,
    description,
    category,
    module
  })

  if (error) return { error: error.message }
  
  revalidatePath('/admin/expenses')
  return { success: true }
}
