'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function addTodo(formData: FormData) {
  const supabase = createAdminClient()

  const name = formData.get('name') as string

  if (!name) return

  const { error } = await supabase.from('todos').insert({ name })

  if (error) {
    console.error('Error adding todo:', error)
    return { error: error.message }
  }

  revalidatePath('/todos')
}

export async function toggleTodo(id: number, is_completed: boolean) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('todos').update({ is_completed }).eq('id', id)

  if (error) {
    console.error('Error toggling todo:', error)
    return { error: error.message }
  }

  revalidatePath('/todos')
}
