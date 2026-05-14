'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function addTodo(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

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
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.from('todos').update({ is_completed }).eq('id', id)

  if (error) {
    console.error('Error toggling todo:', error)
    return { error: error.message }
  }

  revalidatePath('/todos')
}
