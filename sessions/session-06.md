# Session 06 — Club Schema & CRUD

## Dependencies
Session 05

## Branch
`session/06-clubs`

## Goal
Define the clubs table in Drizzle, build full CRUD API routes, and add Zod validation schemas. Clubs are the organizational unit that owns events.

## Tasks

- Define `packages/db/src/schema/clubs.ts`:
  - `id` (text PK, nanoid)
  - `name`, `description` (text)
  - `clubLogo` (text URL, nullable)
  - `contactUserId` (text FK → users.id)
  - `stripeCustomerId` (text, nullable)
  - `joinable` (boolean, default true — anyone can join)
  - `visible` (boolean, default true — listed publicly)
  - `createdAt`, `updatedAt`
- Define Drizzle relations in `packages/db/src/schema/clubs.ts` (relation to users for contactUser)
- Define Zod schemas in `packages/shared/src/schemas/club.ts`:
  - `createClubSchema`, `updateClubSchema`, `clubResponseSchema`
- Create `apps/api/src/routes/clubs.ts`:
  - `POST /api/clubs` — create club (auth required, creator becomes contact)
  - `GET /api/clubs` — list visible clubs with search/pagination (public)
  - `GET /api/clubs/:id` — get club detail (public if visible, else members only)
  - `PUT /api/clubs/:id` — update club (requires club admin permission — for now just check contactUserId, permission middleware comes in session 07)
  - `DELETE /api/clubs/:id` — soft delete
- Add pagination helper in `apps/api/src/lib/pagination.ts` (cursor or offset-based, reusable)
- Generate and apply migration

## Files to Create/Modify

**Create:**
- `packages/db/src/schema/clubs.ts`
- `packages/shared/src/schemas/club.ts`
- `apps/api/src/routes/clubs.ts`
- `apps/api/src/lib/pagination.ts`

**Modify:**
- `packages/db/src/schema/index.ts`
- `apps/api/src/index.ts`

## Acceptance Criteria

- Clubs table exists in database
- All CRUD routes work and return proper responses
- Pagination works on the list endpoint
- Zod validation rejects invalid payloads
- Only the contact user can update/delete their club
