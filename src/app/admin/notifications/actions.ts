'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getNotifications() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false })
  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }
  return data || []
}

export async function markAllAsRead() {
  const supabase = createAdminClient()
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('is_read', false)
  if (error) return { error: error.message }
  revalidatePath('/admin/notifications')
  return { success: true }
}

export async function deleteNotification(id: number) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('notifications').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/notifications')
  return { success: true }
}
