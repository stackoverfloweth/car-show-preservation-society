# Session 13 — Ballot System

## Dependencies
Sessions 10 (voting categories), 11 (registrations)

## Branch
`session/13-ballots`

## Goal
Build the core ballot and vote-casting system. Ballots are created on demand when a driver actually votes (not pre-created). Each ballot has votes per voting category, where a vote is just a carId. This session implements the full voting lifecycle including business rules from the spec.

## Tasks

### 1. Create Drizzle schema files
- Create `packages/db/src/schema/ballots.ts`:
  - `id` (text PK, nanoid)
  - `registrationId` (FK → registrations.id, nullable)
  - `clubMembershipId` (FK → club_memberships.id, nullable)
  - Constraint: exactly one of registrationId or clubMembershipId must be non-null
  - `createdAt` (timestamp with timezone, default now)
  - `updatedAt` (timestamp with timezone, nullable)
  - Export as `ballots` table

- Create `packages/db/src/schema/ballot-voting-categories.ts`:
  - `id` (text PK, nanoid)
  - `ballotId` (FK → ballots.id, cascade delete)
  - `votingCategoryId` (FK → votingCategories.id)
  - `carId` (integer — the car being voted for)
  - `disqualified` (boolean, default false)
  - `createdAt` (timestamp with timezone)
  - `updatedAt` (timestamp with timezone, nullable)
  - Export as `ballotVotingCategories` table

### 2. Create shared validation schemas
- Create `packages/shared/src/schemas/ballot.ts`:
  - `CreateBallotSchema` — validates ballot creation (no body needed for driver ballots, or clubMembershipId for member ballots)
  - `CastVotesSchema` — body: array of `{ votingCategoryId: string, carId: number }`
  - `DisqualifyVoteSchema` — body: `{ ballotVotingCategoryId: string, disqualified: boolean }`

### 3. Create vote validation utility
- Create `apps/api/src/lib/vote-validation.ts`:
  - Export `validateVote(eventId, ballot, votingCategoryId, carId, db)` async function
  - Checks:
    1. Voting window is still open (event.votingEnd not reached)
    2. carId belongs to a checked-in registration at this event
    3. canVoteForSelf rule (if false, reject if carId matches ballot owner's carId)
    4. driversOnly rule (if true, reject if ballot has clubMembershipId only)
    5. membersOnly rule (if true, reject if ballot has registrationId only)
    6. Ballot count limit not exceeded (count current ballots for this registration)
  - Return `{ valid: true } | { valid: false, reason: string }`

### 4. Create ballot routes
- Create `apps/api/src/routes/ballots.ts` with these endpoints:
  - `POST /api/events/:eventId/ballots` — create ballot for authenticated user's registration
    - Validate registration exists and is checked-in at this event
    - Validate ballot count limit not exceeded
    - Create ballot record with registrationId
    - Return ballot with empty votes array
  - `POST /api/events/:eventId/member-ballots` — create ballot for club member (requires END_VOTING permission)
    - Body: `{ clubMembershipId: string }`
    - Validate club membership exists
    - Create ballot record with clubMembershipId
    - Return ballot with empty votes array
  - `GET /api/ballots/:id` — get ballot with all votes (use relational query)
    - Return ballot + array of ballotVotingCategories
  - `PUT /api/ballots/:id/votes` — cast or update votes
    - Body: array of `{ votingCategoryId, carId }`
    - For each vote:
      - Delete existing vote for this ballot + category if exists
      - Call validateVote for this vote
      - If invalid, return 400 with reason
      - Insert new ballotVotingCategory record
    - Return updated ballot with all votes
  - `PUT /api/ballots/:id/disqualify` — mark vote as disqualified (requires END_VOTING permission)
    - Body: `{ ballotVotingCategoryId: string, disqualified: boolean }`
    - Update ballotVotingCategories record
    - Return updated ballot
  - `GET /api/events/:eventId/my-ballots` — list ballots for authenticated user at this event
    - Filter by registrationId of user's registration at event
    - Return array of ballots with vote counts
  - `GET /api/registrations/:registrationId/ballots` — list ballots for a registration (requires VIEW_REGISTRATIONS permission)
    - Filter by registrationId
    - Return array of ballots with vote counts

### 5. Update schema and app exports
- Update `packages/db/src/schema/index.ts`:
  - Add exports for `ballots` and `ballotVotingCategories` in alphabetical order
- Update `apps/api/src/index.ts`:
  - Mount ballots router: `app.route('/api', ballotsRouter)`

## Files to Create/Modify

### Create:
- `packages/db/src/schema/ballots.ts`
- `packages/db/src/schema/ballot-voting-categories.ts`
- `packages/shared/src/schemas/ballot.ts`
- `apps/api/src/routes/ballots.ts`
- `apps/api/src/lib/vote-validation.ts`

### Modify:
- `packages/db/src/schema/index.ts` (add exports)
- `apps/api/src/index.ts` (mount router)

## Acceptance Criteria

- Both tables created with proper schema and constraints
- Exactly-one-of constraint enforced (either registrationId or clubMembershipId, not both/neither)
- Ballot creation enforces ballot count limits from event config
- Vote casting validates all 6 business rules
- canVoteForSelf enforcement works correctly
- driversOnly/membersOnly enforcement works correctly
- Votes can be updated while voting is open (old vote deleted, new vote inserted)
- Votes become immutable after event.votingEnd (validation check)
- Disqualification works and marks ballotVotingCategories.disqualified
- Member ballots work independently from driver ballots
- All endpoints return appropriate error messages for validation failures
- TypeScript compiles without errors
