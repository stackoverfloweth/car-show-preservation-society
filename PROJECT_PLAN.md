# Car Show Preservation Society — Project Rebuild Plan

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 19 + TypeScript | Vite for build tooling |
| Routing | TanStack Router | File-based, type-safe routing |
| Data Fetching | TanStack Query | Cache, mutations, optimistic updates |
| Styling | Tailwind CSS 4 | Utility-first, design tokens for CSPS brand |
| Auth | Clerk | OAuth (Google, Apple, etc.), managed user profiles |
| Backend | Hono | Lightweight, type-safe API framework |
| ORM | Drizzle | Type-safe PostgreSQL queries, migrations |
| Database | PostgreSQL | Hosted on Railway |
| Payments | Stripe | Registration fees, cross-selling |
| Images | Cloudinary | Vehicle, event, club image uploads |
| Maps | Mapbox | Location search and display |
| Deployment | Railway | Backend + DB. Vercel or Railway static for frontend |

---

## Phase 0 — Project Scaffolding

### Task 0.1: Monorepo Setup
- Initialize pnpm workspace with `apps/` and `packages/` structure
- `apps/api` — Hono backend
- `apps/web` — React frontend
- `packages/shared` — Shared TypeScript types, validation schemas (Zod)
- Configure TypeScript project references across packages
- Set up ESLint + Prettier with shared config
- Add `.env.example` files with all required variables
- Initialize git with conventional commits config

### Task 0.2: Database & ORM Foundation
- Set up Drizzle with PostgreSQL driver (`postgres-js`)
- Create `drizzle.config.ts` with Railway connection
- Write initial migration scaffold (empty, just to prove the pipeline)
- Add `db:migrate`, `db:push`, `db:studio` scripts
- Set up Drizzle Studio for local dev inspection

### Task 0.3: Backend Skeleton
- Scaffold Hono app with modular route structure
- Set up middleware stack: CORS, request ID, logger, error handler
- Add Clerk middleware for JWT verification
- Create typed API response helpers (`ok()`, `created()`, `error()`)
- Add health check endpoint
- Configure Railway deployment (Dockerfile or nixpacks)
- Verify deployment pipeline works end-to-end

### Task 0.4: Frontend Skeleton
- Scaffold Vite + React + TypeScript project
- Install and configure TanStack Router (file-based routing)
- Install and configure TanStack Query
- Set up Clerk React provider with sign-in/sign-up flows
- Create root layout with basic navigation shell
- Add API client module (typed `fetch` wrapper pointing at Hono backend)
- Configure Tailwind CSS with CSPS design tokens (colors, typography)
- Verify frontend can authenticate and call a protected API endpoint

---

## Phase 1 — Core Data Model & User Management

### Task 1.1: User Schema & Sync with Clerk
- Define `users` table in Drizzle schema:
  - `id` (text, PK — maps to Clerk user ID)
  - `emailAddress`, `phoneNumber`, `firstName`, `lastName`
  - `location` (JSON or separate columns: placeName, latitude, longitude, mapboxId)
  - `profileImage` (text, URL)
  - `stripeCustomerId` (text, nullable)
  - `hideEmail`, `hidePhone`, `hideLocation` (boolean privacy flags)
  - `createdAt`, `updatedAt` timestamps
- Set up Clerk webhook endpoint in Hono to sync user creation/updates
- Create API routes:
  - `GET /api/users/:id` — public profile
  - `PUT /api/users/me` — update own profile
  - `GET /api/users/search` — search users by name/email
- Generate and run migration

### Task 1.2: Club Schema & CRUD
- Define `clubs` table:
  - `id` (text, PK — nanoid)
  - `name`, `description` (text)
  - `clubLogo` (text, URL, nullable)
  - `contactUserId` (text, FK → users)
  - `stripeCustomerId` (text, nullable)
  - `joinable` (boolean — can anyone join, or invitation only)
  - `visible` (boolean — listed publicly or not)
  - `createdAt`, `updatedAt`
- Create API routes:
  - `POST /api/clubs` — create club
  - `GET /api/clubs` — list clubs (public, with search/pagination)
  - `GET /api/clubs/:id` — get club details
  - `PUT /api/clubs/:id` — update club (requires club admin permission)
  - `DELETE /api/clubs/:id` — soft delete

