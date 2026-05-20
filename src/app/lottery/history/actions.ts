'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function getHistory() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const shopId = cookieStore.get('active_shop_id')?.value
  
  if (!shopId) return []
  
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) {
    console.error("Error fetching history:", error)
    return []
  }
  return data
}
