import { UserRepository } from "@/domain/repositories/UserRepository";
import { DatabaseConfig, getDatabaseConfig, isDatabaseConfigured } from "@/infrastructure/config/database";
import { MockUserRepository } from "@/infrastructure/repositories/MockUserRepository";
import { SupabaseUserRepository } from "@/infrastructure/repositories/SupabaseUserRepository";

let cachedUserRepository: UserRepository | null = null;

export async function createUserRepository(config?: DatabaseConfig): Promise<UserRepository> {
  // Use provided config or get from environment
  const dbConfig = config || getDatabaseConfig();
  
  // Return cached instance if available and config hasn't changed
  if (cachedUserRepository) {
    return cachedUserRepository;
  }
  
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Validate configuration
  if (!isDatabaseConfigured(dbConfig)) {
    console.warn(`Database provider '${dbConfig.provider}' is not properly configured. Falling back to mock.`);
    cachedUserRepository = new MockUserRepository();
    return cachedUserRepository;
  }
  
  // Create repository based on provider
  switch (dbConfig.provider) {
    case 'sqlite':
      if (isBrowser) {
        console.warn('SQLite is not available in browser environment. Using mock repository.');
        cachedUserRepository = new MockUserRepository();
      } else {
        console.log('🗄️ Using SQLite repository for local development');
        const { SQLiteUserRepository } = await import('./SQLiteUserRepository');
        cachedUserRepository = new SQLiteUserRepository();
      }
      break;
      
    case 'supabase':
      console.log('☁️ Using Supabase repository');
      cachedUserRepository = new SupabaseUserRepository();
      break;
      
    case 'prisma':
      if (isBrowser) {
        console.warn('Prisma is not available in browser environment. Using mock repository.');
        cachedUserRepository = new MockUserRepository();
      } else {
        console.log('🔷 Using Prisma repository');
        const { PrismaUserRepository } = await import('./PrismaUserRepository');
        cachedUserRepository = new PrismaUserRepository();
      }
      break;
      
    case 'mock':
      console.log('🧪 Using Mock repository (for testing/development)');
      cachedUserRepository = new MockUserRepository();
      break;
      
    default:
      console.warn(`Unknown database provider: ${dbConfig.provider}. Using mock repository.`);
      cachedUserRepository = new MockUserRepository();
  }
  
  return cachedUserRepository;
}

export async function getUserRepository(): Promise<UserRepository> {
  return createUserRepository();
}

export function resetRepositoryCache(): void {
  cachedUserRepository = null;
}

// Convenience functions for specific providers
export function createMockRepository(): UserRepository {
  return new MockUserRepository();
}

export async function createSQLiteRepository(): Promise<UserRepository> {
  if (typeof window !== 'undefined') {
    console.warn('SQLite is not available in browser environment. Using mock repository.');
    return new MockUserRepository();
  }
  const { SQLiteUserRepository } = await import('./SQLiteUserRepository');
  return new SQLiteUserRepository();
}

export function createSupabaseRepository(): UserRepository {
  return new SupabaseUserRepository();
}

export async function createPrismaRepository(): Promise<UserRepository> {
  if (typeof window !== 'undefined') {
    console.warn('Prisma is not available in browser environment. Using mock repository.');
    return new MockUserRepository();
  }
  const { PrismaUserRepository } = await import('./PrismaUserRepository');
  return new PrismaUserRepository();
}