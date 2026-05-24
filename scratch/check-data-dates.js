const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length) env[key.trim()] = values.join('=').trim();
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: collections } = await supabase.from('collections').select('date, created_at');
  console.log("Collections dates:", [...new Set(collections.map(c => c.date))]);
  
  const { data: trips } = await supabase.from('trips').select('date, created_at');
  console.log("Trips dates:", [...new Set(trips.map(t => t.date))]);
}

check();
