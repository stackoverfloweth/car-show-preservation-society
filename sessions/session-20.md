# Session 20 — Cloudinary Integration

## Dependencies
Session 03 (backend skeleton)

## Branch
`session/20-cloudinary`

## Goal
Build a reusable Cloudinary image upload/delete service and a generic images API endpoint. This is used by vehicles, events, clubs, and user profiles.

## Tasks
- Install `cloudinary` package in apps/api
- Create `apps/api/src/lib/cloudinary.ts`:
  - Initialize Cloudinary with CLOUDINARY_URL
  - `uploadImage(file: Buffer, options: { folder, tags, transformation? })` — upload, return { url, publicId, width, height, format }
  - `deleteImage(publicId: string)` — delete from Cloudinary
  - `getUploadSignature(params)` — generate a signed upload URL for client-side direct uploads (more efficient for large images)
- Create `apps/api/src/routes/images.ts`:
  - `POST /api/images/upload` — generic upload endpoint (auth required). Accepts multipart form data. Body includes `entity` (vehicle|event|club|profile) and `entityId`. Uploads to Cloudinary with appropriate folder/tags. Creates the corresponding image record in the right table (vehicleImages, eventImages, etc.) based on entity type.
  - `POST /api/images/upload-signature` — returns a signed URL for client-side direct upload
  - `DELETE /api/images/:entity/:imageId` — delete image (owner only). Removes from Cloudinary and database.
- Support Cloudinary URL transforms for responsive images:
  - Helper: `getTransformedUrl(url, { width, height, crop })` — returns transformed URL using Cloudinary URL API

## Files to Create/Modify
Create:
- `apps/api/src/lib/cloudinary.ts`
- `apps/api/src/routes/images.ts`

Modify:
- `apps/api/src/index.ts`
- `apps/api/package.json`

## Acceptance Criteria
- Image upload works via server-side upload
- Signed URL generation works for client-side uploads
- Images saved to correct Cloudinary folder by entity type
- Image deletion removes from both Cloudinary and database
- URL transforms generate valid Cloudinary URLs
