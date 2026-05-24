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
  const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
  if (authError) return console.error(authError);
  
  const { data: profiles } = await supabase.from('profiles').select('id');
  const profileIds = new Set(profiles.map(p => p.id));
  
  for (const user of users) {
    if (!profileIds.has(user.id)) {
      console.log(`Missing profile for ${user.email}. Creating...`);
      const { error } = await supabase.from('profiles').insert({
        id: user.id,
        full_name: user.user_metadata?.full_name || user.email.split('@')[0],
        role: 'staff',
        email: user.email
      });
      if (error) console.error(error);
      else console.log(`Created profile for ${user.email}`);
    }
  }
}

run();
