# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack (Next.js 15)
- `npm run build` - Build for production (with clean output, no deprecation warnings)
- `npm run build:original` - Original build command (may show deprecation warnings)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database (Prisma)
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma migrate dev` - Create and apply new migration

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

### Supabase Integration
- **Client Configuration**: `src/infrastructure/supabase/client.ts` and `server.ts`
- **Type Definitions**: `src/infrastructure/supabase/types.ts` (generated from schema)
- **Repository Implementation**: `src/infrastructure/repositories/SupabaseUserRepository.ts`
- **Migrations**: `supabase/migrations/001_initial_schema.sql`
- **Seeding**: `src/infrastructure/supabase/seed.ts` and `supabase/seed.sql`
- **API Routes**: `/api/setup-supabase` for programmatic database management
- **Environment Variables**: Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`

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