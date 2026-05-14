import { createClient } from './src/utils/supabase/server'
import { cookies } from 'next/headers'

async function debugData() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  
  const { data: col } = await supabase.from('collections').select('*').limit(1)
  console.log('Collections Sample:', col)
  
  const { data: trip } = await supabase.from('trips').select('*').limit(1)
  console.log('Trips Sample:', trip)
  
  const { data: exp } = await supabase.from('expenses').select('*').limit(1)
  console.log('Expenses Sample:', exp)
}

debugData()