### Task 1.3: Club Membership & Permissions
- Define `clubMemberships` table:
  - `id` (text, PK)
  - `clubId` (FK → clubs)
  - `userId` (FK → users)
  - `permissions` (text[] — e.g., "create_events", "manage_members", "start_voting", "end_voting", "bypass_registration", "create_voting_category")
  - `isPrimary` (boolean)
  - `createdAt`
- Define `clubInvitations` table:
  - `id`, `clubId`, `emailAddress`, `permissions`, `createdAt`, `acceptedAt`
- Define `clubApplications` table:
  - `id`, `clubId`, `userId`, `message`, `status` (pending/approved/denied), `createdAt`, `reviewedAt`
- Create API routes for membership management:
  - `POST /api/clubs/:id/members` — add member / accept invite
  - `GET /api/clubs/:id/members` — list members
  - `PUT /api/clubs/:id/members/:memberId` — update permissions
  - `DELETE /api/clubs/:id/members/:memberId` — remove member
  - `POST /api/clubs/:id/invitations` — invite by email
  - `POST /api/clubs/:id/applications` — apply to join
  - `PUT /api/clubs/:id/applications/:appId` — approve/deny
- Build authorization middleware that resolves club permissions from membership

### Task 1.4: Vehicle Schema & CRUD
- Define `vehicles` table:
  - `id` (text, PK)
  - `userId` (FK → users)
  - `make`, `model`, `year`, `description`, `color` (text, all nullable)
  - `modificationCount` (integer, nullable)
  - `modifiedAppearance` (boolean, nullable)
  - `createdAt`, `updatedAt`
- Define `vehicleImages` table:
  - `id`, `vehicleId` (FK), `source` (text — Cloudinary URL), `createdAt`
- Create API routes:
  - `POST /api/vehicles` — create vehicle
  - `GET /api/vehicles` — list own vehicles ("My Garage")
  - `GET /api/vehicles/:id` — get vehicle detail (public)
  - `PUT /api/vehicles/:id` — update (owner only)
  - `DELETE /api/vehicles/:id` — soft delete
  - `POST /api/vehicles/:id/images` — upload image via Cloudinary
  - `DELETE /api/vehicles/:id/images/:imageId` — remove image

---

## Phase 2 — Events & Registration

### Task 2.1: Event Schema & CRUD
- Define `events` table:
  - `id` (text, PK)
  - `clubId` (FK → clubs)
  - `contactUserId` (FK → users)
  - `name` (text)
  - `location` (JSON — placeName, lat, lng, mapboxId)
  - `start`, `end` (timestamp with timezone)
  - `votingStart`, `votingEnd` (timestamp, nullable — see PDF notes on manual triggers)
  - `maxCapacity` (integer, nullable)
  - `stripePriceId` (text, nullable — registration cost)
  - `preRegistration` (boolean, default true)
  - `preRegistrationStripePriceId` (text, nullable)
  - `preRegistrationUnpaid` (boolean — can register without paying ahead)
  - `ballotCount` (integer, default 1)
  - `canVoteForSelf` (boolean, default false)
  - `driverSelfCategorization` (boolean, default false)
  - `maxSelfCategorization` (integer, nullable)
  - `stripeCrossProductIds` (text[] — Stripe products shown at checkout)
  - `status` (enum: draft, upcoming, active, voting, completed)
  - `createdAt`, `updatedAt`
- Define `eventImages` table: `id`, `eventId` (FK), `source`, `createdAt`
- Create API routes:
  - `POST /api/events` — create event (club member with permission)
  - `GET /api/events` — list events (filterable: upcoming, by club, by location radius)
  - `GET /api/events/:id` — event detail
  - `PUT /api/events/:id` — update event
  - `DELETE /api/events/:id` — cancel/soft delete
  - `POST /api/events/:id/images` — upload
  - `PUT /api/events/:id/voting/start` — manually trigger voting start
  - `PUT /api/events/:id/voting/end` — manually trigger voting end
- Derive event status from dates: draft (no dates), upcoming (future start), active (between start/end), voting (between votingStart/votingEnd), completed (past end)

### Task 2.2: Voting Categories
- Define `votingCategories` table:
  - `id` (text, PK)
  - `eventId` (FK → events)
  - `name`, `description` (text)
  - `maxCapacity` (integer, nullable)
  - `driversOnly` (boolean — only ballots with registrationId can vote)
  - `membersOnly` (boolean — only ballots with clubMembershipId can vote)
  - `automaticEntry` (boolean — auto-assign on registration)
  - `featured` (boolean)
  - `stripePriceId` (text, nullable — extra cost for this category)
  - `createdAt`
- Define `votingCategoryRegistrations` table:
  - `id`, `votingCategoryId` (FK), `registrationId` (FK), `createdAt`
  - Immutable after event.votingStart
- Create API routes:
  - `POST /api/events/:id/voting-categories` — create
  - `GET /api/events/:id/voting-categories` — list with current capacity counts
  - `PUT /api/voting-categories/:id` — update
  - `DELETE /api/voting-categories/:id` — remove
  - `POST /api/voting-categories/:id/registrations` — assign car to category
  - `DELETE /api/voting-categories/:id/registrations/:regId` — unassign

### Task 2.3: Registration System
- Define `registrations` table:
  - `id` (text, PK)
  - `eventId` (FK → events)
  - `userId` (FK → users, nullable — supports anonymous gate registration)
  - `vehicleId` (FK → vehicles, nullable — immutable after votingStart)
  - `registrationCode` (text, unique — human-readable backup to QR)
  - `registrationDate` (timestamp)
  - `carId` (integer, nullable — assigned at check-in, unique per event)
  - `checkedInAt` (timestamp, nullable)
  - `stripePaymentId` (text, nullable — null means unpaid/cash)
  - `createdAt`
- Create API routes:
  - `POST /api/events/:id/registrations` — pre-register (driver self-service)
  - `POST /api/events/:id/registrations/gate` — gate registration (club member, host-mode)
  - `GET /api/events/:id/registrations` — list registrations (with search)
  - `GET /api/registrations/:id` — registration detail
  - `PUT /api/registrations/:id` — update (assign vehicle, etc.)
  - `PUT /api/registrations/:id/check-in` — check in, auto-assign next carId
  - `GET /api/registrations/:id/qr` — generate QR code data
- Generate `registrationCode` as short alphanumeric (e.g., 6 chars)
- Auto-increment `carId` per event on check-in
- Enforce maxCapacity if set
- Enforce immutability of vehicleId after votingStart

### Task 2.4: QR Code & Check-in Flow
- Add QR code generation library (`qrcode` npm package)
- Generate QR containing registration URL: `https://csps.com/registrations/:id`
- Build check-in API that:
  - Validates registration exists and belongs to event
  - Assigns next sequential `carId` for the event
  - Marks `checkedInAt` timestamp
  - Returns confirmation with carId
- Support lookup by `registrationCode` as fallback to QR

---

## Phase 3 — Voting & Results

### Task 3.1: Ballot System
- Define `ballots` table:
  - `id` (text, PK)
  - `registrationId` (FK, nullable — driver ballot)
  - `clubMembershipId` (FK, nullable — member ballot, for "club choice" etc.)
  - Constraint: exactly one of registrationId or clubMembershipId must be set
  - `createdDate` (timestamp)
- Define `ballotVotingCategories` table:
  - `id` (text, PK)
  - `ballotId` (FK → ballots)
  - `votingCategoryId` (FK → votingCategories)
  - `carId` (integer — the car being voted for)
  - `disqualified` (boolean, default false)
  - `createdAt`, `updatedAt`
  - Immutable after event.votingEnd
- Create API routes:
  - `POST /api/registrations/:id/ballots` — create ballot (system creates on demand)
  - `GET /api/ballots/:id` — get ballot with votes
  - `PUT /api/ballots/:id/votes` — cast/update votes (array of {votingCategoryId, carId})
  - `POST /api/ballots/:id/share` — share ballot via email/phone (generates guest ballot)
  - `PUT /api/ballots/:id/disqualify` — club member disqualifies a vote
- Enforce voting window (between votingStart and votingEnd)
- Enforce `canVoteForSelf` rule
- Enforce `driversOnly` / `membersOnly` per voting category
- Enforce ballot count limits per registration
- Validate carId exists as checked-in registration at event

### Task 3.2: Guest Voting (Shared Ballots)
- When a driver shares a ballot, system:
  - Validates driver hasn't exceeded their ballot count
  - Creates a new ballot record linked to original registration
  - Generates a unique URL with ballotId in query string
  - Sends link via email or SMS (Twilio integration or simple email)
- Guest can complete ballot without authentication
- Guest ballot URL: `https://csps.com/vote/guest/:ballotId`

### Task 3.3: Voting Mode (Kiosk)
- Build a "voting mode" frontend view
- Driver enters carId + registrationCode to authenticate
- Displays their ballot(s) with voting categories
- Each category: enter carId or scan QR code of the car they want to vote for
- Optimized for iPad/tablet use at events
- No authentication required — registrationCode acts as passcode

