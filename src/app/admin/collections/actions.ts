'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getLotteryEntries(search?: string, period: string = 'today') {
  const cookieStore = await cookies()
  const supabase = createAdminClient()

  let query = supabase
    .from('collections')
    .select('*')
    .order('created_at', { ascending: false })

  // Search Filter
  if (search) {
    query = query.or(`shop_name.ilike.%${search}%,staff_name.ilike.%${search}%`)
  }

  // Period Filter
  const now = new Date()
  if (period === 'today') {
    const startOfDay = new Date(now.setHours(0,0,0,0)).toISOString()
    query = query.gte('created_at', startOfDay)
  } else if (period === 'weekly') {
    const startOfWeek = new Date(now.setDate(now.getDate() - 7)).toISOString()
    query = query.gte('created_at', startOfWeek)
  } else if (period === 'monthly') {
    const startOfMonth = new Date(now.setMonth(now.getMonth() - 1)).toISOString()
    query = query.gte('created_at', startOfMonth)
  }

  const { data, error } = await query
  if (error) {
    console.error("Error fetching collections:", error)
    return []
  }
  return data
}

export async function toggleCollectionLock(id: number, locked: boolean) {
  const cookieStore = await cookies()
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('collections')
    .update({ is_locked: locked })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/collections')
  return { success: true }
}

export async function updateCollection(id: number, formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createAdminClient()

  const amount = Number(formData.get('amount'))
  const expense = Number(formData.get('expense'))
  const advance = Number(formData.get('advance'))
  const prize = Number(formData.get('prize'))

  const { error } = await supabase.from('collections')
    .update({ amount, expense, advance, prize })
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/collections')
  return { success: true }
}

export async function deleteCollection(id: number) {
  const cookieStore = await cookies()
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/collections')
  return { success: true }
}
