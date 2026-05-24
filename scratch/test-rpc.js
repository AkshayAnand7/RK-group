const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) {
    env[key.trim()] = values.join('=').trim().replace(/['"\r]/g, '');
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function run() {
  console.log('Testing exec_sql...');
  const { error } = await supabase.rpc('exec_sql', {
    query: `SELECT 1;`
  });
  
  if (error) {
    console.error('Failed to run via RPC:', error.message);
  } else {
    console.log('RPC exists and works!');
  }
}

run();
