# Session 24 — Sponsor Management

## Dependencies
Session 09 (events API)

## Branch
`session/24-sponsors`

## Goal
Build CRUD operations for event sponsors and club sponsors. Sponsors are displayed on event and club pages and can be sized (small, medium, large). Sponsorship records link to Google Ad IDs for tracking and include image/link metadata.

## Tasks
1. Create event-sponsors table schema in `packages/db/src/schema/event-sponsors.ts`:
   - Columns: id (text, pk), eventId (text, fk → events.id), name (text), imageUrl (text, nullable), linkUrl (text, nullable), googleAdId (text, nullable), size (text enum: 'small'|'medium'|'large', nullable), createdAt (timestamp with tz)
   - Add relation to events table

2. Create club-sponsors table schema in `packages/db/src/schema/club-sponsors.ts`:
   - Columns: id (text, pk), clubId (text, fk → clubs.id), name (text), imageUrl (text, nullable), linkUrl (text, nullable), googleAdId (text, nullable), size (text enum: 'small'|'medium'|'large', nullable), createdAt (timestamp with tz)
   - Add relation to clubs table

3. Create Zod validation schemas in `packages/shared/src/schemas/sponsor.ts`:
   - SponsorInsert schema (name required, all URLs/googleAdId optional, size optional)
   - SponsorUpdate schema (name optional, others optional)
   - SponsorResponse schema (includes id and createdAt)

4. Create API routes in `apps/api/src/routes/sponsors.ts`:
   - POST /api/events/:eventId/sponsors — create event sponsor (requires MANAGE_SPONSORS permission)
   - GET /api/events/:eventId/sponsors — list event sponsors (public)
   - PUT /api/event-sponsors/:id — update event sponsor (permission check)
   - DELETE /api/event-sponsors/:id — delete event sponsor (permission check)
   - POST /api/clubs/:clubId/sponsors — create club sponsor (requires MANAGE_SPONSORS permission)
   - GET /api/clubs/:clubId/sponsors — list club sponsors (public)
   - PUT /api/club-sponsors/:id — update club sponsor (permission check)
   - DELETE /api/club-sponsors/:id — delete club sponsor (permission check)

5. Update `packages/db/src/schema/index.ts` to export both sponsor tables

6. Update `apps/api/src/index.ts` to mount the sponsors router

7. Add sponsor-related permission constants to `packages/shared/src/constants/permissions.ts` if needed

## Files to Create/Modify
**Create:**
- `/Users/evansutherland/Development/car-show-preservation-society/packages/db/src/schema/event-sponsors.ts`
- `/Users/evansutherland/Development/car-show-preservation-society/packages/db/src/schema/club-sponsors.ts`
- `/Users/evansutherland/Development/car-show-preservation-society/packages/shared/src/schemas/sponsor.ts`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/api/src/routes/sponsors.ts`

**Modify:**
- `/Users/evansutherland/Development/car-show-preservation-society/packages/db/src/schema/index.ts`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/api/src/index.ts`

## Acceptance Criteria
- Both eventSponsors and clubSponsors tables exist in the database after migration
- All six CRUD endpoints return correct responses
- Write operations (POST, PUT, DELETE) are properly permission-gated (require MANAGE_SPONSORS)
- Read operations (GET) are public and list sponsors correctly
- Zod validation rejects invalid size values
- Nullable fields work correctly (imageUrl, linkUrl, googleAdId can be null)
- Tests pass: can create → read → update → delete sponsors for both event and club
