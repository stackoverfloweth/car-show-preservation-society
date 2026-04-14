# Session 05 — User Schema & Clerk Sync

## Dependencies
Sessions 02, 03

## Branch
`session/05-user-schema`

## Goal
Define the users table in Drizzle, set up a Clerk webhook to sync user creation/updates to PostgreSQL, and build user API routes (get profile, update own profile, search users).

## Tasks

- Define `packages/db/src/schema/users.ts`:
  - `id` (text PK — maps to Clerk user ID)
  - `emailAddress` (text, nullable)
  - `phoneNumber` (text, nullable)
  - `firstName`, `lastName` (text, nullable)
  - `location` (jsonb, nullable — shape: { placeName, latitude, longitude, mapboxId })
  - `profileImage` (text URL, nullable)
  - `stripeCustomerId` (text, nullable)
  - `hideEmail`, `hidePhone`, `hideLocation` (boolean, default false)
  - `createdAt`, `updatedAt` timestamps
- Export from `packages/db/src/schema/index.ts`
- Define Zod schemas in `packages/shared/src/schemas/user.ts`:
  - `updateUserSchema` — for PUT /api/users/me body validation
  - `userResponseSchema` — for API responses (with privacy-filtered fields)
- Create `apps/api/src/routes/clerk-webhooks.ts`:
  - `POST /api/webhooks/clerk` — handle `user.created`, `user.updated`, `user.deleted` events
  - Verify webhook signature using Clerk's svix verification
  - On user.created: insert into users table with Clerk user data
  - On user.updated: update the users row
  - On user.deleted: soft delete or hard delete the row
- Create `apps/api/src/routes/users.ts`:
  - `GET /api/users/:id` — get public profile (respects hideEmail/hidePhone/hideLocation)
  - `PUT /api/users/me` — update own profile (auth required)
  - `GET /api/users/search?q=...` — search by name or email (auth required)
- Run `pnpm db:generate` and `pnpm db:push`

## Files to Create/Modify

**Create:**
- `packages/db/src/schema/users.ts`
- `packages/shared/src/schemas/user.ts`
- `apps/api/src/routes/clerk-webhooks.ts`
- `apps/api/src/routes/users.ts`

**Modify:**
- `packages/db/src/schema/index.ts`
- `apps/api/src/index.ts`

## Acceptance Criteria

- Users table exists in database after migration
- Clerk webhook creates a user row when a new user signs up
- GET /api/users/:id returns public profile with privacy fields respected
- PUT /api/users/me updates the authenticated user's profile
- GET /api/users/search returns matching users
- All routes have proper Zod validation
