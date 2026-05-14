const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://mwvflrufzihmyxdcxnli.supabase.co";
const supabaseKey = "sb_publishable_PqoJxVQgXKgbd1afA3H_-w_sr7NDr03";

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTables() {
  console.log('Verifying new tables...');
  
  const tables = ['profiles', 'shops', 'collections', 'vehicles', 'trips', 'expenses'];
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
    if (error) {
      console.log(`❌ Table "${table}": ${error.message}`);
    } else {
      console.log(`✅ Table "${table}": Found and connected!`);
    }
  }
}

verifyTables();