### Task 3.4: Voting Results & Placements
- Define `votingResults` table:
  - `id` (text, PK)
  - `eventId` (FK)
  - `votingCategoryId` (FK)
  - `registrationId` (FK — the winner)
  - `place` (integer — 1st, 2nd, 3rd, etc.)
  - `voteCount` (integer)
  - `createdAt`
- Create API routes:
  - `POST /api/events/:id/results/calculate` — tally votes, generate results (club member)
  - `GET /api/events/:id/results` — get results by event
  - `GET /api/events/:id/results/by-category/:categoryId` — results per category
  - `GET /api/users/:id/placements` — historical placements for a user
- Tally logic: count non-disqualified ballotVotingCategories per carId per category
- Handle ties
- Support "must be present to win" configuration

---

## Phase 4 — Payments (Stripe Integration)

### Task 4.1: Stripe Foundation
- Set up Stripe SDK in backend
- Create Stripe webhook endpoint for payment events
- Implement `stripeCustomerId` creation/linking for users and clubs
- Build helper functions:
  - Create checkout session for registration
  - Create checkout session with cross-sell products
  - Retrieve payment status
  - Issue refunds

### Task 4.2: Registration Payment Flow
- Pre-registration checkout:
  - Use `preRegistrationStripePriceId` if before event start
  - Use `stripePriceId` if at event / day-of
  - Include optional `stripeCrossProductIds` as line items
  - Support `preRegistrationUnpaid` (register now, pay at gate)
- Webhook handlers:
  - `checkout.session.completed` → update registration `stripePaymentId`
  - `payment_intent.payment_failed` → mark registration payment failed
- Gate registration: support marking as "cash" payment (no Stripe)

### Task 4.3: Voting Category Premium Registration
- If a voting category has a `stripePriceId`, charge extra when driver selects it
- Add to checkout session as additional line item
- Track payment per voting category registration

---

## Phase 5 — Images & Media

### Task 5.1: Cloudinary Integration
- Set up Cloudinary SDK in backend
- Build generic image upload endpoint:
  - Accept image file
  - Upload to Cloudinary with appropriate folder/tags
  - Return Cloudinary URL + metadata
- Build image deletion endpoint
- Support image uploads for: vehicles, events, clubs, user profiles
- Add image pagination for entities with galleries

---

## Phase 6 — Messaging & Notifications

### Task 6.1: Messaging System
- Define `messages` table:
  - `id`, `eventId` (nullable), `clubId` (nullable)
  - `fromUserId` (FK)
  - `toUserId` (FK, nullable — if null, broadcast to all event registrants or club members)
  - `subject`, `body` (text)
  - `sendDate`, `readDate` (timestamp)
  - `createdAt`
- Create API routes:
  - `POST /api/messages` — send message (event broadcast, club broadcast, or direct)
  - `GET /api/messages` — inbox (list received messages)
  - `GET /api/messages/:id` — read message (marks as read)
  - Event messages: notify all registrants
  - Club messages: notify all members
  - Direct messages: between drivers (e.g., with votes)

### Task 6.2: Notification Subscriptions
- Define `clubSubscriptions` table:
  - `id`, `emailAddress`, `clubId`, `createdAt`
  - No auth required — anonymous subscription
- Define `userSearchSubscriptions` table:
  - `id`, `userId`
  - `radiusMiles` (integer)
  - `location` (JSON)
  - `clubId` (nullable — filter by specific club)
  - `createdAt`
- Create subscribe/unsubscribe API routes
- Build notification dispatch (email via Resend or SendGrid, SMS via Twilio)

### Task 6.3: Automated Event Notifications
- When voting starts: auto-send event message to all registrants
- When voting end approaches: send reminder
- When results are calculated: send results notification
- Implement as background jobs or scheduled tasks on Railway (cron)

---

## Phase 7 — Advertisements & Sponsors

### Task 7.1: Sponsor Management
- Define `eventSponsors` table:
  - `id`, `eventId` (FK), `name`, `imageUrl`, `linkUrl`, `googleAdId` (nullable), `createdAt`
- Define `clubSponsors` table:
  - `id`, `clubId` (FK), `name`, `imageUrl`, `linkUrl`, `googleAdId` (nullable), `createdAt`
- Create CRUD API routes for both
- Club members manage their own sponsors

---

## Phase 8 — Frontend Implementation

