# Session 30 — Registration & Check-in Pages

## Dependencies
Sessions 11, 12, 18 (registration + check-in + payments API), 25 (layout shell)

## Branch
`session/30-registration-pages`

## Goal
Build the pre-registration flow for drivers, the gate registration host-mode for club members, check-in management, and QR code display. Supports both online pre-registration with optional payment and on-site gate registration with immediate check-in.

## Tasks

### TanStack Query Hooks

1. Create `apps/web/src/hooks/api/use-registrations.ts` with the following hooks:
   - `useEventRegistrations(eventId: string, filters?: { search?: string; paymentStatus?: string; checkInStatus?: string })` — list registrations for an event with optional filters
   - `useRegistration(registrationId: string)` — single registration detail with voter information, vehicle data, payment status, check-in status
   - `useMyRegistrations()` — list authenticated user's registrations across all events
   - `usePreRegister()` — mutation for POST /api/events/:eventId/registrations (driver self-registration)
   - `useGateRegister()` — mutation for POST /api/events/:eventId/registrations/gate (club member registration)
   - `useCheckIn(registrationId: string)` — mutation for PUT /api/registrations/:id/check-in (assigns carId)
   - Export query option factories following TanStack Query conventions
   - All mutations should handle network errors and validation errors from API

### Pre-Registration Page

2. Create `apps/web/src/routes/events/$eventId.register.tsx`:
   - Page title "[Event Name] Registration"
   - Requires authentication (redirect to login if needed)
   - Implements multi-step registration wizard:

   **Step 1 — Vehicle Selection:**
   - Display user's garage vehicles as selectable cards
   - Show vehicle make, model, year, and image if available
   - "No specific vehicle" option for users without vehicles
   - Vehicle selection required before proceeding

   **Step 2 — Voting Category Selection:**
   - Only appears if event.driverSelfCategorization is true
   - Display checkboxes for each available voting category
   - Show category name and description
   - Enforce maxSelfCategorization limit (show error if user tries to exceed)
   - Show selected count vs max allowed
   - Skip this step if event doesn't allow driver self-categorization

   **Step 3 — Payment:**
   - Only appears if event requires payment (stripePriceId configured)
   - Display price summary with breakdown if applicable
   - Show payment options: "Pay Now" button or "Pay at Gate" option (if preRegistrationUnpaid enabled)
   - "Pay Now" redirects to Stripe Checkout session
   - If event is free or payment at gate is chosen, skip payment processing
   - Handle Stripe Checkout return (success/cancel)

   **Step 4 — Confirmation:**
   - Display large, prominent QR code for registration
   - Show registration code in large text, copyable to clipboard
   - Display carId if already checked in
   - Show event information: name, date, location
   - Show vehicle information if selected
   - "Add to Calendar" button generates .ics file download
   - "Print" button opens print dialog for registration card
   - Share link option (copy link or email)

   **Multi-step Navigation:**
   - Previous button (disabled on step 1)
   - Next button (validates current step before advancing)
   - Step indicator showing "Step X of 4" or "Step X of 3"
   - Loading states on buttons during submission
   - Form data persists across steps (user can go back)

### Registrations Management Page

3. Create `apps/web/src/routes/events/$eventId.manage.registrations.tsx`:
   - Club member only page (authorization check required)
   - Page title "[Event Name] Registrations"
   - Statistics bar showing: total registered, total checked in, total paid, pending count
   - Search bar with debounced search
   - Filter controls: payment status (All, Paid, Pending, Cash, Unpaid), check-in status (All, Checked In, Not Checked In)
   - Results table with sortable columns:
     - Car ID (number)
     - Driver name (first + last)
     - Vehicle (make/model/year)
     - Payment status (badge: Paid=green, Pending=yellow, Cash=blue, Unpaid=red)
     - Check-in status (badge: Checked In=green, Not Checked In=gray)
     - Actions column: Check-In button (if not checked in)
   - Check-In button behavior: click shows confirmation, assigns next available carId, updates UI with new carId, shows success message
   - Bulk actions dropdown: "Export List" (CSV), "Print All" (opens print dialog)
   - Pagination with 20 results per page
   - Empty state if no registrations
   - Loading skeleton while fetching data

### Gate Registration Page

4. Create `apps/web/src/routes/events/$eventId.manage.gate.tsx`:
   - Club member only page (authorization check required)
   - Standalone page — no layout shell wrapper (full screen, optimized for tablet use)
   - Designed for fast throughput at the gate
   - Streamlined form with large, touch-friendly inputs:
     - First name field
     - Last name field
     - Email field (optional)
     - Phone field (optional)
     - Vehicle make field (optional)
     - Vehicle model field (optional)
     - Vehicle year field (optional)
   - Large "Register & Check In" button (primary style, prominent)
   - On successful registration and check-in:
     - Show prominently in large font the assigned carId (e.g., "#42")
     - Display QR code for the registration
     - Show registration code
   - "Print Registration Card" button to print check-in confirmation
   - "Next Driver" button to clear the form for the next person
   - Loading state on submit button during processing
   - Error display for validation failures (invalid input, duplicate, etc.)
   - Auto-focus on first input for quick data entry
   - Form reset after successful submission

### Registration Detail Page

