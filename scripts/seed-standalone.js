#!/usr/bin/env node

/**
 * Standalone seeding script that doesn't depend on Next.js
 * Can be run from any Node.js environment
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  console.log('🌱 Starting standalone database seeding...');

  try {
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    const tables = ['cycles', 'budgets', 'liabilities', 'assets', 'transactions', 'accounts', 'users'];
    
    for (const table of tables) {
      const { error } = await supabase.from(table).delete().neq('id', 0);
      if (error) console.warn(`Warning clearing ${table}:`, error.message);
    }

    // Insert users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .insert([
        { name: 'John Doe', email: 'john@example.com', password_hash: '$2a$10$hash1' },
        { name: 'Jane Smith', email: 'jane@example.com', password_hash: '$2a$10$hash2' },
      ])
      .select();

    if (usersError) throw usersError;
    console.log(`✅ Created ${users.length} users`);

    // Get user IDs
    const johnId = users.find(u => u.email === 'john@example.com')?.id;
    const janeId = users.find(u => u.email === 'jane@example.com')?.id;

    // Insert accounts
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .insert([
        { user_id: johnId, name: 'Main Wallet', type: 'wallet', balance: 25000 },
        { user_id: johnId, name: 'Savings', type: 'savings', balance: 15000 },
        { user_id: janeId, name: 'Checking', type: 'checking', balance: 8000 },
      ])
      .select();

    if (accountsError) throw accountsError;
    console.log(`✅ Created ${accounts.length} accounts`);

    // Insert some transactions
    const mainWalletId = accounts.find(a => a.name === 'Main Wallet')?.id;
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .insert([
        {
          account_id: mainWalletId,
          amount: 3000,
          type: 'income',
          category: 'Salary',
          description: 'Monthly salary',
          date: new Date().toISOString().split('T')[0]
        },
        {
          account_id: mainWalletId,
          amount: -500,
          type: 'expense', 
          category: 'Food',
          description: 'Groceries',
          date: new Date().toISOString().split('T')[0]
        }
      ])
      .select();

    if (transactionsError) throw transactionsError;
    console.log(`✅ Created ${transactions.length} transactions`);

    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };