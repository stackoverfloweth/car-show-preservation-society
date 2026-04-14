# @csps/db

Drizzle ORM schemas, migrations, and the shared PostgreSQL client for the Car Show Preservation Society monorepo.

## Getting Started

### Prerequisites

- Docker (Desktop or Engine) for the local PostgreSQL instance
- Node.js 20+
- pnpm 9+

### 1. Start PostgreSQL

From the repo root:

```bash
docker compose up -d
```

This boots PostgreSQL 16 on `localhost:5432` with credentials matching `.env.example`.

### 2. Configure environment

Copy `.env.example` to `.env` inside `packages/db/` (and wherever else you need it) and confirm `DATABASE_URL` points at the local instance:

```
DATABASE_URL=postgresql://csps_dev:dev_password@localhost:5432/csps_development
```

### 3. Push the schema

```bash
pnpm db:push
```

With an empty schema this is effectively a no-op, but it confirms the client can connect.

### 4. Open Drizzle Studio

```bash
pnpm db:studio
```

## Common Commands

| Command | Description |
|---------|-------------|
| `pnpm db:generate` | Generate a SQL migration from the current schema |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:push` | Push schema directly to the DB (dev only) |
| `pnpm db:studio` | Launch Drizzle Studio |
| `pnpm db:seed` | Run the seed script |

All of the above are hoisted to the repo root as `pnpm db:*`.

## Migrations Workflow

1. Add or modify a table file in `src/schema/`.
2. Re-export it from `src/schema/index.ts` (alphabetical order).
3. Run `pnpm db:generate` to create a migration in `./drizzle/`.
4. Review the SQL. Commit both the schema change and the migration file.
5. Run `pnpm db:migrate` to apply it locally, or rely on the deploy pipeline for production.

During rapid iteration you can use `pnpm db:push` to skip migration generation entirely — never do this against a shared environment.

## Troubleshooting

- **`ECONNREFUSED 127.0.0.1:5432`** — PostgreSQL isn't running. Start it with `docker compose up -d` from the repo root.
- **`DATABASE_URL is not set`** — the db client throws on import when the env var is missing. Ensure `.env` is loaded (dotenv, shell, or your process manager).
- **`relation "…" does not exist`** — you forgot to run `pnpm db:push` or `pnpm db:migrate` after adding a schema file.
- **Port 5432 already in use** — stop any host-installed PostgreSQL (`brew services stop postgresql`) or change the port mapping in `docker-compose.yml`.
- **Studio won't open** — Drizzle Studio requires a successful connection; fix the connection error it prints first.

Stop the database with `docker compose down` (data persists in the `postgres_data` volume) or `docker compose down -v` to wipe it.
