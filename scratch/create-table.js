const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://mwvflrufzihmyxdcxnli.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dmZscnVmemlobXl4ZGN4bmxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc0Nzk0OSwiZXhwIjoyMDk0MzIzOTQ5fQ.F1l_hvPNdfNMdPehFYIxW8K8M_S6o08djUovA9XuyIQ',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function main() {
  const sql = `
    CREATE TABLE IF NOT EXISTS public.auth_users (
      id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      full_name TEXT NOT NULL,
      user_id TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT now()
    );
    ALTER TABLE public.auth_users ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS "Service role full access" ON public.auth_users;
    CREATE POLICY "Service role full access" ON public.auth_users FOR ALL USING (true) WITH CHECK (true);
  `;

  console.log('Attempting to create auth_users table...');
  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  
  if (error) {
    console.log('RPC exec_sql not available:', error.message);
    console.log('');
    console.log('Trying direct REST approach...');
    
    // Try using the management API / postgrest
    const response = await fetch('https://mwvflrufzihmyxdcxnli.supabase.co/rest/v1/rpc/exec_sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dmZscnVmemlobXl4ZGN4bmxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc0Nzk0OSwiZXhwIjoyMDk0MzIzOTQ5fQ.F1l_hvPNdfNMdPehFYIxW8K8M_S6o08djUovA9XuyIQ',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dmZscnVmemlobXl4ZGN4bmxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc0Nzk0OSwiZXhwIjoyMDk0MzIzOTQ5fQ.F1l_hvPNdfNMdPehFYIxW8K8M_S6o08djUovA9XuyIQ',
      },
      body: JSON.stringify({ query: sql }),
    });
    
    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', text);
    
    if (response.status !== 200) {
      console.log('');
      console.log('=================================================');
      console.log('MANUAL STEP REQUIRED:');
      console.log('=================================================');
      console.log('');
      console.log('Please go to your Supabase SQL Editor:');
      console.log('https://supabase.com/dashboard/project/mwvflrufzihmyxdcxnli/sql/new');
      console.log('');
      console.log('And run this SQL:');
      console.log('');
      console.log(sql);
      console.log('');
      console.log('Then run: node scratch/setup-auth.js');
    }
  } else {
    console.log('Table created successfully!', data);
  }
}

main().catch(console.error);
