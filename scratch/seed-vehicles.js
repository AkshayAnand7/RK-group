const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://mwvflrufzihmyxdcxnli.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13dmZscnVmemlobXl4ZGN4bmxpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODc0Nzk0OSwiZXhwIjoyMDk0MzIzOTQ5fQ.F1l_hvPNdfNMdPehFYIxW8K8M_S6o08djUovA9XuyIQ'
);

const vehicles = [
  { vehicle_number: 'FORTUNER-01', model: 'Fortuner' },
  { vehicle_number: 'SWIFT-01', model: 'Swift' },
  { vehicle_number: 'ALTO-01', model: 'Alto' },
  { vehicle_number: 'GLANZA-01', model: 'Glanza' },
  { vehicle_number: 'WINGER-01', model: 'Tata Winger' },
];

async function seedVehicles() {
  console.log('Inserting vehicles into database...\n');

  // First check existing vehicles
  const { data: existing } = await supabase.from('vehicles').select('vehicle_number');
  console.log('Existing vehicles:', existing?.map(v => v.vehicle_number) || 'none');
  console.log('');

  for (const vehicle of vehicles) {
    const { data, error } = await supabase
      .from('vehicles')
      .upsert(vehicle, { onConflict: 'vehicle_number' })
      .select();

    if (error) {
      console.error(`❌ Failed to insert ${vehicle.model}:`, error.message);
    } else {
      console.log(`✅ ${vehicle.model} (${vehicle.vehicle_number}) - inserted successfully`);
    }
  }

  // Verify
  console.log('\n--- Final Vehicles List ---');
  const { data: allVehicles } = await supabase
    .from('vehicles')
    .select('*')
    .order('vehicle_number', { ascending: true });

  console.table(allVehicles);
}

seedVehicles();
