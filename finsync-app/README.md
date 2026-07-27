# FinSync

Personal finance management app — track income and expenses, set monthly
budgets, and work toward savings goals.

## Stack

- **Next.js 16** (App Router, TypeScript) — full-stack, replaces the earlier
  Vite frontend + Express backend split
- **PostgreSQL + Prisma 7** — via the `@prisma/adapter-pg` driver adapter
  (Prisma 7 dropped its bundled Rust query engine)
- **Auth.js (NextAuth v5)** — Credentials provider (email + password, bcrypt),
  Prisma adapter, JWT sessions
- **Tailwind CSS v4**
- **Recharts** for charts
- **Zod** for validation

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in:
   - `DATABASE_URL` — a PostgreSQL connection string (local Postgres, or a
     free hosted instance from [Neon](https://neon.tech) or `npx create-db`)
   - `AUTH_SECRET` — generate one with:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
     ```
3. Push the schema to your database:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Project structure

- `prisma/schema.prisma` — data model (`User`, `Transaction`, `Budget`,
  `SavingsGoal`, `Notification`, plus Auth.js's `Account`/`Session`/
  `VerificationToken`)
- `src/auth.ts` — Auth.js configuration
- `src/proxy.ts` — route protection (Next 16's replacement for
  `middleware.ts`; redirects unauthenticated users away from the dashboard)
- `src/app/(auth)/` — login / signup pages
- `src/app/(dashboard)/` — dashboard, transactions, budgets, goals, analytics
- `src/app/api/` — REST route handlers backing the dashboard's data
  mutations (transactions, budgets, goals, notifications)
- `src/lib/` — Prisma client singleton, zod schemas, formatting helpers
