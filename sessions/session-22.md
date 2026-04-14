# Session 22 — Notification Subscriptions

## Dependencies
Session 21 (messaging)

## Branch
`session/22-subscriptions`

## Goal
Build the subscription system for anonymous club subscriptions and user search-based subscriptions, plus the email/SMS dispatch layer.

## Tasks
- Create club subscriptions schema in `packages/db/src/schema/club-subscriptions.ts`:
  - id (text PK, nanoid)
  - emailAddress (text)
  - clubId (FK → clubs.id)
  - createdAt (timestamp with timezone)
  - No auth required — anyone can subscribe with an email
- Create user search subscriptions schema in `packages/db/src/schema/user-search-subscriptions.ts`:
  - id (text PK, nanoid)
  - userId (FK → users.id)
  - radiusMiles (integer)
  - location (jsonb — placeName, lat, lng)
  - clubId (FK → clubs.id, nullable — filter to specific club)
  - createdAt (timestamp with timezone)
- Create validation schemas in `packages/shared/src/schemas/subscription.ts`
- Set up email dispatch service:
  - Create `apps/api/src/lib/email.ts` if not already created
  - Use Resend (or another email service). Abstract behind an interface so provider can be swapped.
  - `sendEmail(to, subject, body)` — basic email sending
  - `sendBulkEmail(recipients[], subject, body)` — batch sending for broadcasts
- Optionally set up SMS via Twilio:
  - Create `apps/api/src/lib/sms.ts` — `sendSms(to, body)`
  - Can be a stub/placeholder if Twilio isn't set up yet
- Create `apps/api/src/routes/subscriptions.ts` with endpoints:
  - `POST /api/clubs/:clubId/subscribe` — anonymous subscribe (email only, no auth)
  - `DELETE /api/clubs/:clubId/subscribe/:email` — unsubscribe
  - `GET /api/clubs/:clubId/subscribers` — list subscribers (club member only)
  - `POST /api/subscriptions/search` — create search subscription (auth required)
  - `GET /api/subscriptions/search` — list own search subscriptions
  - `DELETE /api/subscriptions/search/:id` — remove subscription
- Build notification dispatch logic:
  - When a club creates a new event, notify all club subscribers
  - When an event matches a user's search subscription (location + radius), notify them
  - This can be triggered synchronously on event creation or as a background job

## Files to Create/Modify
Create:
- `packages/db/src/schema/club-subscriptions.ts`
- `packages/db/src/schema/user-search-subscriptions.ts`
- `packages/shared/src/schemas/subscription.ts`
- `apps/api/src/routes/subscriptions.ts`
- `apps/api/src/lib/email.ts` (if not exists)
- `apps/api/src/lib/sms.ts`

Modify:
- `packages/db/src/schema/index.ts`
- `apps/api/src/index.ts`

## Acceptance Criteria
- Both subscription tables exist
- Anonymous club subscription works (no auth)
- Search subscription creation/deletion works
- Email sending function works (or is properly stubbed)
- Notifications dispatched on new event creation
- Club members can view subscriber list
