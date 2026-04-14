# CSPS — Shared Session Context

> Every session agent should read this file first. It describes the project, tech stack, repo layout, and coding conventions that all sessions share.

## Project Overview

**Car Show Preservation Society (CSPS)** is a platform for organizing and participating in car shows. Clubs create events, drivers register and check in, attendees vote on cars by category, and results are tallied automatically. The system handles the full lifecycle: club management, event creation, pre-registration, gate check-in, live voting (app, kiosk, and guest modes), results, payments, messaging, and notifications.

## Tech Stack

| Layer | Technology | Version/Notes |
|-------|-----------|---------------|
| **Monorepo** | pnpm workspaces | `apps/` + `packages/` structure |
| **Language** | TypeScript | Strict mode, across all packages |
| **Frontend** | React 19 | Vite for bundling |
| **Routing** | TanStack Router | File-based routing in `apps/web/src/routes/` |
| **Data Fetching** | TanStack Query | All API calls go through query/mutation hooks |
| **Styling** | Tailwind CSS 4 | Utility-first |
| **Auth** | Clerk | Managed auth, OAuth providers (Google, Apple) |
| **Backend** | Hono | Modular route files in `apps/api/src/routes/` |
| **ORM** | Drizzle | One schema file per table in `packages/db/src/schema/` |
| **Database** | PostgreSQL | Hosted on Railway |
| **Validation** | Zod | Shared schemas in `packages/shared/src/schemas/` |
| **Payments** | Stripe | Checkout sessions, webhooks |
| **Images** | Cloudinary | Upload SDK, URL transforms |
| **Maps** | Mapbox | Geocoding + GL JS map display |
| **Deployment** | Railway | API + DB. Frontend on Vercel or Railway static |

## Repository Structure

