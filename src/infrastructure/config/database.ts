export type DatabaseProvider = 'mock' | 'prisma' | 'supabase' | 'sqlite';

export interface DatabaseConfig {
  provider: DatabaseProvider;
  // SQLite specific config
  sqlitePath?: string;
  // Supabase specific config
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceRoleKey?: string;
  // Prisma specific config (uses DATABASE_URL from env)
}

export function getDatabaseConfig(): DatabaseConfig {
  // Priority order: explicit DB_PROVIDER > auto-detection > default
  const provider = getProviderFromEnv();
  
  return {
    provider,
    sqlitePath: process.env.SQLITE_DB_PATH,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

function getProviderFromEnv(): DatabaseProvider {
  const explicitProvider = process.env.DB_PROVIDER as DatabaseProvider;
  
  // If explicitly set, validate and return
  if (explicitProvider) {
    const validProviders: DatabaseProvider[] = ['mock', 'prisma', 'supabase', 'sqlite'];
    if (validProviders.includes(explicitProvider)) {
      return explicitProvider;
    }
    console.warn(`Invalid DB_PROVIDER: ${explicitProvider}. Using auto-detection.`);
  }
  
  // Auto-detection based on available environment variables
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return 'supabase';
  }
  
  if (process.env.DATABASE_URL) {
    return 'prisma';
  }
  
  // Check if we're in a browser environment - use mock instead of SQLite
  if (typeof window !== 'undefined') {
    return 'mock';
  }
  
  // Default to SQLite for local development (server-side only)
  if (process.env.NODE_ENV === 'development') {
    return 'sqlite';
  }
  
  // Fallback to mock for testing or when no other provider is configured
  return 'mock';
}

export function isDatabaseConfigured(config: DatabaseConfig): boolean {
  switch (config.provider) {
    case 'mock':
      return true; // Mock always works
    
    case 'sqlite':
      return true; // SQLite doesn't need external config
    
    case 'supabase':
      return !!(config.supabaseUrl && config.supabaseAnonKey);
    
    case 'prisma':
      return !!process.env.DATABASE_URL;
    
    default:
      return false;
  }
}