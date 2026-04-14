# Session 01 — Repo Cleanup & Monorepo Setup

## Dependencies
None (first session)

## Branch
`session/01-monorepo-setup`

## Goal
Remove all legacy Vue/Netlify code and set up a clean pnpm monorepo with three packages: `apps/api` (Hono), `apps/web` (React + Vite), and `packages/shared` (Zod schemas + types). Also add `packages/db` (Drizzle). Configure TypeScript project references, ESLint, Prettier, and basic scripts.

## Tasks

1. **Archive/Remove Legacy Code**
   - Delete `src/` directory (Vue components and legacy app code)
   - Delete `netlify/` directory and `netlify.toml`
   - Delete `.vercel/` if present
   - Delete `.nuxt/` and `.output/` directories
   - Delete `nuxt.config.ts`, `vue.config.js`, and other Vue/Nuxt config files
   - Remove legacy dependencies from root `package.json` (vue, nuxt, webpack, etc.)
   - Preserve `sessions/` directory and all markdown documentation files
   - Keep `.git/` and git configuration intact

2. **Initialize pnpm Workspace**
   - Remove old `node_modules/` and lock files (`package-lock.json`, `yarn.lock`)
   - Create `pnpm-workspace.yaml` at root with workspace configuration for `apps/*` and `packages/*`
   - Create new root `package.json` with:
     - Name: `csps-monorepo`
     - Private: true
     - Workspace scripts: `install`, `lint`, `format`, `type-check`
     - Common dev dependencies: TypeScript, ESLint, Prettier, @types/node

3. **Configure TypeScript**
   - Create `tsconfig.base.json` at root with:
     - Strict mode enabled
     - Target: ES2020
     - Module: ESNext
     - Lib: ES2020, DOM
     - Paths configured for `@/*` aliases pointing to packages
     - Skip lib check enabled
     - Incremental build enabled
   - Create TypeScript references for all packages

4. **Set Up apps/api/ (Hono)**
   - Create `apps/api/` directory structure
   - Create `apps/api/package.json` with:
     - Name: `@csps/api`
     - Dependencies: hono, dotenv
     - Dev dependencies: TypeScript, @types/node, tsx
     - Scripts: `dev` (tsx watch), `build` (tsc), `start`
   - Create `apps/api/tsconfig.json` extending base, with out: `dist`
   - Create `apps/api/src/index.ts` with hello world Hono app:
     ```typescript
     import { Hono } from 'hono';
     const app = new Hono();
     app.get('/', (c) => c.json({ message: 'Hello from Hono!' }));
     export default app;
     ```
   - Create `apps/api/.env.example` with `PORT=3000`

5. **Set Up apps/web/ (React + Vite)**
   - Create `apps/web/` directory structure
   - Create `apps/web/package.json` with:
     - Name: `@csps/web`
     - Dependencies: react, react-dom, vite
     - Dev dependencies: TypeScript, @types/react, @types/react-dom, @vitejs/plugin-react, vite
     - Scripts: `dev`, `build`, `preview`, `type-check`
   - Create `apps/web/tsconfig.json` extending base, with types including React
   - Create `apps/web/vite.config.ts` with React plugin
   - Create `apps/web/index.html` entry point
   - Create `apps/web/src/main.tsx` with React root render
   - Create `apps/web/src/App.tsx` placeholder component
   - Create `apps/web/.env.example` with `VITE_API_URL=http://localhost:3000`

6. **Set Up packages/db/ (Drizzle)**
   - Create `packages/db/` directory structure
   - Create `packages/db/package.json` with:
     - Name: `@csps/db`
     - Dependencies: drizzle-orm, postgres-js
     - Dev dependencies: drizzle-kit, @types/node, TypeScript
     - Scripts: `db:generate`, `db:migrate`, `db:push`, `db:studio`
   - Create `packages/db/tsconfig.json` extending base
   - Create `packages/db/src/index.ts` with empty exports
   - Create `packages/db/src/schema/index.ts` empty file for future schemas
   - Create `packages/db/.env.example` with `DATABASE_URL=postgresql://...`