```
car-show-preservation-society/
├── apps/
│   ├── api/                          # Hono backend
│   │   ├── src/
│   │   │   ├── index.ts              # Hono app entry point
│   │   │   ├── routes/               # One file per domain
│   │   │   │   ├── users.ts
│   │   │   │   ├── clubs.ts
│   │   │   │   ├── club-memberships.ts
│   │   │   │   ├── vehicles.ts
│   │   │   │   ├── events.ts
│   │   │   │   ├── voting-categories.ts
│   │   │   │   ├── registrations.ts
│   │   │   │   ├── ballots.ts
│   │   │   │   ├── voting-results.ts
│   │   │   │   ├── messages.ts
│   │   │   │   ├── sponsors.ts
│   │   │   │   ├── images.ts
│   │   │   │   ├── subscriptions.ts
│   │   │   │   ├── stripe-webhooks.ts
│   │   │   │   └── clerk-webhooks.ts
│   │   │   ├── middleware/            # Auth, error handling, etc.
│   │   │   │   ├── auth.ts
│   │   │   │   ├── error-handler.ts
│   │   │   │   ├── club-permissions.ts
│   │   │   │   └── request-id.ts
│   │   │   ├── lib/                   # Shared backend utilities
│   │   │   │   ├── stripe.ts
│   │   │   │   ├── cloudinary.ts
│   │   │   │   ├── email.ts
│   │   │   │   ├── qr.ts
│   │   │   │   └── response.ts
│   │   │   └── env.ts                 # Environment variable parsing
│   │   ├── drizzle.config.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                           # React frontend
│       ├── src/
│       │   ├── main.tsx               # App entry
│       │   ├── routes/                # TanStack Router file-based routes
│       │   │   ├── __root.tsx         # Root layout
│       │   │   ├── index.tsx          # Home page
│       │   │   ├── login.tsx
│       │   │   ├── signup.tsx
│       │   │   ├── events/
│       │   │   │   ├── index.tsx      # Event listing
│       │   │   │   ├── $eventId.tsx   # Event detail
│       │   │   │   └── new.tsx        # Create event
│       │   │   ├── clubs/
│       │   │   ├── garage/
│       │   │   ├── profile/
│       │   │   ├── registrations/
│       │   │   ├── vote/
│       │   │   └── messages/
│       │   ├── components/            # Reusable UI components
│       │   │   ├── ui/                # Generic (buttons, inputs, cards)
│       │   │   ├── layout/            # Shell, nav, sidebar
│       │   │   ├── events/            # Event-specific components
│       │   │   ├── clubs/
│       │   │   ├── vehicles/
│       │   │   ├── voting/
│       │   │   └── maps/
│       │   ├── hooks/                 # Custom React hooks
│       │   │   ├── api/               # TanStack Query hooks per domain
│       │   │   │   ├── use-events.ts
│       │   │   │   ├── use-clubs.ts
│       │   │   │   └── ...
│       │   │   └── use-auth.ts
│       │   ├── lib/                   # Frontend utilities
│       │   │   ├── api-client.ts      # Typed fetch wrapper
│       │   │   ├── clerk.ts           # Clerk config
│       │   │   └── mapbox.ts
│       │   └── styles/
│       │       └── globals.css        # Tailwind imports + CSPS tokens
│       ├── package.json
│       ├── vite.config.ts
│       ├── tailwind.config.ts
│       └── tsconfig.json
│
├── packages/
│   ├── db/                            # Drizzle schema + migrations
│   │   ├── src/
│   │   │   ├── index.ts               # DB client + connection
│   │   │   ├── schema/                # One file per table
│   │   │   │   ├── index.ts           # Re-exports all tables
│   │   │   │   ├── users.ts
│   │   │   │   ├── clubs.ts
│   │   │   │   ├── club-memberships.ts
│   │   │   │   ├── club-invitations.ts
│   │   │   │   ├── club-applications.ts
│   │   │   │   ├── vehicles.ts
│   │   │   │   ├── vehicle-images.ts
│   │   │   │   ├── events.ts
│   │   │   │   ├── event-images.ts
│   │   │   │   ├── voting-categories.ts
│   │   │   │   ├── voting-category-registrations.ts
│   │   │   │   ├── registrations.ts
│   │   │   │   ├── ballots.ts
│   │   │   │   ├── ballot-voting-categories.ts
│   │   │   │   ├── voting-results.ts
│   │   │   │   ├── messages.ts
│   │   │   │   ├── event-sponsors.ts
│   │   │   │   ├── club-sponsors.ts
│   │   │   │   ├── club-subscriptions.ts
│   │   │   │   └── user-search-subscriptions.ts
│   │   │   └── relations.ts           # Drizzle relational queries config
│   │   ├── drizzle/                   # Generated migrations
│   │   ├── drizzle.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── shared/                        # Shared types + validation
│       ├── src/
│       │   ├── schemas/               # Zod schemas (one per domain)
│       │   │   ├── user.ts
│       │   │   ├── club.ts
│       │   │   ├── event.ts
│       │   │   ├── registration.ts
│       │   │   ├── ballot.ts
│       │   │   ├── vehicle.ts
│       │   │   └── ...
│       │   ├── types/                 # Inferred types from Zod + Drizzle
│       │   │   └── index.ts
│       │   └── constants/             # Enums, permission strings, etc.
│       │       ├── permissions.ts
│       │       ├── event-status.ts
│       │       └── driver-status.ts
│       ├── package.json
│       └── tsconfig.json
│
├── sessions/                          # Session task files (this directory)
├── PROJECT_PLAN.md                    # Master plan
├── pnpm-workspace.yaml
├── package.json                       # Root workspace config
├── tsconfig.base.json                 # Shared TS config
├── .env.example
└── .gitignore
```

## Git Branching Strategy

Each session works on an **isolated branch** to avoid conflicts with parallel sessions.

### Branch naming
```
session/XX-short-description
```
Examples: `session/01-monorepo-setup`, `session/05-user-schema`, `session/13-ballot-system`

### Merge order
Sessions merge in **dependency order**, not creation order. A session's branch is based on `main` after all its dependencies have been merged. The dependency graph is specified in each session file.

### Conflict avoidance by design
The repo structure isolates domains so parallel sessions rarely touch the same files:

- **Schema files**: Each table has its own file in `packages/db/src/schema/`. Sessions that add new tables create new files. The `schema/index.ts` barrel file is the only shared touchpoint — keep exports alphabetically sorted for clean merges.
- **API routes**: Each domain has its own route file in `apps/api/src/routes/`. The `index.ts` that mounts routes is the only shared file — append new routes at the bottom.
- **Frontend routes**: File-based routing means each page is its own file. New pages = new files, no conflicts.
- **Query hooks**: One file per domain in `apps/web/src/hooks/api/`. New domains = new files.

