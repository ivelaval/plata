import { getSQLiteClient } from './client';

export async function seedSQLiteData(): Promise<void> {
  console.log('🌱 Seeding SQLite database with sample data...');
  
  try {
    const db = getSQLiteClient();
    
    // Begin transaction
    db.exec('BEGIN TRANSACTION');
    
    try {
      // Clear existing data (in reverse order due to foreign keys)
      console.log('🧹 Clearing existing data...');
      db.exec('DELETE FROM transactions');
      db.exec('DELETE FROM budgets');
      db.exec('DELETE FROM cycles');
      db.exec('DELETE FROM assets');
      db.exec('DELETE FROM liabilities');
      db.exec('DELETE FROM accounts');
      db.exec('DELETE FROM users');
      
      // Reset sequences
      db.exec('DELETE FROM sqlite_sequence');
      
      // Insert sample user
      console.log('👤 Creating sample user...');
      const insertUser = db.prepare(`
        INSERT INTO users (name, email, password_hash)
        VALUES (?, ?, ?)
      `);
      
      const userResult = insertUser.run(
        'John Doe',
        'john.doe@example.com',
        '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDlwjEN4qTkqb.Q6GPRkKdGNz.7m' // password: demo123
      );
      const userId = userResult.lastInsertRowid;
      
      // Insert sample accounts
      console.log('🏦 Creating sample accounts...');
      const insertAccount = db.prepare(`
        INSERT INTO accounts (user_id, name, type, balance)
        VALUES (?, ?, ?, ?)
      `);
      
      const checkingResult = insertAccount.run(userId, 'Main Checking', 'checking', 5420.50);
      const savingsResult = insertAccount.run(userId, 'Emergency Fund', 'savings', 12000.00);
      const investmentResult = insertAccount.run(userId, 'Investment Portfolio', 'investment', 8750.25);
      
      const checkingId = checkingResult.lastInsertRowid;
      const savingsId = savingsResult.lastInsertRowid;
      const investmentId = investmentResult.lastInsertRowid;
      
      // Insert sample transactions
      console.log('💰 Creating sample transactions...');
      const insertTransaction = db.prepare(`
        INSERT INTO transactions (account_id, amount, type, category, description, date)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      const transactions = [
        // Recent transactions
        { accountId: checkingId, amount: 3200.00, type: 'income', category: 'Salary', description: 'Monthly salary', date: '2024-08-01' },
        { accountId: checkingId, amount: 1200.00, type: 'expense', category: 'Rent', description: 'Monthly rent payment', date: '2024-08-02' },
        { accountId: checkingId, amount: 450.00, type: 'expense', category: 'Groceries', description: 'Weekly grocery shopping', date: '2024-08-03' },
        { accountId: checkingId, amount: 80.00, type: 'expense', category: 'Utilities', description: 'Electricity bill', date: '2024-08-04' },
        { accountId: checkingId, amount: 500.00, type: 'expense', category: 'Food', description: 'Restaurants', date: '2024-08-05' },
        { accountId: savingsId, amount: 1000.00, type: 'income', category: 'Transfer', description: 'Monthly savings', date: '2024-08-01' },
        { accountId: investmentId, amount: 500.00, type: 'income', category: 'Investment', description: 'Monthly investment', date: '2024-08-01' },
        
        // Previous months for cash flow data
        { accountId: checkingId, amount: 3200.00, type: 'income', category: 'Salary', description: 'Monthly salary', date: '2024-07-01' },
        { accountId: checkingId, amount: 3200.00, type: 'income', category: 'Salary', description: 'Monthly salary', date: '2024-06-01' },
        { accountId: checkingId, amount: 3200.00, type: 'income', category: 'Salary', description: 'Monthly salary', date: '2024-05-01' },
        { accountId: checkingId, amount: 1200.00, type: 'expense', category: 'Rent', description: 'Monthly rent', date: '2024-07-02' },
        { accountId: checkingId, amount: 1200.00, type: 'expense', category: 'Rent', description: 'Monthly rent', date: '2024-06-02' },
        { accountId: checkingId, amount: 1200.00, type: 'expense', category: 'Rent', description: 'Monthly rent', date: '2024-05-02' },
      ];
      
      for (const transaction of transactions) {
        insertTransaction.run(
          transaction.accountId,
          transaction.amount,
          transaction.type,
          transaction.category,
          transaction.description,
          transaction.date
        );
      }
      
      // Insert sample assets
      console.log('🏠 Creating sample assets...');
      const insertAsset = db.prepare(`
        INSERT INTO assets (user_id, name, value, type)
        VALUES (?, ?, ?, ?)
      `);
      
      insertAsset.run(userId, 'Primary Residence', 450000.00, 'Real Estate');
      insertAsset.run(userId, '2018 Honda Civic', 18000.00, 'Vehicle');
      insertAsset.run(userId, 'Jewelry & Collectibles', 5000.00, 'Personal');
      
      // Insert sample liabilities
      console.log('💳 Creating sample liabilities...');
      const insertLiability = db.prepare(`
        INSERT INTO liabilities (user_id, name, amount, type)
        VALUES (?, ?, ?, ?)
      `);
      
      insertLiability.run(userId, 'Mortgage', 320000.00, 'Mortgage');
      insertLiability.run(userId, 'Car Loan', 12000.00, 'Auto Loan');
      insertLiability.run(userId, 'Credit Card', 2500.00, 'Credit Card');
      
      // Insert sample budgets
      console.log('📊 Creating sample budgets...');
      const insertBudget = db.prepare(`
        INSERT INTO budgets (user_id, category, amount, period)
        VALUES (?, ?, ?, ?)
      `);
      
      insertBudget.run(userId, 'Groceries', 600.00, 'monthly');
      insertBudget.run(userId, 'Food', 400.00, 'monthly');
      insertBudget.run(userId, 'Transportation', 300.00, 'monthly');
      insertBudget.run(userId, 'Entertainment', 200.00, 'monthly');
      insertBudget.run(userId, 'Utilities', 150.00, 'monthly');
      
      // Insert sample cycles
      console.log('🔄 Creating sample cycles...');
      const insertCycle = db.prepare(`
        INSERT INTO cycles (user_id, name, start_date, end_date, recurring)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      insertCycle.run(userId, 'Q3 2024', '2024-07-01', '2024-09-30', 0);
      insertCycle.run(userId, 'Monthly Budget Cycle', '2024-08-01', '2024-08-31', 1);
      
      // Commit transaction
      db.exec('COMMIT');
      
      console.log('✅ Sample data inserted successfully!');
      console.log('📈 Data summary:');
      console.log('   - 1 user created');
      console.log('   - 3 accounts created');
      console.log(`   - ${transactions.length} transactions created`);
      console.log('   - 3 assets created');
      console.log('   - 3 liabilities created');
      console.log('   - 5 budgets created');
      console.log('   - 2 cycles created');
      
    } catch (error) {
      // Rollback on error
      db.exec('ROLLBACK');
      throw error;
    }
    
  } catch (error) {
    console.error('❌ Error seeding SQLite database:', error);
    throw error;
  }
}