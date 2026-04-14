# Session 15 — Voting Mode (Kiosk)

## Dependencies
Session 13 (ballots)

## Branch
`session/15-voting-kiosk`

## Goal
Build the kiosk/voting-mode API endpoints that allow drivers to cast votes from a shared device (iPad/laptop) at the event without needing to sign into the app. Drivers authenticate with their carId + registrationCode. These are intentionally public and lightweight endpoints designed for high-traffic voting scenarios.

## Tasks

### 1. Create kiosk token utilities
- Create `apps/api/src/lib/kiosk-token.ts`:
  - Export `createKioskToken(registrationId: string, eventId: string): string`
    - Create a JWT (use `jose` or `hono/jwt`) with payload: `{ registrationId, eventId, type: 'kiosk' }`
    - Secret from `env.KIOSK_JWT_SECRET` or derived from `env.CLERK_SECRET_KEY`
    - Expiry: 30 minutes from now
  - Export `verifyKioskToken(token: string): { registrationId: string, eventId: string } | null`
    - Verify JWT signature and expiry
    - Return payload if valid, null otherwise
  - Include error handling (expired, invalid signature, etc. all return null)

### 2. Create kiosk auth middleware
- Create `apps/api/src/middleware/kiosk-auth.ts`:
  - Export middleware function `kioskAuth()` for Hono
  - Extracts JWT from Authorization header: `Bearer <token>`
  - Validates token using `verifyKioskToken`
  - Injects into Hono context: `c.set('kioskRegistrationId', registrationId)`, `c.set('kioskEventId', eventId)`
  - If invalid/missing: return 401 with message "Invalid or expired kiosk token"
  - Does NOT require Clerk auth

### 3. Create kiosk auth endpoint
- Create `apps/api/src/routes/kiosk.ts` with this endpoint:
  - `POST /api/events/:eventId/kiosk/auth` — authenticate with carId + registrationCode
    - No auth required
    - Path param: eventId
    - Body: `{ carId: number, registrationCode: string }`
    - Validation:
      1. Event exists and is currently checking in or voting (not before check-in, not after event ends)
      2. Find registration where event.id = eventId AND registration.carId = carId AND registration.registrationCode = registrationCode
      3. Registration must be checked-in (has carId assigned)
    - If found: call `createKioskToken(registration.id, eventId)` and return `{ token, expiresIn: 1800 }`
    - If not found: return 404 with message "Invalid car ID or registration code"
    - If event not in voting window: return 400 with message "Voting is not currently open"

### 4. Create kiosk ballot endpoints
- Add to `apps/api/src/routes/kiosk.ts`:
  - `GET /api/kiosk/event` — get event info for kiosk display
    - Requires kiosk auth
    - Returns: event name, votingEnd, votingStart, current time, voting categories (id, name, driversOnly, membersOnly)
    - Use `c.get('kioskEventId')` and `c.get('kioskRegistrationId')`
  - `GET /api/kiosk/ballots` — list ballots for this kiosk session's registration
    - Requires kiosk auth
    - Filter ballots where registrationId = `c.get('kioskRegistrationId')`
    - Return array of ballots with vote counts per category
  - `POST /api/kiosk/ballots` — create a new ballot
    - Requires kiosk auth
    - Validate ballot count limit for this registration at this event
    - Create ballot with registrationId and no clubMembershipId
    - Return new ballot with empty votes
  - `PUT /api/kiosk/ballots/:ballotId/votes` — cast or update votes
    - Requires kiosk auth
    - Validate ballotId belongs to authenticated kiosk registration
    - Body: array of `{ votingCategoryId, carId }`
    - For each vote: call `validateVote(eventId, ballot, votingCategoryId, carId)`
    - Delete existing votes for this ballot, insert new ones
    - Return updated ballot

### 5. Update vote validation for kiosk
- Update `apps/api/src/lib/vote-validation.ts` (from Session 13):
  - The `validateVote` function already works fine for kiosk — it takes eventId, ballot, category, carId
  - No changes needed; it validates registration check-in status via carId, which is already verified in kiosk auth

### 6. Mount kiosk routes
- Update `apps/api/src/index.ts`:
  - Mount kiosk router: `app.route('/api', kioskRouter)`
  - Place before or after ballots router (order doesn't matter)

### 7. Add environment variable
- Update `apps/api/.env.example` (and local .env if needed):
  - Add `KIOSK_JWT_SECRET=` (or document that it's derived from CLERK_SECRET_KEY if preferred)

## Files to Create/Modify

### Create:
- `apps/api/src/lib/kiosk-token.ts`
- `apps/api/src/middleware/kiosk-auth.ts`
- `apps/api/src/routes/kiosk.ts`

### Modify:
- `apps/api/src/index.ts` (mount router)
- `apps/api/.env.example` (add KIOSK_JWT_SECRET)

## Acceptance Criteria

- Kiosk auth endpoint accepts carId + registrationCode
- Valid credentials return JWT token with 30-min expiry
- Invalid credentials return 404
- Voting window check prevents auth if voting not open
- Kiosk JWT verifies correctly and injects registrationId + eventId into context
- Kiosk middleware returns 401 for missing/invalid/expired tokens
- GET /api/kiosk/event returns event info + voting categories
- GET /api/kiosk/ballots lists all ballots for the registration
- POST /api/kiosk/ballots creates new ballot and respects ballot count limit
- PUT /api/kiosk/ballots/:ballotId/votes casts votes with full validation
- All voting business rules enforced through kiosk routes (same as regular voting)
- Kiosk token cannot be used for other authenticated routes (different context key)
- High-traffic scenario works (no Clerk overhead, lightweight JWT verification)
- TypeScript compiles without errors
