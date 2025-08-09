import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Prisma database...');

  // Clear existing data (in reverse order due to foreign keys)
  console.log('🧹 Clearing existing data...');
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.cycle.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.liability.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create sample user
  console.log('👤 Creating sample user...');
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      passwordHash: '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDlwjEN4qTkqb.Q6GPRkKdGNz.7m', // password: demo123
    },
  });

  // Create sample accounts
  console.log('🏦 Creating sample accounts...');
  const checkingAccount = await prisma.account.create({
    data: {
      userId: user.id,
      name: 'Main Checking',
      type: 'checking',
      balance: 5420.50,
    },
  });

  const savingsAccount = await prisma.account.create({
    data: {
      userId: user.id,
      name: 'Emergency Fund',
      type: 'savings',
      balance: 12000.00,
    },
  });

  const investmentAccount = await prisma.account.create({
    data: {
      userId: user.id,
      name: 'Investment Portfolio',
      type: 'investment',
      balance: 8750.25,
    },
  });

  // Create sample transactions
  console.log('💰 Creating sample transactions...');
  const transactions = [
    // Recent transactions
    { accountId: checkingAccount.id, amount: 3200.00, type: 'income', category: 'Salary', description: 'Monthly salary', date: new Date('2024-08-01') },
    { accountId: checkingAccount.id, amount: 1200.00, type: 'expense', category: 'Rent', description: 'Monthly rent payment', date: new Date('2024-08-02') },
    { accountId: checkingAccount.id, amount: 450.00, type: 'expense', category: 'Groceries', description: 'Weekly grocery shopping', date: new Date('2024-08-03') },
    { accountId: checkingAccount.id, amount: 80.00, type: 'expense', category: 'Utilities', description: 'Electricity bill', date: new Date('2024-08-04') },
    { accountId: checkingAccount.id, amount: 500.00, type: 'expense', category: 'Food', description: 'Restaurants', date: new Date('2024-08-05') },
    { accountId: savingsAccount.id, amount: 1000.00, type: 'income', category: 'Transfer', description: 'Monthly savings', date: new Date('2024-08-01') },
    { accountId: investmentAccount.id, amount: 500.00, type: 'income', category: 'Investment', description: 'Monthly investment', date: new Date('2024-08-01') },
    
    // Previous months for cash flow data
    { accountId: checkingAccount.id, amount: 3200.00, type: 'income', category: 'Salary', description: 'Monthly salary', date: new Date('2024-07-01') },
    { accountId: checkingAccount.id, amount: 3200.00, type: 'income', category: 'Salary', description: 'Monthly salary', date: new Date('2024-06-01') },
    { accountId: checkingAccount.id, amount: 3200.00, type: 'income', category: 'Salary', description: 'Monthly salary', date: new Date('2024-05-01') },
    { accountId: checkingAccount.id, amount: 1200.00, type: 'expense', category: 'Rent', description: 'Monthly rent', date: new Date('2024-07-02') },
    { accountId: checkingAccount.id, amount: 1200.00, type: 'expense', category: 'Rent', description: 'Monthly rent', date: new Date('2024-06-02') },
    { accountId: checkingAccount.id, amount: 1200.00, type: 'expense', category: 'Rent', description: 'Monthly rent', date: new Date('2024-05-02') },
  ];

  await prisma.transaction.createMany({
    data: transactions,
  });

  // Create sample assets
  console.log('🏠 Creating sample assets...');
  await prisma.asset.createMany({
    data: [
      { userId: user.id, name: 'Primary Residence', value: 450000.00, type: 'Real Estate' },
      { userId: user.id, name: '2018 Honda Civic', value: 18000.00, type: 'Vehicle' },
      { userId: user.id, name: 'Jewelry & Collectibles', value: 5000.00, type: 'Personal' },
    ],
  });

  // Create sample liabilities
  console.log('💳 Creating sample liabilities...');
  await prisma.liability.createMany({
    data: [
      { userId: user.id, name: 'Mortgage', amount: 320000.00, type: 'Mortgage' },
      { userId: user.id, name: 'Car Loan', amount: 12000.00, type: 'Auto Loan' },
      { userId: user.id, name: 'Credit Card', amount: 2500.00, type: 'Credit Card' },
    ],
  });

  // Create sample budgets
  console.log('📊 Creating sample budgets...');
  await prisma.budget.createMany({
    data: [
      { userId: user.id, category: 'Groceries', amount: 600.00, period: 'monthly' },
      { userId: user.id, category: 'Food', amount: 400.00, period: 'monthly' },
      { userId: user.id, category: 'Transportation', amount: 300.00, period: 'monthly' },
      { userId: user.id, category: 'Entertainment', amount: 200.00, period: 'monthly' },
      { userId: user.id, category: 'Utilities', amount: 150.00, period: 'monthly' },
    ],
  });

  // Create sample cycles
  console.log('🔄 Creating sample cycles...');
  await prisma.cycle.createMany({
    data: [
      { userId: user.id, name: 'Q3 2024', startDate: new Date('2024-07-01'), endDate: new Date('2024-09-30'), recurring: false },
      { userId: user.id, name: 'Monthly Budget Cycle', startDate: new Date('2024-08-01'), endDate: new Date('2024-08-31'), recurring: true },
    ],
  });

  console.log('✅ Prisma seeding complete!');
  console.log('📈 Data summary:');
  console.log('   - 1 user created');
  console.log('   - 3 accounts created');
  console.log(`   - ${transactions.length} transactions created`);
  console.log('   - 3 assets created');
  console.log('   - 3 liabilities created');
  console.log('   - 5 budgets created');
  console.log('   - 2 cycles created');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });