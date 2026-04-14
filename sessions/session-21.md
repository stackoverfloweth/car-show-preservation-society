# Session 21 — Messaging System

## Dependencies
Session 05 (users)

## Branch
`session/21-messaging`

## Goal
Build the messaging system supporting event broadcasts (to all registrants), club broadcasts (to all members), and direct messages between drivers.

## Tasks
- Create messages schema in `packages/db/src/schema/messages.ts`:
  - id (text PK, nanoid)
  - eventId (FK → events.id, nullable)
  - clubId (FK → clubs.id, nullable)
  - fromUserId (FK → users.id)
  - toUserId (FK → users.id, nullable — if null + eventId, broadcast to all event registrants; if null + clubId, broadcast to all club members)
  - subject (text)
  - body (text)
  - sendDate (timestamp with timezone)
  - readDate (timestamp with timezone, nullable)
  - createdAt (timestamp with timezone)
- Business rules:
  - If eventId is set and toUserId is null: message to all registrants of event
  - If clubId is set and toUserId is null: message to all members of club
  - If toUserId is set: direct message
  - Event messages require club member permission (SEND_MESSAGES)
  - Club messages require club member permission (SEND_MESSAGES)
  - Direct messages can be sent by any authenticated user
- Create validation schema in `packages/shared/src/schemas/message.ts`
- Create `apps/api/src/routes/messages.ts` with endpoints:
  - `POST /api/messages` — send message (body: { eventId?, clubId?, toUserId?, subject, body })
  - `GET /api/messages/inbox` — list received messages for authenticated user (paginated, includes broadcasts for events/clubs user belongs to)
  - `GET /api/messages/:id` — read message (marks as read, sets readDate)
  - `GET /api/messages/sent` — list sent messages
  - `GET /api/events/:eventId/messages` — list event messages (club member view)
  - `GET /api/clubs/:clubId/messages` — list club messages (member view)

## Files to Create/Modify
Create:
- `packages/db/src/schema/messages.ts`
- `packages/shared/src/schemas/message.ts`
- `apps/api/src/routes/messages.ts`

Modify:
- `packages/db/src/schema/index.ts`
- `apps/api/src/index.ts`

## Acceptance Criteria
- Messages table exists with correct columns
- Direct messaging works
- Event broadcast messages work (delivered to all registrants)
- Club broadcast messages work (delivered to all members)
- Inbox shows both direct and broadcast messages
- Read tracking works
- Permission checks for event/club messages
