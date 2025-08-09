import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

export function getSQLiteClient(): Database.Database {
  if (!db) {
    const dbPath = process.env.SQLITE_DB_PATH || path.join(process.cwd(), 'data', 'plata.db');
    
    // Ensure directory exists before creating database
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    db = new Database(dbPath);
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    console.log(`SQLite database connected at: ${dbPath}`);
  }
  
  return db;
}

export function closeSQLiteClient(): void {
  if (db) {
    db.close();
    db = null;
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  closeSQLiteClient();
  process.exit(0);
});

process.on('SIGTERM', () => {
  closeSQLiteClient();
  process.exit(0);
});