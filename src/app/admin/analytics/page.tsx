import { createAdminClient } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import AnalyticsClient from './analytics-client'

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const cookieStore = await cookies()
  const supabase = createAdminClient()

  // 1. Fetch all trips
  const { data: trips } = await supabase.from('trips').select('*')
  
  // 2. Fetch all expenses
  const { data: expenses } = await supabase.from('expenses').select('*')

  return <AnalyticsClient initialTrips={trips || []} initialExpenses={expenses || []} />;
}
