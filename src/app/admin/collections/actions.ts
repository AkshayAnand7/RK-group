'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getLotteryEntries(search?: string, period: string = 'today') {
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
  // Use IST offset (+05:30) for accurate day boundaries
  if (period === 'today') {
    const now = new Date()
    // Get IST date components
    const istOffset = 5.5 * 60 * 60 * 1000
    const istNow = new Date(now.getTime() + istOffset)
    const istDateStr = istNow.toISOString().split('T')[0] // YYYY-MM-DD in IST
    // Start of day in IST = midnight IST = 18:30 UTC previous day
    const startOfDayIST = new Date(`${istDateStr}T00:00:00+05:30`).toISOString()
    query = query.gte('created_at', startOfDayIST)
  } else if (period === 'weekly') {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    weekAgo.setHours(0, 0, 0, 0)
    query = query.gte('created_at', weekAgo.toISOString())
  } else if (period === 'monthly') {
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    monthAgo.setHours(0, 0, 0, 0)
    query = query.gte('created_at', monthAgo.toISOString())
  }
  // period === 'all' → no date filter

  const { data, error } = await query
  if (error) {
    console.error("Error fetching collections:", error)
    return []
  }
  return data || []
}


export async function toggleCollectionLock(id: number, locked: boolean) {
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
  const supabase = createAdminClient()
  
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/collections')
  return { success: true }
}
