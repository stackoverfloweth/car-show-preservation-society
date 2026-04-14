# Session 02 — Database & ORM Foundation

## Dependencies
Session 01

## Branch
`session/02-database-foundation`

## Goal
Configure Drizzle ORM with PostgreSQL, create the DB client, set up migration tooling, and verify the pipeline works end-to-end with an empty migration. By the end, developers can spin up a local PostgreSQL instance via Docker Compose and push schema changes using the Drizzle CLI.

## Tasks

1. **Configure Drizzle CLI**
   - Create `packages/db/drizzle.config.ts` with:
     - Schema path: `./src/schema`
     - Out path: `./drizzle`
     - Driver: `postgres` (postgres-js)
     - Database connection URL from `DATABASE_URL` environment variable
     - Strict mode enabled

2. **Create Database Client**
   - Update `packages/db/src/index.ts` to:
     - Import `drizzle` from `drizzle-orm/postgres-js`
     - Import `Client` from `postgres-js`
     - Initialize postgres client with connection string from environment
     - Create and export default Drizzle instance
     - Handle connection pooling for production readiness
     - Include JSDoc comments explaining usage
   - Example pattern:
     ```typescript
     import { drizzle } from 'drizzle-orm/postgres-js';
     import postgres from 'postgres';
     
     const client = postgres(process.env.DATABASE_URL!);
     export const db = drizzle(client);
     export default db;
     ```

3. **Set Up Seed Script**
   - Create `packages/db/src/seed.ts` with:
     - Export a `seed()` async function
     - Placeholder that logs "Seeding database..."
     - Import and use the Drizzle client
     - Error handling and process exit
   - Add script to `packages/db/package.json`:
     - `db:seed` — runs tsx src/seed.ts

4. **Configure Package.json Scripts**
   - Update `packages/db/package.json` with scripts:
     - `db:generate` — `drizzle-kit generate:pg`
     - `db:migrate` — `drizzle-kit migrate:pg`
     - `db:push` — `drizzle-kit push:pg`
     - `db:studio` — `drizzle-kit studio`
     - `db:seed` — `tsx src/seed.ts`

5. **Hoist Scripts to Root**
   - Update root `package.json` to include:
     - `pnpm run db:generate` — shortcut to packages/db:generate
     - `pnpm run db:push` — shortcut to packages/db:push
     - `pnpm run db:migrate` — shortcut to packages/db:migrate
     - `pnpm run db:studio` — shortcut to packages/db:studio
     - `pnpm run db:seed` — shortcut to packages/db:seed

6. **Create Docker Compose Setup**
   - Create `docker-compose.yml` at root with:
     - PostgreSQL 16 service named `postgres`
     - Environment variables:
       - `POSTGRES_USER=csps_dev`
       - `POSTGRES_PASSWORD=dev_password` (clearly marked as dev-only)
       - `POSTGRES_DB=csps_development`
     - Port mapping: `5432:5432`
     - Volume for data persistence: `postgres_data:/var/lib/postgresql/data`
     - Health check script
     - Services definition for easy `docker compose up -d`
   - Create `.dockerignore` to exclude node_modules and dist

7. **Environment Configuration**
   - Update `packages/db/.env.example` with:
     ```
     DATABASE_URL=postgresql://csps_dev:dev_password@localhost:5432/csps_development
     ```
   - Document expected DATABASE_URL format in comments

8. **Create Initial Schema File**
   - Create `packages/db/src/schema/index.ts` to export schemas (empty for now, placeholder comments)
   - Add comment block explaining schema organization:
     - Tables imported and re-exported
     - Relations defined separately
     - Types exported for external use

9. **Update apps/api for DB Integration**
   - Update `apps/api/package.json` to include `@csps/db` as dependency
   - Update `apps/api/tsconfig.json` to include path alias for `@csps/db`
   - Create `apps/api/src/lib/db.ts` that re-exports the db client from `@csps/db` for convenient use in API

10. **Create Development Documentation**
    - Create `packages/db/README.md` with:
      - "Getting Started" section explaining:
        - Prerequisites (Docker, Node, pnpm)
        - Starting local PostgreSQL: `docker compose up -d`
        - Checking database connection: `pnpm db:push` (will succeed with no migrations)
        - Opening Drizzle Studio: `pnpm db:studio`
      - "Common Commands" section
      - "Migrations" section explaining workflow
      - "Troubleshooting" section for common issues

11. **Verify End-to-End Setup**
    - Run `docker compose up -d` and verify PostgreSQL starts
    - Run `pnpm db:push` and verify it connects without errors
    - Run `pnpm db:studio` and verify Studio opens
    - Run `pnpm --filter api dev` and verify no import errors for db client
    - Stop PostgreSQL with `docker compose down`

## Files to Create/Modify

**Create:**
- `packages/db/drizzle.config.ts`
- `packages/db/src/index.ts` (rewrite)
- `packages/db/src/schema/index.ts` (with placeholder structure)
- `packages/db/src/seed.ts`
- `packages/db/README.md`
- `docker-compose.yml` (root)
- `.dockerignore` (root)

**Modify:**
- `packages/db/package.json` (add scripts and ensure dependencies)
- `packages/db/.env.example` (update with DATABASE_URL)
- Root `package.json` (add hoisted db scripts)
- `apps/api/package.json` (add @csps/db dependency)
- `apps/api/tsconfig.json` (add path aliases)
- `apps/api/src/lib/db.ts` (create re-export)

## Acceptance Criteria

- [x] `docker compose up -d` starts PostgreSQL successfully
- [x] `docker compose ps` shows postgres service as "Up"
- [x] `pnpm db:push` connects to the local database without errors
- [x] `pnpm db:studio` opens Drizzle Studio in the browser
- [x] `pnpm db:generate` runs without errors (even with empty schema)
- [x] `pnpm db:seed` runs and logs "Seeding database..."
- [x] `packages/db/src/index.ts` exports a Drizzle client instance
- [x] `apps/api` can import the db client from `@csps/db`
- [x] TypeScript compiles cleanly with all db types
- [x] `.env.example` files are documented
- [x] `docker compose down` cleanly stops the database
- [x] No hardcoded database URLs or credentials in source code (only in .env)
