# Session 12 — QR Code & Check-in Flow

## Dependencies
Session 11 (registrations)

## Branch
`session/12-qr-checkin`

## Goal
Add QR code generation for registrations, build the check-in verification flow, and create the permanent vehicle QR code concept from the spec. QR codes enable rapid check-in at the gate and provide shareable links for voting.

## Tasks

1. **Install qrcode package**:
   - Add `qrcode` npm package to `apps/api/package.json`
   - Version: latest stable (e.g., `^1.5.0`)

2. **Create QR code library** (`apps/api/src/lib/qr.ts`):
   - Import qrcode package
   - Export async function `generateRegistrationQR(registrationId: string, baseUrl: string): Promise<string>`
     - Generate QR code that encodes URL: `{baseUrl}/registrations/{registrationId}`
     - Return as base64 PNG string (use `qrcode.toDataURL()` for data URL output)
     - Options: errorCorrectionLevel 'H', width 300px
   - Export async function `generateVehicleQR(vehicleId: string, baseUrl: string): Promise<string>`
     - Generate QR code that encodes URL: `{baseUrl}/vote/{vehicleId}`
     - This QR is permanent and goes on vehicle plaques
     - Return as base64 PNG string
     - Options: errorCorrectionLevel 'H', width 300px
   - Export async function `generateQRPNG(data: string): Promise<Buffer>`
     - Helper to generate QR as PNG Buffer (for endpoint responses)
     - Used by GET /qr endpoints

3. **Enhance registration responses with QR**:
   - Modify `GET /api/registrations/:id` to include `qrCodeDataUrl` field
   - Generate on-the-fly using generateRegistrationQR() with frontend base URL from env
   - Include in responses: registration object + { qrCodeDataUrl: string, qrCodeUrl: string } where qrCodeUrl is the absolute URL to the QR endpoint

4. **Create QR code endpoints** (`apps/api/src/routes/registrations.ts` — modify existing file):
   - `GET /api/registrations/:id/qr` — Return QR code image
     - No authentication required (public QR for check-in)
     - Response: PNG image with Content-Type: image/png
     - Use generateQRPNG() to generate Buffer and send as file
     - Caching: Set cache headers to 1 hour (QR is immutable after registration creation)
   
   - `GET /api/registrations/:id/print` — Print-friendly endpoint
     - Auth required (owner or event manager)
     - Returns: JSON payload optimized for printing
     - Structure: { carId, registrationCode, registrationId, eventName, eventDate, driverName?, driverEmail?, qrCodeDataUrl }
     - carId will be null until check-in, which is fine for pre-check-in printing
     - Use this payload to render a print template (receipt-style)

5. **Create vehicle routing** (`apps/api/src/routes/vehicles.ts` — modify existing file):
   - `GET /api/vehicles/:vehicleId/active-registration` — Find active registration for this vehicle
     - Query: Find event where startDate ≤ today ≤ endDate AND vehicle has registration AND carId is not null
     - If multiple events match (unlikely but possible): return registration from most recent startDate
     - Returns: { registration, event, vehicle }
     - If no active registration: return 404
     - No auth required (needed for voting kiosk flow)
   
   - `GET /api/vehicles/:vehicleId/qr` — Return permanent vehicle QR code
     - No authentication required
     - Response: PNG image with Content-Type: image/png
     - Caching: Set cache headers to 1 day (vehicle QR is immutable)
     - Use generateVehicleQR() to generate code

6. **Integrate QR into registration creation**:
   - When creating a registration (pre-register or gate), immediately generate and store the QR code
   - OR generate on-demand for GET endpoints (simpler, no storage)
   - Decision: Generate on-demand (keep storage simple)

7. **Print flow integration**:
   - Registration detail endpoint should include printUrl for frontend
   - Frontend can use this URL to render a print-friendly page or download a PDF

## Files to Create/Modify

### Create:
- `apps/api/src/lib/qr.ts`

### Modify:
- `apps/api/package.json` (add qrcode dependency)
- `apps/api/src/routes/registrations.ts` (add /qr and /print endpoints)
- `apps/api/src/routes/vehicles.ts` (add /active-registration and /qr endpoints, create file if doesn't exist)

## Acceptance Criteria

- qrcode package is installed and importable
- QR codes generate correctly as PNG data URLs
- Registration detail endpoint (`GET /api/registrations/:id`) includes qrCodeDataUrl field
- `GET /api/registrations/:id/qr` returns valid PNG image file with correct cache headers
- `GET /api/registrations/:id/print` returns JSON with all required fields for printing
- `GET /api/vehicles/:vehicleId/active-registration` finds the correct active registration for the vehicle
- `GET /api/vehicles/:vehicleId/qr` returns valid PNG image for vehicle plaques
- Vehicle QR URLs encode `/vote/{vehicleId}` correctly
- Registration QR URLs encode `/registrations/{registrationId}` correctly
- QR codes have high error correction level ('H') for scanning reliability
- Cache headers are set appropriately (1 hour for registration QR, 1 day for vehicle QR)
- Print endpoint respects auth (owner or event manager only)
- Active registration lookup returns most recent event if multiple matches
- Endpoints return 404 when resources not found
