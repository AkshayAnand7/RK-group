// Create staff and agents tables via Supabase SQL API
const SUPABASE_URL = 'https://mwvflrufzihmyxdcxnli.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dmZscnVmemlobXl4ZGN4bmxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc0Nzk0OSwiZXhwIjoyMDk0MzIzOTQ5fQ.F1l_hvPNdfNMdPehFYIxW8K8M_S6o08djUovA9XuyIQ';

async function createTablesViaSQL() {
  const queries = [
    // Create staff table
    `CREATE TABLE IF NOT EXISTS public.staff (
      id SERIAL PRIMARY KEY,
      staff_id TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      department TEXT DEFAULT 'general',
      status TEXT DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );`,
    // Create agents table
    `CREATE TABLE IF NOT EXISTS public.agents (
      id SERIAL PRIMARY KEY,
      agent_id TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      commission_rate NUMERIC DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );`,
    // Enable RLS but allow service role
    `ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;`,
    // Create policies for service role access
    `CREATE POLICY IF NOT EXISTS "Allow service role full access to staff" ON public.staff FOR ALL USING (true) WITH CHECK (true);`,
    `CREATE POLICY IF NOT EXISTS "Allow service role full access to agents" ON public.agents FOR ALL USING (true) WITH CHECK (true);`,
    // Grant access to anon and authenticated roles
    `GRANT ALL ON public.staff TO anon, authenticated, service_role;`,
    `GRANT ALL ON public.agents TO anon, authenticated, service_role;`,
    `GRANT USAGE, SELECT ON SEQUENCE public.staff_id_seq TO anon, authenticated, service_role;`,
    `GRANT USAGE, SELECT ON SEQUENCE public.agents_id_seq TO anon, authenticated, service_role;`,
  ];

  for (const sql of queries) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ query: sql })
      });
      
      if (!response.ok) {
        // Try the pg endpoint directly
      }
    } catch (e) {
      // Silent
    }
  }

  // Use the direct approach via Supabase query API  
  // Actually, the best approach is to run raw SQL via the management API
  const pgUrl = `${SUPABASE_URL}/pg`;
  
  const fullSQL = `
    CREATE TABLE IF NOT EXISTS public.staff (
      id SERIAL PRIMARY KEY,
      staff_id TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      department TEXT DEFAULT 'general',
      status TEXT DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS public.agents (
      id SERIAL PRIMARY KEY,
      agent_id TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT,
      company TEXT,
      commission_rate NUMERIC DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
    
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'staff' AND policyname = 'staff_full_access') THEN
        CREATE POLICY staff_full_access ON public.staff FOR ALL USING (true) WITH CHECK (true);
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'agents' AND policyname = 'agents_full_access') THEN
        CREATE POLICY agents_full_access ON public.agents FOR ALL USING (true) WITH CHECK (true);
      END IF;
    END $$;

    GRANT ALL ON public.staff TO anon, authenticated, service_role;
    GRANT ALL ON public.agents TO anon, authenticated, service_role;
    GRANT USAGE, SELECT ON SEQUENCE public.staff_id_seq TO anon, authenticated, service_role;
    GRANT USAGE, SELECT ON SEQUENCE public.agents_id_seq TO anon, authenticated, service_role;
  `;

  // Use the Supabase SQL API endpoint
  const sqlResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({ query: fullSQL })
  });

  console.log('SQL API response:', sqlResponse.status, await sqlResponse.text().catch(() => ''));
}

createTablesViaSQL().then(() => console.log('Done'));