5. Create `apps/web/src/routes/registrations/$registrationId.tsx`:
   - Public registration detail (accessible by owner or club members)
   - Large, prominent QR code display at top
   - Registration code displayed in large, copyable text (copy button)
   - Car ID (if checked in): displayed in extra large font, prominent styling
   - Event information section: event name (linked), date, location
   - Vehicle information section: make, model, year
   - Payment status badge: Paid/Pending/Cash/Unpaid
   - Check-in status badge: Checked In/Not Checked In
   - Voting categories registered for (if applicable)
   - Download/Print buttons for registration card

### Registration Components

6. Create `apps/web/src/components/registrations/PreRegistrationWizard.tsx`:
   - Props: eventId, onSuccess callback, isLoading
   - Manages multi-step state (currentStep: 1-4)
   - Manages form data across all steps
   - Renders step components based on currentStep
   - Navigation: previous/next handlers with validation
   - Step indicator display
   - Handles form submission on final step

7. Create `apps/web/src/components/registrations/VehicleSelector.tsx`:
   - Props: vehicles array, selectedId?, onChange callback
   - Display vehicles as grid of selectable cards
   - Show image, make, model, year per card
   - "No specific vehicle" option
   - Selected state styling (border highlight)
   - Responsive grid layout

8. Create `apps/web/src/components/registrations/CategorySelector.tsx`:
   - Props: categories array, maxSelect number, selectedIds, onChange callback
   - Render as list of checkboxes
   - Show category name and description
   - Enforce maxSelect limit with validation message
   - Show "X of Y selected" counter
   - Disable checkboxes when max reached (except selected ones)

9. Create `apps/web/src/components/registrations/PaymentSummary.tsx`:
   - Props: event object, hasPayAtGateOption, onPayNow, onPayAtGate
   - Display price breakdown
   - Show payment methods available
   - "Pay Now" button (primary action)
   - "Pay at Gate" button (secondary, if available)
   - Price total prominently displayed

10. Create `apps/web/src/components/registrations/RegistrationConfirmation.tsx`:
    - Props: registration object, event object
    - Large QR code display
    - Registration code text with copy button
    - Car ID (if checked in) in large font
    - Event summary
    - Vehicle summary
    - "Add to Calendar" button
    - "Print" button
    - Share options

11. Create `apps/web/src/components/registrations/RegistrationTable.tsx`:
    - Props: registrations array, onCheckIn callback, loading state, columns config
    - Sortable column headers (click to sort)
    - Row data: carId, name, vehicle, payment status, check-in status
    - Check-In button per row (if not checked in)
    - Shows loading state while processing check-in
    - Pagination with page size selector

12. Create `apps/web/src/components/registrations/CheckInButton.tsx`:
    - Props: registrationId, onCheckInSuccess callback, loading
    - Button labeled "Check In"
    - On click: shows loading state, calls mutation
    - On success: calls onSuccess callback, shows toast
    - On error: shows error toast with message
    - Disabled during loading

13. Create `apps/web/src/components/registrations/GateRegistrationForm.tsx`:
    - Props: eventId, onSuccess callback
    - Form fields: firstName, lastName, email, phone, vehicleMake, vehicleModel, vehicleYear
    - Large, touch-friendly input sizing
    - Large submit button
    - Auto-focus on first input
    - Form validation with inline error messages
    - Reset form on success
    - Loading state on submit

14. Create `apps/web/src/components/registrations/RegistrationCard.tsx`:
    - Props: registration object
    - Compact card showing key info: driver name, carId if checked in, payment status, check-in status
    - Used in lists and summaries
    - Click handler optional

15. Create `apps/web/src/components/registrations/QRCodeDisplay.tsx`:
    - Props: data (QR data string), size?, downloadable?, printable?
    - Render QR code using qrcode.react or similar library
    - Large, clear rendering
    - Download button (if downloadable)
    - Print button (if printable)
    - Error display if QR generation fails

## Files to Create/Modify

**Create:**
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/hooks/api/use-registrations.ts`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/events/$eventId.register.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/events/$eventId.manage.registrations.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/events/$eventId.manage.gate.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/registrations/$registrationId.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/registrations/PreRegistrationWizard.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/registrations/VehicleSelector.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/registrations/CategorySelector.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/registrations/PaymentSummary.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/registrations/RegistrationConfirmation.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/registrations/RegistrationTable.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/registrations/CheckInButton.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/registrations/GateRegistrationForm.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/registrations/RegistrationCard.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/registrations/QRCodeDisplay.tsx`

## Acceptance Criteria

- Pre-registration wizard completes end-to-end without errors
- Vehicle selector displays user's vehicles and allows selection
- Category selector enforces maxSelfCategorization limit
- Payment step redirects to Stripe Checkout for paid events
- Stripe Checkout return (success/cancel) is handled correctly
- Confirmation page displays QR code, registration code, and carId prominently
- Add to Calendar generates valid .ics file
- Print button opens print dialog with registration card layout
- Gate registration form is optimized for touch on tablets (large inputs, buttons)
- Gate registration assigns carId and displays prominently after check-in
- Registrations management table is sortable, searchable, and filterable
- Check-In button updates registration status and shows new carId
- Registration detail page displays all information correctly
- QR codes are scannable and high quality
- All pages responsive on mobile (< 768px), tablet (768px - 1023px), and desktop (≥ 1024px)
- Loading states display throughout form submission and data fetching
- Error messages display helpfully and allow recovery
- TypeScript compiles in strict mode with no errors