### When merging
After merging a session branch into `main`:
1. Run `pnpm db:generate` to consolidate any new migration files
2. Run `pnpm typecheck` to verify cross-package types
3. Run `pnpm test` if tests exist

## Coding Conventions

### General
- Use `nanoid` for all primary key generation (text IDs, not auto-increment)
- All timestamps use `timestamp('...', { withTimezone: true })` in Drizzle
- Every table gets `createdAt` and `updatedAt` columns (updatedAt nullable)
- Use Zod for all request validation; share schemas from `packages/shared`
- Prefer explicit error handling over try/catch — return typed error responses

### Backend (Hono)
- Each route file exports a `Hono` instance that gets mounted in the main app
- Use Hono's `zValidator` middleware for request body/query/param validation
- Auth middleware injects `c.get('userId')` for the authenticated Clerk user ID
- Response helpers: `c.json({ data })` for success, throw `HTTPException` for errors
- Use Drizzle's relational query API (`db.query.table.findMany({ with: ... })`) for reads
- Use standard insert/update/delete for writes

### Frontend (React)
- All API calls go through TanStack Query hooks (no raw fetch in components)
- Query hooks live in `src/hooks/api/use-{domain}.ts` (e.g., `use-events.ts`)
- Each hook file exports query options factories and mutation hooks
- Use TanStack Router's `loader` for route-level data fetching where appropriate
- Clerk's `useAuth()` and `useUser()` for auth state
- Keep components small; extract logic into hooks
- Tailwind for all styling — no CSS modules or styled-components

### File naming
- All files use **kebab-case**: `club-memberships.ts`, `use-events.ts`
- Schema files match table name: `voting-categories.ts` defines `votingCategories` table
- Route files match domain: `clubs.ts` handles `/api/clubs/*`

## Environment Variables

### Backend (`apps/api/.env`)
```
DATABASE_URL=postgresql://...          # Railway PostgreSQL
CLERK_SECRET_KEY=sk_...                # Clerk backend secret
CLERK_WEBHOOK_SECRET=whsec_...         # Clerk webhook signing
STRIPE_SECRET_KEY=sk_...               # Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...        # Stripe webhook signing
CLOUDINARY_URL=cloudinary://...        # Cloudinary connection
CLOUDINARY_PRESET=csps_uploads         # Upload preset name
MAPBOX_TOKEN=pk....                    # Mapbox server token
PORT=3000                              # Server port
```

### Frontend (`apps/web/.env`)
```
VITE_API_URL=http://localhost:3000     # Backend URL
VITE_CLERK_PUBLISHABLE_KEY=pk_...     # Clerk frontend key
VITE_MAPBOX_TOKEN=pk....              # Mapbox client token
VITE_CLOUDINARY_CLOUD_NAME=csps       # Cloudinary cloud name
```

## Domain Glossary

| Term | Definition |
|------|-----------|
| **Club** | An organization that hosts events. Any user can create one. Events are always owned by a club, even if it's a one-person "club." |
| **Member** | A user who belongs to a club and may have permissions to manage events. |
| **Driver** | A user who registers for an event with a vehicle. A user can be both a member and a driver. |
| **Car ID** | A sequential number assigned to a driver when they check in at the gate. This is the public identifier used for voting (like a race number). |
| **Registration Code** | A private alphanumeric code given at registration. Acts as a passcode for kiosk voting. Think of it as a "private key" while Car ID is the "public key." |
| **Ballot** | A voting record. Drivers get N ballots per registration (configured by event). Ballots can be shared with guests (e.g., a driver's spouse). |
| **Voting Category** | A judging category for an event (e.g., "Best Paint", "Club Choice"). Some may be restricted to drivers-only or members-only voting. |
| **Driver Status** | New → Unregistered → Registered → Checked-In. Only checked-in drivers (with a Car ID) can receive votes. |

## Session File Format

Each session file follows this structure:

```markdown
# Session XX — Title

## Dependencies
Sessions that must be merged to `main` before this one starts.

## Branch
`session/XX-short-name`

## Goal
One-paragraph description of what this session produces.

## Tasks
Detailed list of what to build.

## Files to Create/Modify
Explicit list of files this session owns.

## Acceptance Criteria
How to verify the session's work is complete.
```
