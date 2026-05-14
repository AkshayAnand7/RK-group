const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://mwvflrufzihmyxdcxnli.supabase.co";
const supabaseKey = "sb_publishable_PqoJxVQgXKgbd1afA3H_-w_sr7NDr03";

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing connection to Supabase...');
  
  // Try to list tables (this might fail if permissions are strict, but we can check the error)
  const { data, error } = await supabase.from('any_table_at_all').select('id').limit(1);
  
  if (error) {
    if (error.message.includes('JWT') || error.message.includes('API key')) {
      console.log('❌ Connection failed: Invalid credentials');
    } else if (error.message.includes('Could not find the table')) {
      console.log('✅ Connection SUCCESSFUL!');
      console.log('The database responded, but the table "todos" does not exist yet.');
    } else {
      console.log('❓ Connection status unclear:', error.message);
    }
  } else {
    console.log('✅ Connection SUCCESSFUL and table found!');
  }
}

testConnection();
