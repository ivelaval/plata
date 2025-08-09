import { supabaseAdmin } from '@/infrastructure/supabase/client';

export async function seedSupabaseData() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.');
  }

  try {
    console.log('🌱 Starting Supabase seeding...');

    // Clear existing data to avoid conflicts
    console.log('🗑️ Clearing existing data...');
    const tables = ['cycles', 'budgets', 'liabilities', 'assets', 'transactions', 'accounts', 'users'] as const;
    
    for (const table of tables) {
      const { error } = await supabaseAdmin.from(table).delete().neq('id', 0);
      if (error) {
        console.warn(`Warning clearing ${table}:`, error.message);
      }
    }

    // Insert users
    console.log('📝 Inserting users...');
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          name: 'John Doe',
          email: 'john@example.com',
          password_hash: '$2a$10$abcdefghijklmnopqrstuvwxyz',
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          password_hash: '$2a$10$abcdefghijklmnopqrstuvwxyz',
        },
      ])
      .select();

    if (usersError) throw usersError;
    console.log(`✅ Inserted ${users.length} users`);

    // Get the created user IDs
    const johnId = users[0]?.id;
    const janeId = users[1]?.id;

    if (!johnId || !janeId) {
      throw new Error('Failed to create users properly');
    }

    // Insert accounts
    console.log('💳 Inserting accounts...');
    const { data: accounts, error: accountsError } = await supabaseAdmin
      .from('accounts')
      .insert([
        {
          user_id: johnId,
          name: 'Main Wallet',
          type: 'wallet',
          balance: 20520.32,
        },
        {
          user_id: johnId,
          name: 'Savings Account',
          type: 'savings',
          balance: 15800.45,
        },
        {
          user_id: johnId,
          name: 'Investment Portfolio',
          type: 'investment',
          balance: 50120.78,
        },
        {
          user_id: janeId,
          name: 'Primary Checking',
          type: 'checking',
          balance: 5234.67,
        },
        {
          user_id: janeId,
          name: 'Emergency Fund',
          type: 'savings',
          balance: 12000.00,
        },
      ])
      .select();

    if (accountsError) throw accountsError;
    console.log(`✅ Inserted ${accounts.length} accounts`);

    // Get the created account IDs
    const johnMainWalletId = accounts.find(acc => acc.name === 'Main Wallet')?.id;
    const janeCheckingId = accounts.find(acc => acc.name === 'Primary Checking')?.id;

    if (!johnMainWalletId || !janeCheckingId) {
      throw new Error('Failed to create accounts properly');
    }

    // Insert transactions
    console.log('💸 Inserting transactions...');
    const { data: transactions, error: transactionsError } = await supabaseAdmin
      .from('transactions')
      .insert([
        {
          account_id: johnMainWalletId,
          amount: 2500.00,
          type: 'income',
          category: 'Salary',
          description: 'Monthly salary payment',
          date: '2025-01-15',
        },
        {
          account_id: johnMainWalletId,
          amount: -850.00,
          type: 'expense',
          category: 'Food & Dining',
          description: 'Grocery shopping',
          date: '2025-01-14',
        },
        {
          account_id: johnMainWalletId,
          amount: -1200.00,
          type: 'expense',
          category: 'Housing',
          description: 'Monthly rent payment',
          date: '2025-01-01',
        },
        {
          account_id: johnMainWalletId,
          amount: -75.00,
          type: 'expense',
          category: 'Transportation',
          description: 'Gas station',
          date: '2025-01-12',
        },
        {
          account_id: janeCheckingId,
          amount: 3200.00,
          type: 'income',
          category: 'Salary',
          description: 'Monthly salary',
          date: '2025-01-15',
        },
        {
          account_id: janeCheckingId,
          amount: -600.00,
          type: 'expense',
          category: 'Food & Dining',
          description: 'Restaurants and groceries',
          date: '2025-01-13',
        },
      ])
      .select();

    if (transactionsError) throw transactionsError;
    console.log(`✅ Inserted ${transactions.length} transactions`);

    // Insert assets
    console.log('🏠 Inserting assets...');
    const { data: assets, error: assetsError } = await supabaseAdmin
      .from('assets')
      .insert([
        {
          user_id: johnId,
          name: 'Real Estate Property',
          value: 250000.00,
          type: 'real_estate',
        },
        {
          user_id: johnId,
          name: 'Vehicle',
          value: 35000.00,
          type: 'vehicle',
        },
        {
          user_id: janeId,
          name: 'Car',
          value: 18000.00,
          type: 'vehicle',
        },
      ])
      .select();

    if (assetsError) throw assetsError;
    console.log(`✅ Inserted ${assets.length} assets`);

    // Insert liabilities
    console.log('📉 Inserting liabilities...');
    const { data: liabilities, error: liabilitiesError } = await supabaseAdmin
      .from('liabilities')
      .insert([
        {
          user_id: johnId,
          name: 'Home Mortgage',
          amount: 180000.00,
          type: 'mortgage',
        },
        {
          user_id: johnId,
          name: 'Credit Card Debt',
          amount: 5500.00,
          type: 'credit_card',
        },
        {
          user_id: janeId,
          name: 'Car Loan',
          amount: 12000.00,
          type: 'auto_loan',
        },
      ])
      .select();

    if (liabilitiesError) throw liabilitiesError;
    console.log(`✅ Inserted ${liabilities.length} liabilities`);

    // Insert budgets
    console.log('📊 Inserting budgets...');
    const { data: budgets, error: budgetsError } = await supabaseAdmin
      .from('budgets')
      .insert([
        {
          user_id: johnId,
          category: 'Food & Dining',
          amount: 800.00,
          period: 'monthly',
        },
        {
          user_id: johnId,
          category: 'Transportation',
          amount: 400.00,
          period: 'monthly',
        },
        {
          user_id: janeId,
          category: 'Food & Dining',
          amount: 600.00,
          period: 'monthly',
        },
      ])
      .select();

    if (budgetsError) throw budgetsError;
    console.log(`✅ Inserted ${budgets.length} budgets`);

    // Insert cycles
    console.log('🔄 Inserting cycles...');
    const { data: cycles, error: cyclesError } = await supabaseAdmin
      .from('cycles')
      .insert([
        {
          user_id: johnId,
          name: 'Monthly Budget Cycle',
          start_date: '2025-01-01',
          end_date: '2025-01-31',
          recurring: true,
        },
        {
          user_id: janeId,
          name: 'Emergency Fund Goal',
          start_date: '2025-01-01',
          end_date: '2025-06-30',
          recurring: false,
        },
      ])
      .select();

    if (cyclesError) throw cyclesError;
    console.log(`✅ Inserted ${cycles.length} cycles`);

    console.log('🎉 Supabase seeding completed successfully!');
    return {
      users,
      accounts,
      transactions,
      assets,
      liabilities,
      budgets,
      cycles,
    };

  } catch (error) {
    console.error('❌ Error seeding Supabase:', error);
    throw error;
  }
}