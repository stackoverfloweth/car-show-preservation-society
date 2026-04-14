# Session 10 — Voting Categories

## Dependencies
Session 09 (events)

## Branch
`session/10-voting-categories`

## Goal
Build voting categories for events, including the voting category registration junction table that tracks which cars are entered in which categories. Categories can have restrictions (drivers-only, members-only), capacity limits, and optional pricing.

## Tasks

1. **Create the votingCategories table schema** (`packages/db/src/schema/voting-categories.ts`):
   - id (nanoid)
   - eventId (FK → events.id)
   - name (text)
   - description (text, nullable)
   - maxCapacity (integer, nullable — null means unlimited)
   - driversOnly (boolean, default false — only ballots from registrations can vote)
   - membersOnly (boolean, default false — only ballots from club memberships can vote)
   - automaticEntry (boolean, default false — auto-assign all registrations on creation)
   - featured (boolean, default false — display prominently)
   - stripePriceId (text, nullable — optional extra cost for voting in this category)
   - createdAt
   - updatedAt (nullable)
   - Add index on eventId
   - Add composite index (eventId, name) for uniqueness check

2. **Create the votingCategoryRegistrations table schema** (`packages/db/src/schema/voting-category-registrations.ts`):
   - id (nanoid)
   - votingCategoryId (FK → votingCategories.id)
   - registrationId (text) — FK reference, but do NOT create the foreign key constraint yet (registrations table created in Session 11). Use a text column for now.
   - createdAt
   - Add index on votingCategoryId
   - Add index on registrationId
   - Add unique composite index (votingCategoryId, registrationId) to prevent duplicates
   - Add comment: "FK constraint to registrations.id will be added in Session 11"

3. **Create Zod validation schema** (`packages/shared/src/schemas/voting-category.ts`):
   - Export `CreateVotingCategorySchema`, `UpdateVotingCategorySchema`, `VotingCategorySchema`
   - Validate that maxCapacity is positive if provided
   - Validate that stripePriceId is provided if charging for the category

4. **Create API routes** (`apps/api/src/routes/voting-categories.ts`):
   - `POST /api/events/:eventId/voting-categories` — Create category (requires CREATE_VOTING_CATEGORY permission on the event's club)
     - Body: Zod-validated CreateVotingCategorySchema
     - If automaticEntry is true: create votingCategoryRegistrations records for all existing registrations of that event
     - Returns: Created category with current entry count
   - `GET /api/events/:eventId/voting-categories` — List categories for event (public)
     - Returns: Array of categories with entry count for each
     - Sort by featured DESC, then by createdAt ASC
   - `PUT /api/voting-categories/:id` — Update category (requires CREATE_VOTING_CATEGORY permission on the event's club)
     - Body: Zod-validated UpdateVotingCategorySchema
     - Restrictions: Cannot update after event.votingStart is set
     - Validation: If maxCapacity is reduced, ensure current entries ≤ new maxCapacity
     - Returns: Updated category
   - `DELETE /api/voting-categories/:id` — Remove category (requires CREATE_VOTING_CATEGORY permission)
     - Restriction: Only allowed before event.votingStart is set
     - Also delete all associated votingCategoryRegistrations records
     - Returns: 204 No Content
   - `POST /api/voting-categories/:id/registrations` — Assign car to category (requires REGISTER_CAR permission or driver can assign own car)
     - Body: { registrationId: string }
     - Validation: maxCapacity check (if set, fail if already at capacity)
     - Returns: Created votingCategoryRegistrations record
   - `DELETE /api/voting-categories/:id/registrations/:regId` — Unassign car from category (requires REGISTER_CAR permission)
     - Restriction: Only allowed before event.votingStart is set
     - Returns: 204 No Content
   - `GET /api/voting-categories/:id` — Category detail (public)
     - Returns: Category with full entry count and list of registrationIds

5. **Enforce immutability after votingStart**:
   - All write operations (except category creation) should check that event.votingStart is null or in the past before allowing updates/deletes
   - Throw 409 Conflict if attempting to modify after votingStart

## Files to Create/Modify

### Create:
- `packages/db/src/schema/voting-categories.ts`
- `packages/db/src/schema/voting-category-registrations.ts`
- `packages/shared/src/schemas/voting-category.ts`
- `apps/api/src/routes/voting-categories.ts`

### Modify:
- `packages/db/src/schema/index.ts` (add exports in alphabetical order)
- `apps/api/src/index.ts` (mount routes)

## Acceptance Criteria

- Both votingCategories and votingCategoryRegistrations tables exist with correct schema
- CRUD operations work correctly
- CREATE_VOTING_CATEGORY and REGISTER_CAR permissions are properly checked
- Capacity enforcement works: cannot add more registrations than maxCapacity
- Immutability is enforced after votingStart is set
- Categories cannot be deleted after votingStart
- Entry counts are accurately returned on list and detail endpoints
- automaticEntry flag works: creating a category with automaticEntry=true auto-creates registration assignments for all event registrations
- All endpoints validate input with Zod schemas
- Category lists are sorted (featured first, then by createdAt)
