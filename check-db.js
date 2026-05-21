const { createClient } = require('@supabase/supabase-js');


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkData() {
  const { data: collections, error: collError } = await supabase.from('collections').select('*');
  const { data: trips, error: tripsError } = await supabase.from('trips').select('*');
  const { data: expenses, error: expError } = await supabase.from('expenses').select('*');

  console.log('Collections:', collections?.length, collError?.message || '');
  console.log('Trips:', trips?.length, tripsError?.message || '');
  console.log('Expenses:', expenses?.length, expError?.message || '');
}

checkData();
