# Session 16 — Voting Results & Placements

## Dependencies
Session 13 (ballots)

## Branch
`session/16-voting-results`

## Goal
Build the vote tallying and results system. Club members trigger result calculation after voting ends, and the system counts non-disqualified votes per carId per category to determine placements and rankings. Results are persisted for historical reference and appear on user profiles.

## Tasks

### 1. Create Drizzle schema for voting results
- Create `packages/db/src/schema/voting-results.ts`:
  - `id` (text PK, nanoid)
  - `eventId` (FK → events.id, not null)
  - `votingCategoryId` (FK → votingCategories.id, not null)
  - `registrationId` (FK → registrations.id, not null — the winner's registration)
  - `place` (integer, not null — 1, 2, 3, etc.)
  - `voteCount` (integer, not null — total non-disqualified votes)
  - `createdAt` (timestamp with timezone)
  - `updatedAt` (timestamp with timezone, nullable)
  - Composite unique constraint: (eventId, votingCategoryId, place) — no duplicate placements
  - Export as `votingResults` table

### 2. Create shared validation schemas
- Create `packages/shared/src/schemas/voting-result.ts`:
  - `VotingResultSchema` — represents a single placement with: id, place, voteCount, registration info (carId, driver name, vehicle details)
  - `VotingResultsByCategory` — groups results by category: { category: { id, name }, results: VotingResultSchema[] }
  - `UserPlacementSchema` — for profile: { eventId, eventName, eventDate, category, place, voteCount }

### 3. Create vote tally utility
- Create `apps/api/src/lib/vote-tally.ts`:
  - Export async `tallyCategoryVotes(eventId: string, votingCategoryId: string, db)` function
    - Query all ballotVotingCategories where:
      - ballots.eventId = eventId (via join)
      - votingCategoryId matches
      - disqualified = false
    - Group by carId, count votes
    - Sort by count descending
    - Assign places (if tied, same place, skip next place):
      - Example: [10, 10, 8, 5] → places [1, 1, 3, 4] not [1, 2, 3, 4]
    - For each (carId, voteCount, place): map carId to registrationId via vehicle/registration join
    - Return array of `{ registrationId, place, voteCount }`
  
  - Export async `tallyAllResults(eventId: string, db)` function
    - Get all voting categories for event
    - For each category: call `tallyCategoryVotes`
    - Collect all (eventId, votingCategoryId, registrationId, place, voteCount)
    - Return structured results

### 4. Create voting results routes
- Create `apps/api/src/routes/voting-results.ts` with these endpoints:
  - `POST /api/events/:eventId/results/calculate` — trigger vote calculation
    - Requires END_VOTING permission for the event's club
    - Validate event.votingEnd has passed (or voting is explicitly closed)
    - Delete all existing votingResults for this eventId (idempotent)
    - Call `tallyAllResults(eventId)` from vote-tally.ts
    - Insert new votingResults records into DB
    - Return summary: { categoriesProcessed, totalResults, message }
  
  - `GET /api/events/:eventId/results` — get all results for event
    - No auth required (results are public)
    - Group results by votingCategory
    - For each result, include: place, voteCount, registration (carId, vehicle make/model/year, driver name if available)
    - Return: array of `{ category: { id, name }, results: [...] }`
  
  - `GET /api/events/:eventId/results/by-category/:categoryId` — results for one category
    - No auth required
    - Filter to one votingCategoryId
    - Return sorted array with place, voteCount, registration details
  
  - `GET /api/users/:userId/placements` — historical placements for a user
    - Auth optional (if authenticated, can see own; if not, return public info)
    - Find all registrations for this userId
    - Join with votingResults to get all placements
    - Return array of: { eventId, eventName, eventDate, categoryName, place, voteCount }
    - Sort by eventDate descending
  
  - `GET /api/events/:eventId/results/stats` — summary statistics
    - No auth required
    - Calculate: total votes cast, total disqualified votes, participation rate (ballots / total eligible drivers), most voted category, most competitive category (highest vote spread)
    - Return: `{ totalVotesCast, disqualifiedCount, participationRate, votesByCategory: { categoryName: count }, ... }`

### 5. Update schema exports
- Update `packages/db/src/schema/index.ts`:
  - Add export for `votingResults` in alphabetical order

### 6. Update app router
- Update `apps/api/src/index.ts`:
  - Mount voting results router: `app.route('/api', votingResultsRouter)`

## Files to Create/Modify

### Create:
- `packages/db/src/schema/voting-results.ts`
- `packages/shared/src/schemas/voting-result.ts`
- `apps/api/src/routes/voting-results.ts`
- `apps/api/src/lib/vote-tally.ts`

### Modify:
- `packages/db/src/schema/index.ts` (add export)
- `apps/api/src/index.ts` (mount router)

## Acceptance Criteria

- votingResults table created with proper schema and unique constraint
- Tally correctly counts non-disqualified votes grouped by carId per category
- Ties handled correctly: same vote count gets same place, next place skips appropriately
- Results can be recalculated: delete old results, insert new ones (idempotent)
- POST /api/events/:eventId/results/calculate returns success message
- GET /api/events/:eventId/results returns grouped results with full registration details
- GET /api/events/:eventId/results/by-category/:categoryId returns sorted array for one category
- GET /api/users/:userId/placements returns historical placements across all events
- GET /api/events/:eventId/results/stats returns meaningful aggregate data
- Permission check enforces: only club members with END_VOTING permission can trigger calculation
- Results are public (no auth required for GET endpoints)
- Calculation correctly identifies and filters disqualified votes
- carId mapping works correctly (finds registrationId from carId)
- TypeScript compiles without errors
- Stats calculation is efficient (consider DB aggregation vs. application logic)
