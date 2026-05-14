const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkData() {
  const { data: col, error: colErr } = await supabase.from('collections').select('*').limit(5);
  console.log('Collections:', col, colErr);

  const { data: trips, error: tripErr } = await supabase.from('trips').select('*').limit(5);
  console.log('Trips:', trips, tripErr);
}

checkData();
