# Session 37 — Testing

## Dependencies
All sessions (01–36)

## Branch
`session/37-testing`

## Goal
Set up comprehensive test infrastructure and write integration/component tests for critical business logic: registration flow, voting system, payment webhooks, permission checks, and key frontend interactions. Ensure the system is reliable before production deployment.

## Tasks

1. Set up test infrastructure:
   - Install Vitest in `apps/api`:
     - Run `pnpm add -D vitest @vitest/ui`
     - Create `apps/api/vitest.config.ts`:
       ```typescript
       import { defineConfig } from 'vitest/config';
       
       export default defineConfig({
         test: {
           environment: 'node',
           globals: true,
           setupFiles: ['./src/test/setup.ts'],
         },
       });
       ```
   
   - Install Vitest in `apps/web`:
     - Run `pnpm add -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event`
     - Create `apps/web/vitest.config.ts`:
       ```typescript
       import { defineConfig } from 'vitest/config';
       import react from '@vitejs/plugin-react';
       import path from 'path';
       
       export default defineConfig({
         plugins: [react()],
         test: {
           environment: 'jsdom',
           globals: true,
           setupFiles: ['./src/test/setup.ts'],
         },
         resolve: {
           alias: {
             '@': path.resolve(__dirname, './src'),
           },
         },
       });
       ```
   
   - Create test database setup at `apps/api/src/test/setup.ts`:
     - Import test database connection (separate from production)
     - Run migrations on test DB before all tests
     - Provide cleanup hook to reset database between tests
     - Use PostgreSQL test container or separate test database
   
   - Create test factories at `apps/api/src/test/factories.ts`:
     - `createTestUser(overrides?)` — insert user, return user object
     - `createTestClub(userId, overrides?)` — insert club + membership, return club
     - `createTestEvent(clubId, overrides?)` — insert event, return event
     - `createTestVotingCategory(eventId, overrides?)` — insert category, return category
     - `createTestRegistration(eventId, userId?, overrides?)` — insert registration, return registration
     - `createTestBallot(registrationId, overrides?)` — insert ballot, return ballot
     - `createTestVote(ballotId, categoryId, carId, overrides?)` — insert vote, return vote
     - All factories accept overrides to customize defaults
   
   - Create frontend test setup at `apps/web/src/test/setup.ts`:
     - Import `@testing-library/jest-dom`
     - Setup `vitest` global mocking for TanStack Query, Clerk, etc.
     - Configure server mocking with MSW (Mock Service Worker) if needed
   
   - Add npm scripts:
     - `apps/api/package.json`: `"test": "vitest run"`, `"test:watch": "vitest"`
     - `apps/web/package.json`: `"test": "vitest run"`, `"test:watch": "vitest"`
     - Root `package.json`: `"test": "pnpm --filter '*' test"`

