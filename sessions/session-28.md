# Session 28 — Vehicle / Garage Pages

## Dependencies
Sessions 08 (vehicle API), 20 (Cloudinary), 25 (layout shell)

## Branch
`session/28-garage-pages`

## Goal
Build the "My Garage" section where users can manage their vehicles with photo galleries. Users can add, edit, view, and delete vehicles with image uploads to Cloudinary. Public vehicle profiles are viewable by other users and show placement history.

## Tasks
1. Create TanStack Query hooks in `apps/web/src/hooks/api/use-vehicles.ts`:
   - **useVehicles()** — query hook for GET /api/users/me/vehicles (authenticated user's own vehicles)
   - **useVehicle(vehicleId)** — query hook for GET /api/vehicles/:vehicleId (public view)
   - **useCreateVehicle()** — mutation for POST /api/vehicles
   - **useUpdateVehicle(vehicleId)** — mutation for PUT /api/vehicles/:vehicleId
   - **useDeleteVehicle(vehicleId)** — mutation for DELETE /api/vehicles/:vehicleId
   - **useVehicleImages(vehicleId)** — query hook for GET /api/vehicles/:vehicleId/images

2. Build "My Garage" listing page (**/garage**):
   - Route file: `apps/web/src/routes/garage/index.tsx`
   - Require authentication (redirect to /login if not)
   - Display vehicle cards in a grid. Each card shows:
     - Primary image (or placeholder)
     - Make/model/year
     - Color (if available)
     - Edit and delete buttons
     - Click card to view detail/edit
   - "Add Vehicle" button in top right
   - Show loading skeleton while fetching
   - Show empty state if no vehicles

3. Build add vehicle page (**/garage/new**):
   - Route file: `apps/web/src/routes/garage/new.tsx`
   - Form with fields: make, model, year, color, modifications (text), trim, body type
   - Image upload section (multiple files allowed)
   - Use Cloudinary direct upload (from session 20)
   - Submit button calls useCreateVehicle
   - On success, redirect to vehicle detail page
   - Show validation errors

4. Build vehicle detail page (**/garage/:vehicleId**):
   - Route file: `apps/web/src/routes/garage/$vehicleId.tsx`
   - Public view of a vehicle (no auth required)
   - Display vehicle info: make, model, year, color, modifications, body type
   - Image gallery with lightbox (click image to enlarge)
   - Owner info card (name, profile link)
   - If authenticated user is owner:
     - Show "Edit" button
     - Show "Delete" button with confirmation modal
   - Show placement history (awards this vehicle has won)
   - Show loading skeleton

5. Build vehicle edit page (**/garage/:vehicleId/edit**):
   - Route file: `apps/web/src/routes/garage/$vehicleId/edit.tsx`
   - Require authentication and ownership check
   - Two tabs:
     - **Info** — edit form (make, model, year, color, modifications, etc.)
     - **Images** — image gallery with ability to delete individual images, set primary image, upload new images
   - Save changes via useUpdateVehicle and individual image mutations
   - Show success/error toasts

6. Build components in `apps/web/src/components/vehicles/`:
   - **VehicleCard.tsx** — card displaying vehicle summary. Props: vehicle data, onEdit, onDelete callbacks.
   - **VehicleForm.tsx** — form for create/edit. Props: initialData (optional), onSubmit, isLoading.
   - **ImageGallery.tsx** — grid of images with lightbox. Props: images array, onClick (optional for lightbox), canDelete (bool), onDelete callback.
   - **ImageUploader.tsx** — component using Cloudinary direct upload (unsigned upload). Props: vehicleId, onUploadSuccess callback, maxFiles. Shows progress bar.
   - **ImageLightbox.tsx** — modal showing full-size image with prev/next navigation. Props: images, currentIndex, onClose.

7. Image handling:
   - Use Cloudinary unsigned upload (session 20 should provide signed upload endpoint)
   - After upload, submit vehicle-images create request to backend
   - Display images as Cloudinary URLs with responsive transforms: `cl_image_tag(imageUrl, {width: 400, height: 300, crop: 'fill'})`

## Files to Create/Modify
**Create:**
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/hooks/api/use-vehicles.ts`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/garage/index.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/garage/new.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/garage/$vehicleId.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/garage/$vehicleId/edit.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/vehicles/VehicleCard.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/vehicles/VehicleForm.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/vehicles/ImageGallery.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/vehicles/ImageUploader.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/vehicles/ImageLightbox.tsx`

## Acceptance Criteria
- Authenticated user can view their vehicles on /garage
- User can create new vehicle with form validation
- Image upload to Cloudinary works and images persist
- Vehicle detail page displays all info correctly
- Public vehicle detail page is viewable without auth
- User can edit own vehicle and change info/images
- Image gallery displays with correct aspect ratios
- Lightbox opens/closes and navigates between images correctly
- Delete vehicle shows confirmation modal and removes vehicle
- Only vehicle owner can edit/delete
- Cloudinary image URLs are properly transformed for responsive display
- All pages show loading states
- Placement history displays on detail page
