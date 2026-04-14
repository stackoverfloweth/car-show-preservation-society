# Session 09 — Event Schema & CRUD

## Dependencies
Session 06 (clubs)

## Branch
`session/09-events`

## Goal
Define the events table with all its configuration fields (voting windows, pricing, capacity, ballot settings), build CRUD API routes gated by club permissions, and implement event status derivation from dates. The event schema is the core of the event management system.

## Tasks

1. **Create the events table schema** (`packages/db/src/schema/events.ts`):
   - Basic fields: id (nanoid), name (text), location (jsonb), startDate (timestamp), endDate (timestamp)
   - Club & contact: clubId (FK → clubs.id), contactUserId (FK → users.id)
   - Voting configuration:
     - votingStart (timestamp, nullable — for manual trigger support)
     - votingEnd (timestamp, nullable — for manual trigger support)
     - ballotCount (integer, default 1)
     - canVoteForSelf (boolean, default false)
     - driverSelfCategorization (boolean, default false)
     - maxSelfCategorization (integer, nullable)
   - Registration configuration:
     - maxCapacity (integer, nullable)
     - preRegistration (boolean, default true)
     - preRegistrationUnpaid (boolean, default false)
   - Payment fields:
     - stripePriceId (text, nullable)
     - preRegistrationStripePriceId (text, nullable)
     - stripeCrossProductIds (text array, default empty)
   - Metadata: createdAt, updatedAt
   - Add indexes on clubId, startDate, and a composite (clubId, startDate) for efficient queries

2. **Create the event_images table schema** (`packages/db/src/schema/event-images.ts`):
   - id (nanoid)
   - eventId (FK → events.id)
   - source (text — URL to Cloudinary image)
   - createdAt
   - Add index on eventId

3. **Create Zod validation schema** (`packages/shared/src/schemas/event.ts`):
   - Export `CreateEventSchema`, `UpdateEventSchema`, `EventSchema` (full read model)
   - Validate location structure (object with address, lat, lng)
   - Ensure votingStart < votingEnd if both are set
   - Ensure startDate < endDate
   - Ensure preRegistrationUnpaid only true if preRegistration is true

4. **Create event status constants** (`packages/shared/src/constants/event-status.ts`):
   - Export `EVENT_STATUS` enum with values: 'draft', 'upcoming', 'active', 'voting', 'completed'
   - Export helper function `deriveEventStatus(event: Event): EVENT_STATUS` that:
     - Returns 'draft' if startDate is not set or far in future AND no registrations exist
     - Returns 'completed' if now > endDate
     - Returns 'voting' if votingStart ≤ now ≤ votingEnd (subset of active)
     - Returns 'active' if startDate ≤ now ≤ endDate
     - Returns 'upcoming' if now < startDate

5. **Create API routes** (`apps/api/src/routes/events.ts`):
   - `POST /api/clubs/:clubId/events` — Create event (requires CREATE_EVENTS permission on club)
     - Body: Zod-validated CreateEventSchema
     - Returns: Created event with derived status
   - `GET /api/events` — List all events (public)
     - Query filters: status (draft|upcoming|active|voting|completed), clubId, startDate/endDate range, location (lat/lng/radiusKm for radius search)
     - Returns: Array of events with derived status
   - `GET /api/events/:id` — Event detail (public)
     - Returns: Full event with images array and derived status
   - `PUT /api/events/:id` — Update event (requires CREATE_EVENTS permission on event's club)
     - Body: Zod-validated UpdateEventSchema
     - Restrictions: Cannot change clubId, cannot change startDate/endDate after voting has started
     - Returns: Updated event
   - `DELETE /api/events/:id` — Soft delete (requires CREATE_EVENTS permission)
     - Set deletedAt timestamp instead of hard delete
   - `POST /api/events/:id/images` — Add image to event (requires CREATE_EVENTS permission)
     - Body: { source: string (Cloudinary URL) }
     - Returns: Created image record
   - `DELETE /api/events/:id/images/:imageId` — Remove image (requires CREATE_EVENTS permission)
     - Soft delete via deletedAt timestamp
   - `PUT /api/events/:id/voting/start` — Manually start voting (requires MANAGE_VOTING permission)
     - Sets votingStart to now if not already set, or clears it if it was a future date
     - Validation: voting window must not have ended
     - Returns: Updated event
   - `PUT /api/events/:id/voting/end` — Manually end voting (requires MANAGE_VOTING permission)
     - Sets votingEnd to now
     - Returns: Updated event

6. **Location radius filtering**:
   - Implement in GET /api/events list endpoint
   - Use PostGIS point geometry if available, or approximate distance using lat/lng
   - Query parameter: `lat`, `lng`, `radiusKm` (all optional, all or none)
   - Return events within radius, sorted by distance

7. **Update schema index** (`packages/db/src/schema/index.ts`):
   - Export new tables: events, eventImages

8. **Mount routes** (`apps/api/src/index.ts`):
   - Import and mount the events router

## Files to Create/Modify

### Create:
- `packages/db/src/schema/events.ts`
- `packages/db/src/schema/event-images.ts`
- `packages/shared/src/schemas/event.ts`
- `packages/shared/src/constants/event-status.ts`
- `apps/api/src/routes/events.ts`

### Modify:
- `packages/db/src/schema/index.ts` (add exports)
- `apps/api/src/index.ts` (mount routes)

## Acceptance Criteria

- Events and event_images tables exist in PostgreSQL with correct schema
- All CRUD operations work correctly
- CREATE and UPDATE are gated by CREATE_EVENTS permission on the event's club
- Event status is correctly derived from dates and registration count
- Manual voting start/end triggers work and set timestamps correctly
- Location radius filtering works on list endpoint (returns events within radius, ordered by distance)
- All endpoints validate input with Zod schemas
- Soft deletes work (deletedAt timestamp set, not hard delete)
- Status constant values match the derivation logic
