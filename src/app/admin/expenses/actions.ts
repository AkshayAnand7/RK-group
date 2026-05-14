'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getExpenses() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getVehicles() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase.from('vehicles').select('*').order('vehicle_number', { ascending: true })
  if (error) return []
  return data
}

export async function addExpense(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const date = formData.get('date') as string
  const category = formData.get('category') as string
  const detail = formData.get('detail') as string
  const amount = Number(formData.get('amount'))
  const vehicle = formData.get('vehicle') as string
  const module = vehicle ? 'travel' : 'lottery'

  const { error } = await supabase.from('expenses').insert({
    date,
    category,
    detail,
    amount,
    vehicle,
    module,
    created_at: new Date().toISOString()
  })

  if (error) return { error: error.message }
  
  revalidatePath('/admin/expenses')
  return { success: true }
}

export async function deleteExpense(id: number) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from('expenses').delete().eq('id', id)
  
  if (error) return { error: error.message }

  revalidatePath('/admin/expenses')
  return { success: true }
}
