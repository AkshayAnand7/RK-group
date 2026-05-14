import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import AnalyticsClient from './analytics-client'

export default async function AnalyticsPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  // 1. Fetch all trips
  const { data: trips } = await supabase.from('trips').select('*')
  
  // 2. Fetch all expenses
  const { data: expenses } = await supabase.from('expenses').select('*')

  return <AnalyticsClient initialTrips={trips || []} initialExpenses={expenses || []} />;
}
