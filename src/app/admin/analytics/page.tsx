import { createAdminClient } from '@/utils/supabase/admin'
import AnalyticsClient from './analytics-client'

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const supabase = createAdminClient()

  const [
    { data: trips },
    { data: expenses }
  ] = await Promise.all([
    supabase.from('trips').select('*'),
    supabase.from('expenses').select('*')
  ]);

  return <AnalyticsClient initialTrips={trips || []} initialExpenses={expenses || []} />;
}
