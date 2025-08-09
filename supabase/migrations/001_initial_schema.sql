-- Create users table
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create accounts table
CREATE TABLE accounts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  balance DECIMAL(15,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create transactions table
CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  account_id BIGINT REFERENCES accounts(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  type TEXT NOT NULL, -- 'income', 'expense'
  category TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create assets table
CREATE TABLE assets (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value DECIMAL(15,2) NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create liabilities table
CREATE TABLE liabilities (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create budgets table
CREATE TABLE budgets (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  period TEXT NOT NULL, -- 'monthly', 'yearly', 'weekly'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create cycles table
CREATE TABLE cycles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_assets_user_id ON assets(user_id);
CREATE INDEX idx_liabilities_user_id ON liabilities(user_id);
CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_cycles_user_id ON cycles(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE liabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (users can only access their own data)
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view their own accounts" ON accounts FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own accounts" ON accounts FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own accounts" ON accounts FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete their own accounts" ON accounts FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own transactions" ON transactions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM accounts 
    WHERE accounts.id = transactions.account_id 
    AND auth.uid()::text = accounts.user_id::text
  )
);
CREATE POLICY "Users can insert their own transactions" ON transactions FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM accounts 
    WHERE accounts.id = transactions.account_id 
    AND auth.uid()::text = accounts.user_id::text
  )
);
CREATE POLICY "Users can update their own transactions" ON transactions FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM accounts 
    WHERE accounts.id = transactions.account_id 
    AND auth.uid()::text = accounts.user_id::text
  )
);
CREATE POLICY "Users can delete their own transactions" ON transactions FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM accounts 
    WHERE accounts.id = transactions.account_id 
    AND auth.uid()::text = accounts.user_id::text
  )
);

CREATE POLICY "Users can view their own assets" ON assets FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own assets" ON assets FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own assets" ON assets FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete their own assets" ON assets FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own liabilities" ON liabilities FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own liabilities" ON liabilities FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own liabilities" ON liabilities FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete their own liabilities" ON liabilities FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own budgets" ON budgets FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own budgets" ON budgets FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own budgets" ON budgets FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete their own budgets" ON budgets FOR DELETE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own cycles" ON cycles FOR SELECT USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can insert their own cycles" ON cycles FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);
CREATE POLICY "Users can update their own cycles" ON cycles FOR UPDATE USING (auth.uid()::text = user_id::text);
CREATE POLICY "Users can delete their own cycles" ON cycles FOR DELETE USING (auth.uid()::text = user_id::text);