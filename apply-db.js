const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Read env file
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) {
    env[key.trim()] = values.join('=').trim().replace(/['"]/g, '');
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log('Adding driver_name to trips table...');
  const { error } = await supabase.rpc('exec_sql', {
    query: `ALTER TABLE trips ADD COLUMN IF NOT EXISTS driver_name TEXT;`
  });
  
  if (error) {
    console.error('Failed to run via RPC (might not exist):', error.message);
    console.log('Please ask the user to run fix-driver.sql manually in Supabase SQL Editor.');
  } else {
    console.log('Success!');
  }
}

run();
