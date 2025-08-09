# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack (Next.js 15)
- `npm run build` - Build for production (with clean output, no deprecation warnings)
- `npm run build:original` - Original build command (may show deprecation warnings)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database (Prisma) - Multi-Provider Support
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma migrate dev` - Create and apply new migration
- `npm run prisma:seed` - Seed database with sample data

#### Prisma with SQLite (Local Development)
- `npm run prisma:sqlite generate` - Generate client for SQLite
- `npm run prisma:sqlite db push` - Push schema to SQLite database
- `npm run prisma:sqlite studio` - Open Studio for SQLite database

#### Prisma with PostgreSQL/Supabase
- `npm run prisma:postgres generate` - Generate client for PostgreSQL
- `npm run prisma:postgres db push` - Push schema to PostgreSQL database
- `npm run prisma:postgres studio` - Open Studio for PostgreSQL database

### Database (Supabase)
- `npm run setup-supabase` - Setup Supabase schema and seed data
- `npm run seed-supabase` - Only seed data (requires existing schema)
- Visit `/setup-supabase` route for interactive setup and management
- Visit `/test-supabase` route to test Supabase integration (server-side, dynamic)
- Visit `/test-supabase-client` route for client-side testing (avoids build-time execution)

### Database (SQLite - Local Development)
- `npm run setup-sqlite` - Setup SQLite database schema (creates data/plata.db)
- `npm run seed-sqlite` - Seed SQLite database with sample data
- Uses `better-sqlite3` for local development without external dependencies
- Database file stored in `data/plata.db` (configurable via `SQLITE_DB_PATH` env var)

## Architecture

This is a personal finance application ("Plata") built with **Clean Architecture** principles:

### Layer Structure
- **Domain** (`src/domain/`): Core business entities and repository interfaces
- **Application** (`src/application/`): Use cases and business logic
- **Infrastructure** (`src/infrastructure/`): External concerns (database, repositories)
- **Presentation** (`src/presentation/`): UI components and hooks

### Key Patterns

**Repository Pattern**: The `UserRepository` interface defines data access contracts, with implementations in infrastructure layer (`MockUserRepository`, `PrismaUserRepository`, `SupabaseUserRepository`, `SQLiteUserRepository`).

**Use Case Pattern**: Business logic encapsulated in use cases (e.g., `GetUserFinancialData`).

**Entity-Driven Design**: Core domain entities mirror Prisma schema but remain framework-agnostic.

### Database Schema
Uses PostgreSQL with Prisma ORM and Supabase. Key entities:
- **User**: Core user with financial relationships
- **Account**: Financial accounts (wallet, savings, investment)  
- **Transaction**: Financial transactions with categorization
- **Asset/Liability**: Net worth components
- **Budget**: Spending limits by category
- **Cycle**: Time-based financial periods

### Frontend Architecture
- **Next.js 15** with App Router
- **TypeScript** with strict configuration
- **Tailwind CSS v4** for styling
- **React 19** with concurrent features
- **Client-side rendering** for financial charts (NoSSR/ClientOnlyWrapper patterns)

### Component Organization
- `components/dashboard/`: Dashboard-specific UI components
- `components/landing/`: Landing page components
- Financial data visualization with `lightweight-charts` library

### Development Notes
- Uses `@/*` path alias for src imports
- Development uses Turbopack for faster builds
- Mock data repository for development/testing
- Supabase integration with ports/adapters pattern
- ESLint with Next.js and TypeScript rules

### Database Adapter Configuration

The application automatically selects the appropriate database adapter based on configuration:

#### Repository Factory
- **Factory**: `src/infrastructure/repositories/RepositoryFactory.ts`
- **Configuration**: `src/infrastructure/config/database.ts`
- **Available Adapters**: Mock, SQLite, Supabase, Prisma
- **Usage**: `getUserRepository()` returns the configured adapter

#### Environment Variables (Database Selection)
```bash
# Explicit provider selection (optional)
DB_PROVIDER=sqlite|supabase|prisma|mock

# SQLite (default for development)
SQLITE_DB_PATH=./data/plata.db  # optional, defaults to ./data/plata.db

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Prisma
DATABASE_URL=your-database-connection-string
```

#### Auto-Selection Priority
1. **Explicit**: `DB_PROVIDER` environment variable
2. **Supabase**: If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
3. **Prisma**: If `DATABASE_URL` is set
4. **SQLite**: Default for development (`NODE_ENV=development`)
5. **Mock**: Fallback for testing/unconfigured environments

### Supabase Integration
- **Client Configuration**: `src/infrastructure/supabase/client.ts` and `server.ts`
- **Type Definitions**: `src/infrastructure/supabase/types.ts` (generated from schema)
- **Repository Implementation**: `src/infrastructure/repositories/SupabaseUserRepository.ts`
- **Migrations**: `supabase/migrations/001_initial_schema.sql`
- **Seeding**: `src/infrastructure/supabase/seed.ts` and `supabase/seed.sql`
- **API Routes**: `/api/setup-supabase` for programmatic database management

### SQLite Integration
- **Client Configuration**: `src/infrastructure/sqlite/client.ts`
- **Schema**: `src/infrastructure/sqlite/schema.sql`
- **Repository Implementation**: `src/infrastructure/repositories/SQLiteUserRepository.ts`
- **Setup**: `src/infrastructure/sqlite/setup.ts`
- **Seeding**: `src/infrastructure/sqlite/seed.ts`

### API Usage Examples
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