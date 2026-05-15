import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase Admin credentials!")
    // Return a dummy client that will fail gracefully on calls
    // or handle this in the calling actions
  }

  return createClient(supabaseUrl || '', supabaseServiceKey || '', {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
