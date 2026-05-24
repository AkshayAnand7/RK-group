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
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error(error);
  } else {
    console.log("Profiles count:", data.length);
    console.log("Columns:", Object.keys(data[0] || {}));
    console.log("rkadmin1 data:", data.find(d => d.full_name === 'rkadmin1'));
  }
}

run();
