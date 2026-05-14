'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getNotifications() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function markAllAsRead() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('is_read', false)
  if (error) throw error
  revalidatePath('/admin/notifications')
  return { success: true }
}

export async function deleteNotification(id: number) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { error } = await supabase.from('notifications').delete().eq('id', id)
  if (error) throw error
  revalidatePath('/admin/notifications')
  return { success: true }
}