### Task 8.1: Layout & Navigation Shell
- Build responsive app layout:
  - Top nav: logo, search, auth (Clerk UserButton)
  - Mobile bottom nav
  - Sidebar for authenticated users
- Route structure:
  - `/` — home (today's events, nearby events)
  - `/login`, `/signup` — Clerk sign-in/sign-up
  - `/events` — browse events
  - `/events/:id` — event detail
  - `/clubs` — browse clubs
  - `/clubs/:id` — club detail
  - `/garage` — my vehicles
  - `/profile` — my profile

### Task 8.2: Auth & User Profile Pages
- Sign in / sign up via Clerk components
- Profile editor: personal info, location (Mapbox search), privacy toggles
- Public profile view with placement history

### Task 8.3: Club Pages
- Club listing with search
- Club detail page: info, members, events, images
- Club creation form
- Club editor (for admins): general info, members, invitations, applications
- Join club / apply to club flow

### Task 8.4: Vehicle / Garage Pages
- "My Garage" — list of user's vehicles with images
- Vehicle detail page (public)
- Vehicle editor: make/model/year/color/description, modifications, image gallery
- Add vehicle form

### Task 8.5: Event Pages
- Event listing with filters (upcoming, by club, by location radius via Mapbox)
- Event detail page:
  - Info, location map, schedule, voting categories
  - Registration CTA (if pre-registration open)
  - Sponsors section
  - Results (if event completed)
- Event creation wizard (multi-step):
  - General info (name, dates, location)
  - Registration settings (pricing, capacity, pre-registration)
  - Judging setup (voting categories, ballot rules)
  - Sponsors
  - Preview & publish

### Task 8.6: Registration & Check-in Pages
- Pre-registration flow:
  - Select vehicle from garage (or skip)
  - Select voting categories (if driverSelfCategorization)
  - Payment via Stripe Checkout (or mark as pay-at-gate)
  - Confirmation with QR code
- Gate registration (host mode):
  - Simplified form for club member to register arriving drivers
  - Quick check-in with carId assignment
  - Print-friendly page with QR code and carId
- Registrations list for event organizers with search and check-in controls

### Task 8.7: Voting Pages
- Ballot view for authenticated drivers:
  - List voting categories
  - Enter carId or scan QR per category
  - Submit / update votes
  - Share ballot option
- Voting mode (kiosk):
  - Enter carId + registrationCode
  - Complete ballot on shared device
  - Large, touch-friendly UI
- Guest ballot page (from shared link)

### Task 8.8: Results & History Pages
- Event results page: winners by category with car/driver info
- User placement history: all awards across events
- Club event history with results

### Task 8.9: Messaging Pages
- Inbox view
- Message detail / conversation
- Compose message (to event registrants, club members, or individual)

---

## Phase 9 — Maps & Location

### Task 9.1: Mapbox Integration
- Set up Mapbox GL JS in frontend
- Build location search component (geocoding API)
- Display event locations on map in event listing
- Store locations as structured data (placeName, lat, lng, mapboxId)
- Location-based event search (radius query)

---

## Phase 10 — Polish & Production Readiness

### Task 10.1: Error Handling & Loading States
- Global error boundary
- API error handling with user-friendly messages
- Skeleton loading states for all data-driven pages
- Optimistic updates for common mutations

### Task 10.2: SEO & Performance
- Meta tags for public pages (events, clubs, profiles)
- Image optimization (Cloudinary transforms)
- Code splitting by route
- Lighthouse audit and fixes

### Task 10.3: Testing
- API integration tests for critical flows (registration, voting, payments)
- Frontend component tests for complex UI (ballot, registration form)
- E2E tests for happy paths (Playwright)

### Task 10.4: Deployment & DevOps
- Railway production setup:
  - PostgreSQL database with backups
  - Hono API service with auto-deploy from main branch
  - Environment variable management
- Frontend deployment (Vercel or Railway static)
- Custom domain setup (csps.com)
- CI/CD pipeline (GitHub Actions):
  - Lint, type-check, test on PR
  - Auto-deploy on merge to main
- Database migration strategy for production

---

## Task Summary by Session

Below is a suggested breakdown into discrete Claude Code sessions. Each session targets a coherent unit of work that can be completed independently and tested.

| Session | Tasks | Est. Effort | Dependencies |
|---------|-------|-------------|-------------|
| 1 | 0.1 Monorepo Setup | Medium | None |
| 2 | 0.2 Database & ORM Foundation | Small | Session 1 |
| 3 | 0.3 Backend Skeleton | Medium | Session 1 |
| 4 | 0.4 Frontend Skeleton | Medium | Session 1 |
| 5 | 1.1 User Schema & Clerk Sync | Medium | Sessions 2, 3 |
| 6 | 1.2 Club Schema & CRUD | Medium | Session 5 |
| 7 | 1.3 Club Membership & Permissions | Large | Session 6 |
| 8 | 1.4 Vehicle Schema & CRUD | Medium | Session 5 |
| 9 | 2.1 Event Schema & CRUD | Large | Session 6 |
| 10 | 2.2 Voting Categories | Medium | Session 9 |
| 11 | 2.3 Registration System | Large | Session 9 |
| 12 | 2.4 QR Code & Check-in Flow | Medium | Session 11 |
| 13 | 3.1 Ballot System | Large | Sessions 10, 11 |
| 14 | 3.2 Guest Voting | Medium | Session 13 |
| 15 | 3.3 Voting Mode (Kiosk) | Medium | Session 13 |
| 16 | 3.4 Voting Results & Placements | Medium | Session 13 |
| 17 | 4.1 Stripe Foundation | Medium | Session 3 |
| 18 | 4.2 Registration Payment Flow | Large | Sessions 11, 17 |
| 19 | 4.3 Voting Category Payments | Small | Sessions 10, 17 |
| 20 | 5.1 Cloudinary Integration | Medium | Session 3 |
| 21 | 6.1 Messaging System | Medium | Session 5 |
| 22 | 6.2 Notification Subscriptions | Medium | Session 21 |
| 23 | 6.3 Automated Event Notifications | Medium | Session 22 |
| 24 | 7.1 Sponsor Management | Small | Session 9 |
| 25 | 8.1 Layout & Navigation Shell | Medium | Session 4 |
| 26 | 8.2 Auth & User Profile Pages | Medium | Sessions 5, 25 |
| 27 | 8.3 Club Pages | Large | Sessions 6, 7, 25 |
| 28 | 8.4 Vehicle / Garage Pages | Medium | Sessions 8, 20, 25 |
| 29 | 8.5 Event Pages | Large | Sessions 9, 24, 25 |
| 30 | 8.6 Registration & Check-in Pages | Large | Sessions 11, 12, 18, 25 |
| 31 | 8.7 Voting Pages | Large | Sessions 13, 14, 15, 25 |
| 32 | 8.8 Results & History Pages | Medium | Sessions 16, 25 |
| 33 | 8.9 Messaging Pages | Medium | Sessions 21, 25 |
| 34 | 9.1 Mapbox Integration | Medium | Sessions 9, 25 |
| 35 | 10.1 Error Handling & Loading States | Medium | All frontend |
| 36 | 10.2 SEO & Performance | Medium | All frontend |
| 37 | 10.3 Testing | Large | All |
| 38 | 10.4 Deployment & DevOps | Medium | All |

---

## Critical Path

The fastest route to a working demo follows this dependency chain:

```
Session 1 (monorepo) 
  → Sessions 2+3+4 (can be parallel: DB, backend, frontend)
    → Session 5 (users)
      → Sessions 6+8 (parallel: clubs, vehicles)
        → Session 7 (memberships)
          → Session 9 (events)
            → Sessions 10+11 (parallel: categories, registration)
              → Session 12 (check-in)
                → Session 13 (ballots)
                  → Session 16 (results)
```

This gives you the core event flow in ~16 sessions. Payments, images, messaging, and frontend pages can be parallelized alongside backend work once the data model is in place.

---

## Open Design Decisions (from PDF)

These questions from the original spec should be resolved as we build:

1. **Revenue model**: Charge per registration ($1-2)? Club subscription? Per-event fee? The Stripe integration is flexible enough to support any of these.
2. **Offline voting**: The kiosk/voting-mode feature partially addresses poor cell service. Full offline support would require a PWA with local storage sync — consider as a post-MVP enhancement.
3. **Permanent driver plaques**: The `vehicleId`-based QR code concept (route: `/vote/:vehicleId`) is elegant. System looks up active events where that vehicle is checked in. Build this in Phase 3.
4. **Events without voting**: Supported — set `ballotCount` to 0. The UI should gracefully hide voting UI.
5. **Clubs are required**: Per the spec, events are owned by clubs. A solo user creates a "club" (even if it's just them) to host events. The UI should make this feel lightweight.
6. **Historical data**: Past events, registrations, and results are retained indefinitely. User profile shows placement history.
