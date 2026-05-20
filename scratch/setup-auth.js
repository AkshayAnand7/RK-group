// This script creates the auth_users table and seeds default users
// using the Supabase service role key (no Prisma/DATABASE_URL needed)

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = 'https://mwvflrufzihmyxdcxnli.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dmZscnVmemlobXl4ZGN4bmxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc0Nzk0OSwiZXhwIjoyMDk0MzIzOTQ5fQ.F1l_hvPNdfNMdPehFYIxW8K8M_S6o08djUovA9XuyIQ';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function main() {
  console.log('📦 Step 1: Checking if auth_users table exists...');
  
  // Use raw SQL to create the table
  const { data: sqlResult, error: sqlError } = await supabase.from('auth_users').select('id').limit(1);
  
  if (sqlError && sqlError.code === '42P01') {
    // Table doesn't exist - create it via SQL editor
    console.log('🔨 Table does not exist. Creating via SQL...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.auth_users (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        full_name TEXT NOT NULL,
        user_id TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT now()
      );

      -- Enable RLS but allow service role full access
      ALTER TABLE public.auth_users ENABLE ROW LEVEL SECURITY;
      
      -- Policy to allow service role to manage the table
      CREATE POLICY "Service role full access" ON public.auth_users
        FOR ALL USING (true) WITH CHECK (true);
    `;
    
    // We can't run arbitrary SQL via REST API without pg_execute or similar
    // Instead, let's try inserting directly - Supabase will auto-create if PostgREST is configured
    console.log('⚠️  Cannot create table via API. Will try direct insert...');
    console.log('');
    console.log('📋 Please run this SQL in your Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/mwvflrufzihmyxdcxnli/sql/new');
    console.log('');
    console.log(createTableSQL);
    console.log('');
    console.log('After creating the table, run this script again to seed users.');
    return;
  } else if (sqlError) {
    console.error('❌ Unexpected error:', sqlError.message);
    console.log('');
    console.log('📋 Please run this SQL in your Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/mwvflrufzihmyxdcxnli/sql/new');
    console.log('');
    console.log(`
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

CREATE POLICY "Service role full access" ON public.auth_users
  FOR ALL USING (true) WITH CHECK (true);
    `);
    console.log('');
    console.log('After creating the table, run this script again to seed users.');
    return;
  } else {
    console.log('✅ Table auth_users exists!');
  }

  // Step 2: Seed default users
  console.log('');
  console.log('👤 Step 2: Seeding default users...');

  const users = [
    { user_id: 'ADMIN01', password: 'admin123', role: 'admin', full_name: 'System Admin' },
    { user_id: 'TRAVEL01', password: 'travel123', role: 'travel_staff', full_name: 'Travel Desk' },
    { user_id: 'RKSHOP01', password: 'lottery123', role: 'lottery_staff', full_name: 'Lottery Terminal' },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    // Check if user already exists
    const { data: existing } = await supabase
      .from('auth_users')
      .select('id')
      .eq('user_id', user.user_id)
      .single();

    if (existing) {
      console.log(`  ⏭️  ${user.user_id} already exists, skipping.`);
      continue;
    }

    const { error: insertError } = await supabase.from('auth_users').insert({
      id: `cuid_${user.user_id.toLowerCase()}_${Date.now()}`,
      full_name: user.full_name,
      user_id: user.user_id,
      password: hashedPassword,
      role: user.role,
      is_active: true,
    });

    if (insertError) {
      console.error(`  ❌ Failed to insert ${user.user_id}:`, insertError.message);
    } else {
      console.log(`  ✅ ${user.user_id} (${user.role}) created with password: ${user.password}`);
    }
  }

  // Verify
  console.log('');
  console.log('📊 Step 3: Verifying...');
  const { data: allUsers, error: verifyError } = await supabase
    .from('auth_users')
    .select('user_id, full_name, role, is_active')
    .order('user_id');

  if (verifyError) {
    console.error('❌ Verify error:', verifyError.message);
  } else {
    console.table(allUsers);
    console.log('');
    console.log('🎉 Done! Default credentials:');
    console.log('   ADMIN01   / admin123   → /admin');
    console.log('   TRAVEL01  / travel123  → /travel');
    console.log('   RKSHOP01  / lottery123 → /lottery');
  }
}

main().catch(console.error);
