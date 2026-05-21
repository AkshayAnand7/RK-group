const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedData() {
  console.log('Seeding database...');
  const days = 7;
  const now = new Date();

  // Seed Collections
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Add 2-3 collections per day
    for (let j = 0; j < Math.floor(Math.random() * 2) + 2; j++) {
      const amount = Math.floor(Math.random() * 50000) + 20000;
      await supabase.from('collections').insert({
        shop_id: `SHOP-0${j+1}`,
        shop_name: `Lottery Shop ${j+1}`,
        staff_name: 'Admin',
        amount: amount,
        expense: Math.floor(amount * 0.05),
        advance: Math.floor(amount * 0.02),
        prize: Math.floor(amount * 0.1),
        pending: Math.floor(amount * 0.01),
        date: dateStr,
        created_at: d.toISOString()
      });
    }
  }
  console.log('Collections seeded.');

  // Seed Trips
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
      const amount = Math.floor(Math.random() * 15000) + 5000;
      await supabase.from('trips').insert({
        customer_name: `Customer ${j+1}`,
        customer_number: '9876543210',
        from_location: 'City A',
        to_location: 'City B',
        vehicle: ['Innova', 'Etios', 'Traveller'][Math.floor(Math.random() * 3)],
        total_amount: amount,
        received_amount: amount - (Math.floor(Math.random() * 2000)),
        date: dateStr,
        status: 'completed',
        created_at: d.toISOString()
      });
    }
  }
  console.log('Trips seeded.');

  // Seed Expenses
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    await supabase.from('expenses').insert([
      { title: 'Office Maintenance', amount: 500, module: 'lottery', date: dateStr, created_at: d.toISOString() },
      { title: 'Diesel', amount: 2000, module: 'travel', date: dateStr, created_at: d.toISOString() }
    ]);
  }
  console.log('Expenses seeded.');
  console.log('Database seeding complete!');
}

seedData().catch(console.error);