7. **Set Up packages/shared/ (Types & Schemas)**
   - Create `packages/shared/` directory structure
   - Create `packages/shared/package.json` with:
     - Name: `@csps/shared`
     - Dependencies: zod
     - Dev dependencies: TypeScript
     - Scripts: `type-check`
   - Create `packages/shared/tsconfig.json` extending base
   - Create `packages/shared/src/index.ts` with empty exports (to be populated later)

8. **Configure Linting & Formatting**
   - Create `.eslintrc.cjs` at root with:
     - TypeScript parser
     - Rules for React, Node, and TypeScript
     - Ignores: node_modules, dist, build, .next, etc.
   - Create `.prettierrc` at root with:
     - Semi: true
     - Single quotes: true
     - Trailing comma: all
     - Print width: 100
     - Tab width: 2
   - Create `.prettierignore` with common patterns

9. **Set Up Git & Environment**
   - Create `.gitignore` with:
     - node_modules/
     - dist/
     - build/
     - .env (but not .env.example)
     - .DS_Store
     - .turbo/
     - coverage/
   - Create `.env.example` at root (empty or with general vars)

10. **Root-Level Scripts**
    - Update root `package.json` with scripts:
      - `pnpm install` — installs all workspaces
      - `pnpm run lint` — lint all packages
      - `pnpm run format` — format all packages
      - `pnpm run type-check` — type-check all packages
      - `pnpm --filter api dev` — dev for API
      - `pnpm --filter web dev` — dev for web
      - `pnpm --filter web build` — build web

11. **Verify Workspace Resolution**
    - Run `pnpm install` to install all dependencies
    - Confirm all workspace packages are resolved correctly
    - Verify no circular dependencies or resolution errors

## Files to Create/Modify

**Delete:**
- `src/` (entire directory)
- `netlify/` (entire directory)
- `.vercel/` (if present)
- `.nuxt/`, `.output/` (if present)
- `nuxt.config.ts`, `vue.config.js`
- Old lock files: `package-lock.json`, `yarn.lock`

**Create:**
- `pnpm-workspace.yaml`
- `package.json` (root, rewrite)
- `tsconfig.base.json`
- `.eslintrc.cjs`
- `.prettierrc`
- `.prettierignore`
- `.gitignore`
- `.env.example`
- `apps/api/package.json`
- `apps/api/tsconfig.json`
- `apps/api/src/index.ts`
- `apps/api/.env.example`
- `apps/web/package.json`
- `apps/web/tsconfig.json`
- `apps/web/vite.config.ts`
- `apps/web/index.html`
- `apps/web/src/main.tsx`
- `apps/web/src/App.tsx`
- `apps/web/.env.example`
- `packages/db/package.json`
- `packages/db/tsconfig.json`
- `packages/db/src/index.ts`
- `packages/db/src/schema/index.ts`
- `packages/db/.env.example`
- `packages/shared/package.json`
- `packages/shared/tsconfig.json`
- `packages/shared/src/index.ts`

## Acceptance Criteria

- [x] No legacy Vue, Nuxt, or Netlify files remain (except `sessions/` and markdown docs)
- [x] `pnpm install` succeeds without errors and installs all workspace packages
- [x] `pnpm --filter api dev` starts a Hono server that responds on `http://localhost:3000` with JSON response
- [x] `pnpm --filter web dev` starts the Vite dev server on `http://localhost:5173` (or next available port)
- [x] TypeScript compiles cleanly across all packages with `pnpm run type-check`
- [x] `pnpm run lint` runs without errors
- [x] `pnpm run format` runs without errors
- [x] All `.env.example` files are in place with required variables documented
- [x] `node_modules/` is generated only at root (pnpm hoisting)
- [x] Workspace structure is clean: `apps/api`, `apps/web`, `packages/db`, `packages/shared`
