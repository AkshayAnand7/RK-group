'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getShops() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('shops').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addShop(formData: FormData) {
  const supabase = createAdminClient()

  const shop_id = formData.get('shop_id') as string
  const name = formData.get('name') as string
  const location = formData.get('location') as string
  const staff_id = formData.get('staff_id') as string || null

  const { error } = await supabase.from('shops').insert({
    shop_id,
    name,
    location,
    staff_id,
    status: 'active'
  })

  if (error) return { error: error.message }
  
  revalidatePath('/admin/shops')
  return { success: true }
}

export async function updateShop(shop_id: string, formData: FormData) {
  const supabase = createAdminClient()

  const name = formData.get('name') as string
  const location = formData.get('location') as string
  const staff_id = formData.get('staff_id') as string || null

  const { error } = await supabase.from('shops')
    .update({ name, location, staff_id })
    .eq('shop_id', shop_id)

  if (error) return { error: error.message }
  
  revalidatePath('/admin/shops')
  return { success: true }
}

export async function deleteShop(shop_id: string) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('shops').delete().eq('shop_id', shop_id)
  
  if (error) return { error: error.message }

  revalidatePath('/admin/shops')
  return { success: true }
}
