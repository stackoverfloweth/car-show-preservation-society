# Session 07 — Club Memberships & Permissions

## Dependencies
Session 06

## Branch
`session/07-club-memberships`

## Goal
Build the complete club membership system including memberships, invitations, applications, and a permission middleware that gates club-level actions. This is the authorization backbone of the app.

## Tasks

- Define `packages/db/src/schema/club-memberships.ts`:
  - `id` (text PK, nanoid)
  - `clubId` (FK → clubs.id)
  - `userId` (FK → users.id)
  - `permissions` (text array — values from a defined set of permission strings)
  - `isPrimary` (boolean, default false)
  - `createdAt`
  - Unique constraint on (clubId, userId)
- Define `packages/db/src/schema/club-invitations.ts`:
  - `id`, `clubId` (FK), `emailAddress`, `permissions` (text[]), `createdAt`, `acceptedAt` (nullable)
- Define `packages/db/src/schema/club-applications.ts`:
  - `id`, `clubId` (FK), `userId` (FK), `message` (text, nullable), `status` (text enum: pending/approved/denied), `createdAt`, `reviewedAt` (nullable), `reviewedByUserId` (FK, nullable)
- Define permission constants in `packages/shared/src/constants/permissions.ts`:
  - `CLUB_PERMISSIONS` object: `CREATE_EVENTS`, `MANAGE_MEMBERS`, `START_VOTING`, `END_VOTING`, `BYPASS_REGISTRATION`, `CREATE_VOTING_CATEGORY`, `MANAGE_SPONSORS`, `SEND_MESSAGES`
- Define Zod schemas in `packages/shared/src/schemas/club-membership.ts`
- Build `apps/api/src/middleware/club-permissions.ts`:
  - Middleware factory: `requireClubPermission(permission: string)` — looks up membership for authenticated user + clubId param, checks permission array
  - Also export `requireClubMember()` for basic membership check
- Create `apps/api/src/routes/club-memberships.ts`:
  - `GET /api/clubs/:clubId/members` — list members (members only)
  - `POST /api/clubs/:clubId/members` — direct add (requires MANAGE_MEMBERS)
  - `PUT /api/clubs/:clubId/members/:memberId` — update permissions (requires MANAGE_MEMBERS)
  - `DELETE /api/clubs/:clubId/members/:memberId` — remove member (requires MANAGE_MEMBERS, or self-leave)
  - `POST /api/clubs/:clubId/invitations` — invite by email (requires MANAGE_MEMBERS)
  - `GET /api/clubs/:clubId/invitations` — list pending invitations
  - `POST /api/clubs/:clubId/invitations/:invitationId/accept` — accept invitation (auth required, email must match)
  - `POST /api/clubs/:clubId/applications` — apply to join (auth required)
  - `GET /api/clubs/:clubId/applications` — list applications (requires MANAGE_MEMBERS)
  - `PUT /api/clubs/:clubId/applications/:applicationId` — approve/deny (requires MANAGE_MEMBERS)
- When a club is created (from session 06), automatically create a membership for the creator with ALL permissions and isPrimary=true. If session 06 is already merged, add this logic. If not, document it as a hook that session 06's club creation route should call.
- Generate and apply migration

## Files to Create/Modify

**Create:**
- `packages/db/src/schema/club-memberships.ts`
- `packages/db/src/schema/club-invitations.ts`
- `packages/db/src/schema/club-applications.ts`
- `packages/shared/src/constants/permissions.ts`
- `packages/shared/src/schemas/club-membership.ts`
- `apps/api/src/middleware/club-permissions.ts`
- `apps/api/src/routes/club-memberships.ts`

**Modify:**
- `packages/db/src/schema/index.ts`
- `apps/api/src/index.ts`
- `apps/api/src/routes/clubs.ts` (add auto-membership on create, gate update/delete behind permission middleware)

## Acceptance Criteria

- All three tables exist in database
- Club creator gets auto-membership with all permissions
- Permission middleware correctly gates routes
- Invitation flow works: invite → accept → membership created
- Application flow works: apply → approve/deny → membership created if approved
- Members can leave clubs (self-delete)
- Zod validation on all inputs
