# Database Setup Guide

This project supports multiple database providers with automatic adapter selection. You can use Mock data, SQLite, Supabase, or Prisma with PostgreSQL/SQLite.

## Quick Start

The application automatically detects and selects the appropriate database adapter based on your environment configuration.

### Priority Order (Auto-Detection)
1. **Explicit**: `DB_PROVIDER` environment variable
2. **Supabase**: If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
3. **Prisma**: If `DATABASE_URL` is set
4. **SQLite**: Default for development (`NODE_ENV=development`)
5. **Mock**: Fallback for testing/unconfigured environments

## Environment Variables

### Explicit Provider Selection (Optional)
```bash
DB_PROVIDER=sqlite|supabase|prisma|mock
```

### SQLite Configuration
```bash
# SQLite (default for development)
SQLITE_DB_PATH=./data/plata.db  # optional, defaults to ./data/plata.db
```

### Supabase Configuration
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Prisma Configuration
```bash
# For SQLite (local development)
DATABASE_PROVIDER=sqlite
DATABASE_URL="file:./data/prisma.db"

# For PostgreSQL/Supabase (production)
DATABASE_PROVIDER=postgresql
DATABASE_URL="postgresql://user:password@host:port/database"
```

## Database Provider Setup

### 1. SQLite (Local Development)

**Setup:**
```bash
npm run setup-sqlite    # Create schema
npm run seed-sqlite     # Add sample data
```

**Usage:**
```bash
npm run dev  # Automatically uses SQLite in development
```

### 2. Supabase (Cloud Database)

**Setup:**
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create `.env.local` with:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Commands:**
```bash
npm run setup-supabase  # Setup schema and seed data
npm run seed-supabase   # Only seed data (requires existing schema)
```

**Interactive Setup:**
- Visit `/setup-supabase` route for interactive setup and management
- Visit `/test-supabase` route to test integration (server-side, dynamic)
- Visit `/test-supabase-client` route for client-side testing

**API Usage:**
```bash
# Check connection
curl -X POST http://localhost:3000/api/setup-supabase \
  -H "Content-Type: application/json" \
  -d '{"action":"check-connection"}'

# Seed database
curl -X POST http://localhost:3000/api/setup-supabase \
  -H "Content-Type: application/json" \
  -d '{"action":"seed-data"}'

# Reset database
curl -X POST http://localhost:3000/api/setup-supabase \
  -H "Content-Type: application/json" \
  -d '{"action":"reset-data"}'
```

### 3. Prisma (Multi-Database Support)

Prisma can work with both SQLite and PostgreSQL/Supabase using the same schema.

#### Basic Prisma Commands
```bash
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema changes to database
npx prisma studio        # Open Prisma Studio for database management
npx prisma migrate dev   # Create and apply new migration
npm run prisma:seed      # Seed database with sample data
```

#### Prisma with SQLite (Local Development)
```bash
# Set environment
DATABASE_PROVIDER=sqlite
DATABASE_URL="file:./data/prisma.db"

# Commands
npm run prisma:sqlite generate  # Generate client for SQLite
npm run prisma:sqlite db push   # Push schema to SQLite database
npm run prisma:sqlite studio    # Open Studio for SQLite database
npm run prisma:seed             # Seed with sample data
```

#### Prisma with PostgreSQL/Supabase (Production)
```bash
# Set environment  
DATABASE_PROVIDER=postgresql
DATABASE_URL="your-supabase-connection-string"

# Commands
npm run prisma:postgres generate  # Generate client for PostgreSQL
npm run prisma:postgres db push   # Push schema to PostgreSQL database
npm run prisma:postgres studio    # Open Studio for PostgreSQL database
npm run prisma:seed               # Seed with sample data
```

### 4. Mock Data (Testing/Development)

**Usage:**
```bash
DB_PROVIDER=mock npm run dev
```

No setup required - provides hardcoded sample data for testing.

## Switching Between Databases

### Development Scenarios

**Local SQLite Development:**
```bash
npm run dev  # Uses SQLite by default in development
```

**Local with Supabase:**
```bash
# Set Supabase env vars in .env.local, then:
npm run dev  # Automatically detects and uses Supabase
```

**Explicit Provider Selection:**
```bash
DB_PROVIDER=sqlite npm run dev      # Force SQLite
DB_PROVIDER=supabase npm run dev    # Force Supabase
DB_PROVIDER=prisma npm run dev      # Force Prisma
DB_PROVIDER=mock npm run dev        # Force Mock data
```

**Prisma Multi-Database:**
```bash
# Development with SQLite
DB_PROVIDER=prisma DATABASE_PROVIDER=sqlite DATABASE_URL="file:./data/prisma.db" npm run dev

# Production with Supabase
DB_PROVIDER=prisma DATABASE_PROVIDER=postgresql DATABASE_URL="your-supabase-url" npm run dev
```

## Benefits by Provider

### SQLite
- ✅ No external dependencies
- ✅ Perfect for local development
- ✅ File-based database
- ✅ Fast setup

### Supabase
- ✅ Managed PostgreSQL
- ✅ Real-time subscriptions
- ✅ Built-in auth and APIs
- ✅ Cloud-hosted

### Prisma
- ✅ Type-safe database access
- ✅ Database-agnostic (SQLite + PostgreSQL)
- ✅ Migration system
- ✅ Visual database management
- ✅ Single schema for multiple providers

### Mock
- ✅ No setup required
- ✅ Perfect for testing
- ✅ Predictable data

## Architecture

The application uses the **Repository Pattern** with a factory that automatically selects the appropriate adapter:

- **Repository Interface**: `src/domain/repositories/UserRepository.ts`
- **Factory**: `src/infrastructure/repositories/RepositoryFactory.ts`  
- **Configuration**: `src/infrastructure/config/database.ts`
- **Implementations**: 
  - `MockUserRepository`
  - `SQLiteUserRepository` 
  - `SupabaseUserRepository`
  - `PrismaUserRepository`

**Usage in Code:**
```typescript
import { getUserRepository } from '@/infrastructure/repositories/RepositoryFactory';

// Automatically uses the configured adapter
const userRepository = getUserRepository();
const userData = await userRepository.getUser(BigInt(1));
```

This design allows you to switch between database providers without changing application code.