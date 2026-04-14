# Session 29 — Event Pages

## Dependencies
Sessions 09 (events API), 24 (sponsors), 25 (layout shell)

## Branch
`session/29-event-pages`

## Goal
Build event listing, event detail, and the multi-step event creation/edit wizard. Events are the core of the platform — this is the most complex frontend session. Covers comprehensive event management with voting category configuration, sponsor management, and status-based UI variations.

## Tasks

### TanStack Query Hooks

1. Create `apps/web/src/hooks/api/use-events.ts` with the following hooks:
   - `useEvents(filters?: { status?: string; clubId?: string; dateRange?: { start: Date; end: Date }; location?: string })` — list events with optional filters, paginated results
   - `useEvent(eventId: string)` — single event detail with nested voting categories, sponsor data, and registration statistics
   - `useCreateEvent()` — mutation for POST /api/events
   - `useUpdateEvent(eventId: string)` — mutation for PUT /api/events/:id
   - `useDeleteEvent(eventId: string)` — mutation for DELETE /api/events/:id
   - Export query option factories following TanStack Query conventions

2. Create `apps/web/src/hooks/api/use-voting-categories.ts` with the following hooks:
   - `useVotingCategories(eventId: string)` — list categories for an event with entry counts
   - `useCreateVotingCategory()` — mutation for POST /api/events/:eventId/voting-categories
   - `useUpdateVotingCategory(categoryId: string)` — mutation for PUT /api/voting-categories/:id
   - `useDeleteVotingCategory(categoryId: string)` — mutation for DELETE /api/voting-categories/:id
   - All hooks should handle errors gracefully and show validation messages

### Event Listing Page

3. Create `apps/web/src/routes/events/index.tsx`:
   - Page title "Events" with optional "New Event" button (visible to authenticated users who are club members)
   - Status tabs component: All, Upcoming, Active, Past (controls query filter)
   - Search bar for event name (debounced, updates query)
   - Club filter dropdown (populated from clubs API, user can select to filter)
   - Sort controls: Date (ascending/descending)
   - Event cards grid layout with responsive columns (1 column mobile, 2 tablet, 3 desktop)
   - Card displays: event name, date range formatted, location, club name (as link to club detail), status badge, registration count
   - Pagination with page numbers and next/previous buttons
   - Empty state when no events match filters
   - Loading skeleton states while fetching

### Event Detail Page

4. Create `apps/web/src/routes/events/$eventId.tsx`:
   - Page header with event name, status badge, club name (clickable link), date range, and location
   - Location section with text display (static map placeholder, Mapbox integration deferred to session 34)
   - Schedule section: formatted start time, end time, voting window dates (if configured)
   - Voting categories section: list or grid display showing each category's name, description, capacity if applicable, restriction badges (drivers-only, members-only)
   - Registration CTA: "Register Now" button (if pre-registration open) or "Registration Closed" text
   - Sponsors section: grid layout displaying sponsor logos/images with links
   - Results section: appears only if event status is "completed", shows link to results page
   - Admin bar (appears only for club members with edit permissions): "Edit Event" and "Manage Registrations" buttons
   - Handle unauthorized access gracefully

### Event Creation Wizard

