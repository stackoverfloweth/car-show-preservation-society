# Session 11 — Registration System

## Dependencies
Session 09 (events)

## Branch
`session/11-registrations`

## Goal
Build the complete registration system supporting both pre-registration (driver self-service) and gate registration (club member host-mode). This includes registration code generation, carId assignment at check-in, capacity enforcement, and the core driver check-in flow.

## Tasks

1. **Create the registrations table schema** (`packages/db/src/schema/registrations.ts`):
   - id (nanoid)
   - eventId (FK → events.id)
   - userId (FK → users.id, nullable — supports anonymous gate registrations)
   - vehicleId (FK → vehicles.id, nullable — driver can assign their car; immutable after event.votingStart)
   - registrationCode (text, unique — 6-char alphanumeric, human-readable backup to QR)
   - registrationDate (timestamp)
   - carId (integer, nullable — assigned at check-in, unique per event via composite constraint)
   - checkedInAt (timestamp, nullable)
   - stripePaymentId (text, nullable — null means unpaid/cash at gate)
   - createdAt
   - updatedAt (nullable)
   - Add index on eventId
   - Add index on userId
   - Add index on vehicleId
   - Add index on registrationCode (unique)
   - Add unique composite index on (eventId, carId) to ensure carId is unique per event
   - Add check constraint: carId must be >= 1 if set

2. **Create driver status constants** (`packages/shared/src/constants/driver-status.ts`):
   - Export `DRIVER_STATUS` enum with values: 'unregistered', 'registered', 'checked-in'
   - Export helper function `deriveDriverStatus(registration: Registration | null)`:
     - If registration is null: 'unregistered'
     - If registration exists but carId is null: 'registered'
     - If registration exists and carId is set: 'checked-in'

3. **Create Zod validation schema** (`packages/shared/src/schemas/registration.ts`):
   - Export `PreRegisterSchema`, `GateRegisterSchema`, `CheckInSchema`, `RegistrationSchema`
   - PreRegisterSchema validates: eventId, vehicleId (optional)
   - GateRegisterSchema validates: eventId, vehicleId (optional), driverEmail (optional), driverPhone (optional)
   - CheckInSchema is empty (just validates :id param)
   - RegistrationSchema includes all fields with derived status

4. **Create registration helper functions** (`apps/api/src/lib/registration-helpers.ts`):
   - `generateRegistrationCode(): string`
     - Generate 6-character alphanumeric code
     - Check uniqueness against database
     - Retry up to 10 times if collision (highly unlikely)
     - Return the code
   - `getNextCarId(eventId: string, db: Database): Promise<number>`
     - Query max(carId) from registrations where eventId = given and carId is not null
     - Return (max + 1) or 1 if none exist
     - Use a transaction with row-level locking to prevent race conditions on concurrent check-ins
     - Ensure atomicity: SELECT ... FOR UPDATE, then increment

5. **Create API routes** (`apps/api/src/routes/registrations.ts`):
   - `POST /api/events/:eventId/registrations` — Pre-register (auth required, driver self-service)
     - Body: Zod-validated PreRegisterSchema (eventId, vehicleId optional)
     - Validation: Check event.maxCapacity if set (fail if at capacity)
     - Create registration with: userId from auth context, vehicleId from body, auto-generated registrationCode, registrationDate = now
     - If event.preRegistrationUnpaid is false and event.stripePriceId is set: return stripeCheckoutUrl for payment
     - If event.preRegistrationUnpaid is true: create registration immediately without payment
     - Returns: { registration, stripeCheckoutUrl? }
   
   - `POST /api/events/:eventId/registrations/gate` — Gate registration (requires BYPASS_REGISTRATION permission on event's club)
     - Body: Zod-validated GateRegisterSchema (eventId, vehicleId optional, driverEmail optional, driverPhone optional)
     - Validation: Check event.maxCapacity if set
     - Create registration with: userId = null (or look up by email if provided), vehicleId from body, auto-generated registrationCode, stripePaymentId = null
     - Returns: Created registration
   
   - `GET /api/events/:eventId/registrations` — List registrations for event (requires MANAGE_EVENT permission)
     - Query filters: search (by driver name, email, carId, registrationCode)
     - Returns: Array of registrations with derived driver status, includes driver name/email if available
     - Pagination: limit/offset
   
   - `GET /api/registrations/:id` — Registration detail (auth required, must be owner or event manager)
     - Returns: Full registration with derived driver status, event details, vehicle details
   
   - `PUT /api/registrations/:id` — Update registration (auth required, owner or event manager)
     - Body: UpdateRegistrationSchema (vehicleId, email, phone)
     - Restrictions:
       - vehicleId cannot be changed if event.votingStart is set
       - If user is not owner, requires MANAGE_EVENT permission
     - Returns: Updated registration
   
   - `PUT /api/registrations/:id/check-in` — Check in registration (requires BYPASS_REGISTRATION permission)
     - Body: CheckInSchema (empty)
     - Logic:
       - Call getNextCarId(eventId) to get next sequential carId
       - Set carId on registration
       - Set checkedInAt = now
       - Ensure carId is unique per event (composite constraint prevents duplicates)
     - Validation: Registration must not already be checked in
     - Returns: Updated registration with carId and checkedInAt
   
   - `GET /api/registrations/by-code/:code` — Lookup by registration code (requires BYPASS_REGISTRATION permission)
     - Query registration by registrationCode
     - Return registration if found, 404 if not
     - Returns: Registration with event and driver details
   
   - `GET /api/users/me/registrations` — List own registrations across events (auth required)
     - Returns: Array of registrations for authenticated user, with event details
     - Ordered by event startDate DESC

6. **Integration with votingCategoryRegistrations**:
   - When creating a registration, if any votingCategories have automaticEntry=true, create corresponding votingCategoryRegistrations records
   - When deleting a registration, cascade delete votingCategoryRegistrations

## Files to Create/Modify

### Create:
- `packages/db/src/schema/registrations.ts`
- `packages/shared/src/schemas/registration.ts`
- `packages/shared/src/constants/driver-status.ts`
- `apps/api/src/routes/registrations.ts`
- `apps/api/src/lib/registration-helpers.ts`

### Modify:
- `packages/db/src/schema/index.ts` (add exports in alphabetical order)
- `apps/api/src/index.ts` (mount routes)

## Acceptance Criteria

- Registrations table exists with all columns and constraints
- Pre-registration creates a registration with userId, no carId, auto-generated registrationCode
- Gate registration creates a registration, optionally without userId
- registrationCode is unique and exactly 6 characters
- Check-in assigns sequential carId (1, 2, 3...) per event, not globally
- Concurrent check-ins do not create duplicate carIds (row locking prevents race conditions)
- vehicleId immutability is enforced after event.votingStart is set
- maxCapacity prevents over-registration
- Lookup by registration code works and requires permission
- User can view own registrations across events
- getNextCarId works correctly with transaction locking
- generateRegistrationCode ensures uniqueness
- All endpoints validate input with Zod schemas
- Soft updates work (updatedAt timestamp updated)
- automaticEntry integration works: new registrations auto-assigned to categories with automaticEntry=true
