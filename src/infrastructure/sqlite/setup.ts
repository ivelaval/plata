import { getSQLiteClient } from './client';
import fs from 'fs';
import path from 'path';

export async function setupSQLiteDatabase(): Promise<void> {
  console.log('🔧 Setting up SQLite database...');
  
  try {
    const db = getSQLiteClient();
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('📁 Created data directory');
    }
    
    // Read and execute schema
    const schemaPath = path.join(process.cwd(), 'src', 'infrastructure', 'sqlite', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split schema by semicolons and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      try {
        db.exec(statement.trim());
      } catch (error) {
        console.error(`Error executing statement: ${statement.substring(0, 50)}...`);
        console.error(error);
        throw error;
      }
    }
    
    console.log('✅ Database schema created successfully');
    console.log('📊 Tables created: users, accounts, transactions, assets, liabilities, budgets, cycles');
    
    // Verify tables were created
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log('📋 Available tables:', tables.map((t: any) => t.name).join(', '));
    
  } catch (error) {
    console.error('❌ Error setting up SQLite database:', error);
    throw error;
  }
}