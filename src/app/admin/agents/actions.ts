'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getAgents() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('Error fetching agents:', error)
    return []
  }
  return data
}

export async function addAgent(formData: FormData) {
  const supabase = createAdminClient()

  const agent_id = (formData.get('agent_id') as string).toUpperCase()
  const full_name = formData.get('full_name') as string
  const phone = formData.get('phone') as string || null
  const company = formData.get('company') as string || null
  const commission_rate = Number(formData.get('commission_rate')) || 0

  const { error } = await supabase.from('agents').insert({
    agent_id,
    full_name,
    phone,
    company,
    commission_rate,
    status: 'active'
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/agents')
  return { success: true }
}

export async function updateAgent(id: number, formData: FormData) {
  const supabase = createAdminClient()

  const full_name = formData.get('full_name') as string
  const phone = formData.get('phone') as string || null
  const company = formData.get('company') as string || null
  const commission_rate = Number(formData.get('commission_rate')) || 0
  const status = formData.get('status') as string || 'active'

  const { error } = await supabase.from('agents')
    .update({ full_name, phone, company, commission_rate, status })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/agents')
  return { success: true }
}

export async function deleteAgent(id: number) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('agents').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/agents')
  return { success: true }
}