5. Create `apps/web/src/routes/events/new.tsx`:
   - Requires authentication check (redirect to login if needed)
   - Requires user to be club member (show error if not)
   - Multi-step form with step indicator showing progress
   - Navigation buttons: Previous (disabled on step 1), Next (validates before advancing), Submit on final step
   - Step indicators show current step number and title
   - Save draft functionality on each step
   - Implement the following steps:

   **Step 1 — General:**
   - Club selector dropdown (populated from user's club memberships)
   - Event name text input (required)
   - Start date/time picker (required)
   - End date/time picker (required, must be after start)
   - Location text input (required, text field for now)
   - Client-side validation: name length, date ordering

   **Step 2 — Registration:**
   - Pre-registration toggle switch
   - Pricing configuration: stripePriceId text field (for general admission)
   - Pre-registration-specific stripePriceId text field
   - preRegistrationUnpaid toggle (allow payment at gate)
   - maxCapacity number input
   - Cross-sell product IDs: textarea for comma-separated Stripe product IDs (optional)
   - Validation: stripePriceId format validation if prices entered

   **Step 3 — Judging:**
   - ballotCount number input (how many ballots per driver gets)
   - canVoteForSelf toggle
   - driverSelfCategorization toggle (drivers can self-assign to categories)
   - maxSelfCategorization number input (max categories per driver can assign to)
   - Voting categories subsection:
     - List of added categories with inline edit/delete buttons
     - Add category button opens VotingCategoryFormRow component
     - Form row contains: name, description, maxCapacity, driversOnly toggle, membersOnly toggle, automaticEntry toggle, featured toggle, stripePriceId
     - Validation: name required, max 20 categories

   **Step 4 — Sponsors:**
   - Add sponsor button
   - List of added sponsors with inline edit/delete buttons
   - Sponsor form row: name, imageUrl (text input for now), linkUrl
   - Validation: name required, URL format validation

   **Step 5 — Preview:**
   - Read-only summary of all previously entered data
   - Grouped sections: General, Registration, Judging, Sponsors
   - "Publish Event" button to submit the form
   - "Back to Edit" link to return to step 1
   - On successful submission: redirect to event detail page

### Event Edit Page

6. Create `apps/web/src/routes/events/$eventId.edit.tsx`:
   - Pre-fills all form fields with existing event data
   - Authorization check: only club members who own the event can edit
   - Same multi-step form as creation page but with pre-populated values
   - Submit button text: "Save Changes" instead of "Publish"
   - On successful submission: redirect to event detail page

### Event Components

7. Create `apps/web/src/components/events/EventCard.tsx`:
   - Props: event object, onClick handler
   - Displays as Card component with: name, date range, location, club name, status badge, registration count
   - Hover state with cursor pointer
   - Responsive to fit in grid layouts

8. Create `apps/web/src/components/events/EventStatusBadge.tsx`:
   - Props: status string ("draft" | "upcoming" | "active" | "voting" | "completed")
   - Visual variants: draft=gray, upcoming=blue, active=green, voting=amber, completed=slate
   - Use Badge component from UI library

9. Create `apps/web/src/components/events/EventForm.tsx`:
   - Props: event? (for edit mode), onSuccess callback, isLoading state
   - Manages step state (currentStep: 1-5)
   - Manages form data state (all fields across all steps)
   - Handles navigation between steps with validation
   - Renders appropriate step component based on currentStep
   - Pass form data and state handlers to step components

10. Create separate step components:
    - `apps/web/src/components/events/EventFormGeneral.tsx` — step 1
    - `apps/web/src/components/events/EventFormRegistration.tsx` — step 2
    - `apps/web/src/components/events/EventFormJudging.tsx` — step 3
    - `apps/web/src/components/events/EventFormSponsors.tsx` — step 4
    - `apps/web/src/components/events/EventFormPreview.tsx` — step 5
    - Each receives form state and update handlers, validates its section

11. Create `apps/web/src/components/events/VotingCategoryList.tsx`:
    - Props: categories array, eventId
    - Renders as readable list showing name, description, restrictions
    - Shows capacity if applicable
    - No edit functionality (view-only for event detail page)

12. Create `apps/web/src/components/events/VotingCategoryFormRow.tsx`:
    - Props: category? (for edit), onSave, onCancel, onDelete
    - Inline form with fields: name, description, maxCapacity, toggles (driversOnly, membersOnly, automaticEntry, featured), stripePriceId
    - Save and Cancel buttons
    - Delete button if editing existing category
    - Client-side validation: name required

13. Create `apps/web/src/components/events/SponsorGrid.tsx`:
    - Props: sponsors array
    - Displays sponsor items in responsive grid (2 columns tablet, 3 desktop, 1 mobile)
    - Each sponsor item: logo/image with fallback to name, clickable link if linkUrl provided
    - Alt text for images
    - Empty state if no sponsors

14. Create `apps/web/src/components/events/EventTimeline.tsx`:
    - Props: startDate, endDate, votingWindowStart?, votingWindowEnd?
    - Visual timeline showing event phases: "Registration" → "Voting Window" → "Event"
    - Each phase labeled with dates
    - Current phase highlighted
    - Used in event detail page

## Files to Create/Modify

**Create:**
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/hooks/api/use-events.ts`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/hooks/api/use-voting-categories.ts`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/events/index.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/events/$eventId.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/events/new.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/events/$eventId.edit.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/events/EventCard.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/events/EventStatusBadge.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/events/EventForm.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/events/EventFormGeneral.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/events/EventFormRegistration.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/events/EventFormJudging.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/events/EventFormSponsors.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/events/EventFormPreview.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/events/VotingCategoryList.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/events/VotingCategoryFormRow.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/events/SponsorGrid.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/events/EventTimeline.tsx`

## Acceptance Criteria

- Event listing page renders with all filters functional (status tabs, search, club filter, sort)
- Pagination works correctly and preserves filter state
- Event detail page displays different sections based on event status
- Admin bar shows only for authorized club members
- Multi-step creation wizard validates each step before advancing
- All form data persists across wizard steps (user can go back without losing data)
- Creation wizard saves event with all settings including voting categories and sponsors
- Edit page pre-fills with existing data and saves changes
- All components are fully responsive on mobile (< 768px), tablet (768px - 1023px), and desktop (≥ 1024px)
- Loading states display skeleton loaders during data fetching
- Error states display helpful messages and recovery options
- TypeScript compiles in strict mode with no errors
- All API hooks follow TanStack Query conventions with proper caching and error handling
