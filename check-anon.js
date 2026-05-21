const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

async function checkAnonData() {
  const { data: collections, error: collError } = await supabase.from('collections').select('*');
  console.log('Anon Collections:', collections?.length, collError?.message || '');
}

checkAnonData();
