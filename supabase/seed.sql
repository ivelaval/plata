-- Seed data for the finance application

-- Clear existing data
DELETE FROM cycles;
DELETE FROM budgets;
DELETE FROM liabilities;
DELETE FROM assets;
DELETE FROM transactions;
DELETE FROM accounts;
DELETE FROM users;

-- Reset sequences
SELECT setval('users_id_seq', 1, false);
SELECT setval('accounts_id_seq', 1, false);
SELECT setval('transactions_id_seq', 1, false);
SELECT setval('assets_id_seq', 1, false);
SELECT setval('liabilities_id_seq', 1, false);
SELECT setval('budgets_id_seq', 1, false);
SELECT setval('cycles_id_seq', 1, false);

-- Insert sample users (IDs will auto-generate)
INSERT INTO users (name, email, password_hash, created_at) VALUES
('John Doe', 'john@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz', NOW()),
('Jane Smith', 'jane@example.com', '$2a$10$abcdefghijklmnopqrstuvwxyz', NOW());

-- Get user IDs for referencing
DO $$
DECLARE
    john_id INTEGER;
    jane_id INTEGER;
    john_wallet_id INTEGER;
    jane_checking_id INTEGER;
BEGIN
    -- Get user IDs
    SELECT id INTO john_id FROM users WHERE email = 'john@example.com';
    SELECT id INTO jane_id FROM users WHERE email = 'jane@example.com';
    
    -- Insert accounts
    INSERT INTO accounts (user_id, name, type, balance, created_at) VALUES
    (john_id, 'Main Wallet', 'wallet', 20520.32, NOW()),
    (john_id, 'Savings Account', 'savings', 15800.45, NOW()),
    (john_id, 'Investment Portfolio', 'investment', 50120.78, NOW()),
    (jane_id, 'Primary Checking', 'checking', 5234.67, NOW()),
    (jane_id, 'Emergency Fund', 'savings', 12000.00, NOW());
    
    -- Get account IDs
    SELECT id INTO john_wallet_id FROM accounts WHERE user_id = john_id AND name = 'Main Wallet';
    SELECT id INTO jane_checking_id FROM accounts WHERE user_id = jane_id AND name = 'Primary Checking';
    
    -- Insert transactions
    INSERT INTO transactions (account_id, amount, type, category, description, date, created_at) VALUES
    -- John's transactions
    (john_wallet_id, 2500.00, 'income', 'Salary', 'Monthly salary payment', '2025-01-15', NOW()),
    (john_wallet_id, -850.00, 'expense', 'Food & Dining', 'Grocery shopping', '2025-01-14', NOW()),
    (john_wallet_id, -1200.00, 'expense', 'Housing', 'Monthly rent payment', '2025-01-01', NOW()),
    (john_wallet_id, -75.00, 'expense', 'Transportation', 'Gas station', '2025-01-12', NOW()),
    -- Jane's transactions
    (jane_checking_id, 3200.00, 'income', 'Salary', 'Monthly salary', '2025-01-15', NOW()),
    (jane_checking_id, -600.00, 'expense', 'Food & Dining', 'Restaurants and groceries', '2025-01-13', NOW());
    
    -- Insert assets
    INSERT INTO assets (user_id, name, value, type, created_at) VALUES
    (john_id, 'Real Estate Property', 250000.00, 'real_estate', NOW()),
    (john_id, 'Vehicle', 35000.00, 'vehicle', NOW()),
    (jane_id, 'Car', 18000.00, 'vehicle', NOW());
    
    -- Insert liabilities
    INSERT INTO liabilities (user_id, name, amount, type, created_at) VALUES
    (john_id, 'Home Mortgage', 180000.00, 'mortgage', NOW()),
    (john_id, 'Credit Card Debt', 5500.00, 'credit_card', NOW()),
    (jane_id, 'Car Loan', 12000.00, 'auto_loan', NOW());
    
    -- Insert budgets
    INSERT INTO budgets (user_id, category, amount, period, created_at) VALUES
    (john_id, 'Food & Dining', 800.00, 'monthly', NOW()),
    (john_id, 'Transportation', 400.00, 'monthly', NOW()),
    (jane_id, 'Food & Dining', 600.00, 'monthly', NOW());
    
    -- Insert cycles
    INSERT INTO cycles (user_id, name, start_date, end_date, recurring, created_at) VALUES
    (john_id, 'Monthly Budget Cycle', '2025-01-01', '2025-01-31', true, NOW()),
    (jane_id, 'Emergency Fund Goal', '2025-01-01', '2025-06-30', false, NOW());
    
END $$;