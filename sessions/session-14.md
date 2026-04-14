# Session 14 — Guest Voting (Shared Ballots)

## Dependencies
Session 13 (ballots)

## Branch
`session/14-guest-voting`

## Goal
Implement the ballot sharing feature where drivers can share one of their ballots with another person (e.g., spouse) via email or phone. The recipient gets a unique URL to complete the ballot without needing an account. Shared ballots count against the driver's ballot limit.

## Tasks

### 1. Extend ballots schema (or create separate table)
Choose one approach:

**Option A (Simpler): Add column to ballots table**
- Add `sharedWith` column to ballots (text, nullable — email or phone of recipient)
- Add `completedAt` column to ballots (timestamp with timezone, nullable — when guest submitted votes)
- Shared ballots have registrationId filled in but are marked as "shared" via sharedWith non-null

**Option B (Cleaner): Create separate ballot_shares table**
- Keep ballots unchanged
- Create `packages/db/src/schema/ballot-shares.ts`:
  - `id` (text PK, nanoid)
  - `ballotId` (FK → ballots.id, cascade delete)
  - `recipientEmail` (text, nullable)
  - `recipientPhone` (text, nullable)
  - Constraint: exactly one of recipientEmail or recipientPhone non-null
  - `sharedAt` (timestamp with timezone)
  - `completedAt` (timestamp with timezone, nullable)
  - Export as `ballotShares` table

**Recommendation: Use Option A for simplicity** — shared ballots are still ballots, just marked with a recipient.

### 2. Create email sending utility
- Create `apps/api/src/lib/email.ts`:
  - Export async `sendBallotShareEmail(to: string, ballotUrl: string): Promise<void>`
  - For MVP: Just log the email (console.log) with the URL
  - Design so it can be swapped with Resend or SendGrid later
  - Include template with clear instructions on how to vote
  - Body should mention: "You've been invited to vote at [event]. Click this link to cast your ballot: [URL]"

### 3. Create ballot share endpoint
- Add to `apps/api/src/routes/ballots.ts`:
  - `POST /api/ballots/:id/share` — share a ballot with another person
    - Auth required (Clerk user)
    - Path: ballot to share
    - Body: `{ email?: string, phone?: string }`
    - Validation:
      - Ballot belongs to authenticated user's registration
      - Exactly one of email or phone provided
      - Voting window is still open
      - Owner's ballot count limit not exceeded (check current ballots)
    - Create new ballot record with same registrationId, mark sharedWith = email or phone
    - Send email/SMS with guest voting URL
    - Return new ballot ID and URL
    - Error if count limit exceeded

### 4. Create guest ballot endpoints
- Add to `apps/api/src/routes/ballots.ts` (or separate `guest-ballots.ts`):
  - `GET /api/ballots/:ballotId/guest` — retrieve guest ballot info
    - No auth required (ballotId acts as token)
    - Return ballot + voting categories + event info (name, votingEnd, etc.)
    - Include validation status (voting still open? yes/no)
    - 404 if ballot not found or doesn't have sharedWith set
  - `PUT /api/ballots/:ballotId/guest/votes` — cast votes as guest
    - No auth required
    - Same vote validation as regular voting (but ballotId in path instead of auth)
    - Body: array of `{ votingCategoryId, carId }`
    - Call validateVote for each vote (works fine, doesn't need auth)
    - Set completedAt when votes submitted
    - Return updated ballot with all votes

### 5. Update schema exports
- Update `packages/db/src/schema/index.ts`:
  - If Option B: add export for `ballotShares` in alphabetical order
  - If Option A: no change needed (ballots already exported)

### 6. Update app router
- Update `apps/api/src/index.ts`:
  - No change if reusing ballots router
  - If creating separate guest-ballots.ts, mount it: `app.route('/api', guestBallotsRouter)`

## Files to Create/Modify

### Create:
- `apps/api/src/lib/email.ts`
- (If Option B) `packages/db/src/schema/ballot-shares.ts`

### Modify:
- `packages/db/src/schema/ballots.ts` (add sharedWith, completedAt columns)
- `apps/api/src/routes/ballots.ts` (add share, guest endpoints)
- `packages/db/src/schema/index.ts` (if Option B)
- `apps/api/src/index.ts` (if creating new route file)

## Acceptance Criteria

- Driver can initiate ballot share with email or phone
- Shared ballot creates a new ballot record tied to the original registration
- Shared ballots count against the driver's ballot limit
- Cannot share more ballots than event.ballotCount allows
- Guest can access ballot via URL without any authentication
- Guest can cast votes with full validation (voting window, carIds, category restrictions)
- Email function is invoked with correct URL format: `/vote/guest/{ballotId}`
- Guest ballot marked completedAt when votes submitted
- Invalid ballot IDs return 404
- Voting window check works for guest ballots too (prevents voting after votingEnd)
- All validation errors return appropriate HTTP status codes (400 for validation, 404 for not found)
- TypeScript compiles without errors
