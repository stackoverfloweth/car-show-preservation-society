# Session 08 — Vehicle Schema & CRUD

## Dependencies
Session 05

## Branch
`session/08-vehicles`

## Goal
Build the vehicle (garage) system — schema, CRUD API, and image management for vehicles. Vehicles are intentionally generic to support expanding beyond cars in the future.

## Tasks

- Define `packages/db/src/schema/vehicles.ts`:
  - `id` (text PK, nanoid)
  - `userId` (FK → users.id)
  - `make`, `model`, `year`, `description`, `color` (text, all nullable)
  - `modificationCount` (integer, nullable)
  - `modifiedAppearance` (boolean, nullable)
  - `createdAt`, `updatedAt`
- Define `packages/db/src/schema/vehicle-images.ts`:
  - `id` (text PK, nanoid)
  - `vehicleId` (FK → vehicles.id, cascade delete)
  - `source` (text — Cloudinary URL)
  - `createdAt`
- Define Drizzle relations (vehicle → user, vehicle → vehicleImages)
- Define Zod schemas in `packages/shared/src/schemas/vehicle.ts`:
  - `createVehicleSchema`, `updateVehicleSchema`, `vehicleResponseSchema`
- Create `apps/api/src/routes/vehicles.ts`:
  - `POST /api/vehicles` — create vehicle (auth required)
  - `GET /api/vehicles` — list own vehicles (auth required, "My Garage")
  - `GET /api/vehicles/:id` — get vehicle detail (public — for voting QR codes)
  - `PUT /api/vehicles/:id` — update (owner only)
  - `DELETE /api/vehicles/:id` — soft delete (owner only)
  - `POST /api/vehicles/:id/images` — add image (accept Cloudinary URL or handle upload)
  - `DELETE /api/vehicles/:id/images/:imageId` — remove image (owner only)
  - `GET /api/users/:userId/vehicles` — list a user's vehicles (public)
- Generate and apply migration

## Files to Create/Modify

**Create:**
- `packages/db/src/schema/vehicles.ts`
- `packages/db/src/schema/vehicle-images.ts`
- `packages/shared/src/schemas/vehicle.ts`
- `apps/api/src/routes/vehicles.ts`

**Modify:**
- `packages/db/src/schema/index.ts`
- `apps/api/src/index.ts`

## Acceptance Criteria

- Vehicles and vehicle_images tables exist in database
- Full CRUD works for vehicles
- Only the owner can update/delete their vehicle
- Image add/remove works
- Public vehicle detail endpoint works (for QR code voting flow)
- Zod validation on all inputs