2. Backend integration tests in `apps/api/src/__tests__/`:
   - Create `registration.test.ts`:
     - Test: Pre-registration creates registration with unique code
     - Test: Gate registration (no userId) is allowed for non-drivers
     - Test: Check-in assigns sequential carId (1, 2, 3...)
     - Test: Check-in fails if registration doesn't exist
     - Test: Exceeding maxCapacity prevents new registrations
     - Test: vehicleId immutable after votingStart timestamp
     - Test: Event status "Registered" when pre-registration is active
     - Test: Event status transitions from "Registered" to "Open" at votingStart
   
   - Create `voting.test.ts`:
     - Test: Ballot creation respects ballotCount limit per registration
     - Test: Vote casting validates carId matches checked-in registration
     - Test: Vote casting validates categoryId exists in event
     - Test: canVoteForSelf = false prevents driver from voting for own vehicle
     - Test: driversOnly category rejects member votes
     - Test: membersOnly category rejects non-member votes
     - Test: Votes are immutable after votingEnd timestamp
     - Test: Disqualification prevents a carId from receiving further votes
     - Test: Result calculation ranks cars by vote count
     - Test: Tie handling (e.g., all tied cars listed as tied in results)
     - Test: Result calculation respects ballotWeights if present
   
   - Create `permissions.test.ts`:
     - Test: Club creator has all permissions (edit, invite, manage)
     - Test: Permission middleware blocks unauthorized DELETE event
     - Test: Permission middleware blocks unauthorized PATCH club
     - Test: Invitation flow: creator invites → recipient accepts → membership created
     - Test: Application flow: user applies → club approves → membership created
     - Test: Non-member cannot create event under club
     - Test: Non-member cannot vote if membersOnly category
   
   - Create `webhooks.test.ts`:
     - Test: Stripe webhook (invoice.payment_succeeded) updates registration payment status to "paid"
     - Test: Stripe webhook with invalid signature rejects request
     - Test: Clerk webhook (user.created) creates user in database
     - Test: Clerk webhook (user.updated) updates user attributes
     - Test: Clerk webhook (user.deleted) soft-deletes or marks inactive
     - Test: Webhook replays are idempotent (same event ID doesn't duplicate)

3. Frontend component tests in `apps/web/src/__tests__/`:
   - Create `components/BallotCard.test.tsx`:
     - Test: Renders voting categories from props
     - Test: Accepts carId input in form
     - Test: Shows validation error for carId = 0 or non-existent
     - Test: Shows validation error for missing category selection
     - Test: Calls voteMutation on form submit
     - Test: Disables submit button while mutation in flight
     - Test: Shows error message if mutation fails
   
   - Create `components/RegistrationWizard.test.tsx`:
     - Test: Renders step 1 (driver info) initially
     - Test: Navigation to step 2 (vehicle) after validating step 1
     - Test: Navigation to step 3 (confirmation) after validating step 2
     - Test: Submit button disabled until all required fields filled
     - Test: Calls createRegistrationMutation on final submit
     - Test: Shows error toast if mutation fails
   
   - Create `components/EventStatusBadge.test.tsx`:
     - Test: Renders "Coming Soon" badge for status "Coming Soon" in gray
     - Test: Renders "Open" badge for status "Open" in green
     - Test: Renders "Voting" badge for status "Voting" in blue
     - Test: Renders "Closed" badge for status "Closed" in red
   
   - Create `components/KioskLogin.test.tsx`:
     - Test: Renders carId and registrationCode input fields
     - Test: Accepts carId and registrationCode input
     - Test: Shows error "Invalid carId or code" on auth failure
     - Test: Calls kioskAuthMutation on submit
     - Test: Disables inputs while mutation in flight
     - Test: Clears inputs after successful login
   
   - Create `hooks/useEvents.test.ts` (if complex):
     - Test: useEventsQuery returns events list
     - Test: useEventDetailQuery returns single event with relations
     - Test: useCreateEventMutation sends correct payload
     - Test: Query refetch works after mutation

4. Test database strategy:
   - Use PostgreSQL test database (separate from production)
   - Reset database between test suites
   - Use transactions to rollback changes (faster than DROP/recreate)
   - Example setup in `apps/api/src/test/setup.ts`:
     ```typescript
     beforeEach(async () => {
       await testDb.query('BEGIN');
     });
     
     afterEach(async () => {
       await testDb.query('ROLLBACK');
     });
     ```

5. Mocking strategy:
   - Backend: Mock external services (Stripe, Clerk, Cloudinary) using vitest mocks
   - Frontend: Mock API calls using MSW or vitest mocks
   - Don't mock database — use real test database for integration tests
   - Don't mock core business logic — test actual functions

6. Coverage targets:
   - Aim for >80% coverage on critical paths
   - Required coverage on:
     - Registration flow (create, check-in, validation)
     - Voting logic (validation, tally, results)
     - Permission checks (all protected endpoints)
     - Webhook handlers (Stripe, Clerk)
   
   - Lower priority:
     - UI rendering (test behavior, not snapshot)
     - Non-critical forms

7. CI integration:
   - GitHub Actions should run tests on PR
   - Tests run against test database container
   - Example workflow in `.github/workflows/ci.yml`:
     ```yaml
     - name: Start PostgreSQL test database
       uses: ankane/setup-postgres@v1
       with:
         postgres-version: 15
     
     - name: Run tests
       run: pnpm test
       env:
         DATABASE_URL: postgres://postgres@localhost/test_db
     ```

## Files to Create
- `apps/api/vitest.config.ts`
- `apps/web/vitest.config.ts`
- `apps/api/src/test/setup.ts`
- `apps/api/src/test/factories.ts`
- `apps/api/src/__tests__/registration.test.ts`
- `apps/api/src/__tests__/voting.test.ts`
- `apps/api/src/__tests__/permissions.test.ts`
- `apps/api/src/__tests__/webhooks.test.ts`
- `apps/web/src/test/setup.ts`
- `apps/web/src/__tests__/components/BallotCard.test.tsx`
- `apps/web/src/__tests__/components/RegistrationWizard.test.tsx`
- `apps/web/src/__tests__/components/EventStatusBadge.test.tsx`
- `apps/web/src/__tests__/components/KioskLogin.test.tsx`
- `apps/web/src/__tests__/hooks/useEvents.test.ts`

## Files to Modify
- `apps/api/package.json` (add vitest, test scripts, test DB config)
- `apps/web/package.json` (add vitest, testing-library, test scripts)
- Root `package.json` (add workspace `test` script)
- `.env.example` (add TEST_DATABASE_URL if separate from main DATABASE_URL)

## Acceptance Criteria
- `pnpm test` at root runs all workspace tests
- `pnpm test --filter api` runs only API tests
- `pnpm test --filter web` runs only web tests
- All backend integration tests pass (registration, voting, permissions, webhooks)
- All frontend component tests pass
- Test database properly set up and torn down between test runs
- Test factories create valid, isolated test data
- No test pollution (state from one test doesn't affect another)
- Failing tests provide clear error messages
- CI pipeline (GitHub Actions) runs tests on every PR
- Tests run fast (<5 seconds for whole suite)
- Test coverage reports generated (optional but recommended)
- TypeScript compiles cleanly with test files
- No console errors or warnings during test runs
