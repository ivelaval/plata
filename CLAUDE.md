# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack (Next.js 15)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database (Prisma)
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma migrate dev` - Create and apply new migration

## Architecture

This is a personal finance application ("Plata") built with **Clean Architecture** principles:

### Layer Structure
- **Domain** (`src/domain/`): Core business entities and repository interfaces
- **Application** (`src/application/`): Use cases and business logic
- **Infrastructure** (`src/infrastructure/`): External concerns (database, repositories)
- **Presentation** (`src/presentation/`): UI components and hooks

### Key Patterns

**Repository Pattern**: The `UserRepository` interface defines data access contracts, with implementations in infrastructure layer (`MockUserRepository`, `PrismaUserRepository`).

**Use Case Pattern**: Business logic encapsulated in use cases (e.g., `GetUserFinancialData`).

**Entity-Driven Design**: Core domain entities mirror Prisma schema but remain framework-agnostic.

### Database Schema
Uses PostgreSQL with Prisma ORM. Key entities:
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
- ESLint with Next.js and TypeScript rules