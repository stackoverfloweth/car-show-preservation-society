# Session 32 — Results & History Pages

## Dependencies
Session 16 (voting results API), 25 (layout shell)

## Branch
`session/32-results-pages`

## Goal
Build event results display with podium/trophy visualization, full rankings tables, and user placement history for profiles. Show results publicly once published, with results management page for club members to review, calculate, and adjust before publishing.

## Tasks

### TanStack Query Hooks

1. Create `apps/web/src/hooks/api/use-voting-results.ts` with the following hooks:
   - `useEventResults(eventId: string)` — fetch all results for an event grouped by voting category
   - `useCategoryResults(eventId: string, categoryId: string)` — fetch results for a single category with full rankings
   - `useUserPlacements(userId: string)` — fetch user's placement history across all events
   - `useEventStats(eventId: string)` — fetch summary statistics for event (total votes cast, categories count, participation rate)
   - `useCalculateResults(eventId: string)` — mutation for POST /api/events/:eventId/results/calculate (triggers result calculation)
   - `useRecalculateResults(eventId: string)` — mutation for POST /api/events/:eventId/results/recalculate (recalculates after adjustments)
   - `usePublishResults(eventId: string)` — mutation for PUT /api/events/:eventId/results/publish (toggles publish state)
   - `useToggleDisqualify(voteId: string)` — mutation to toggle disqualified flag on individual vote
   - Export query option factories following TanStack Query conventions
   - All hooks include proper error handling and cache invalidation

### Event Results Page

2. Create `apps/web/src/routes/events/$eventId.results.tsx`:
   - Page title "[Event Name] Results"
   - Requires results to be published (show "Results not yet published" if not)
   - Event header section:
     - Event name prominently displayed
     - Event date and status
   - Statistics summary bar:
     - Total votes cast (number)
     - Number of judging categories (number)
     - Participation rate (percentage or ratio)
     - Responsive layout (stacks on mobile)
   - Per voting category section (repeat for each category):
     - Category name and description header
     - CategoryResults component showing:
       - ResultsPodium component displaying top 3:
         - 1st place (center, tallest): car ID, vehicle info (make/model/year), driver name (if available), vote count
         - 2nd place (left side): car ID, vehicle info, driver name (if available), vote count
         - 3rd place (right side): car ID, vehicle info, driver name (if available), vote count
         - Visual distinction between places (gold/silver/bronze coloring or sizing)
       - ResultsTable component showing full rankings:
         - Columns: place (1, 2, 3...), car ID, vehicle, driver name, vote count
         - Sortable columns (click to sort)
         - Expandable rows to show additional vehicle details
         - Pagination if many entries
   - Share results button: "Copy Share Link" to copy results URL to clipboard
   - Responsive layout (podium adjusts for mobile, table scrolls if needed)
   - Loading states while fetching data

### Results Management Page

3. Create `apps/web/src/routes/events/$eventId.manage.results.tsx`:
   - Club member only page (authorization check required)
   - Page title "[Event Name] Results Management"
   - Status section:
     - Show if results calculated, published, or neither
     - Last calculation timestamp
   - Action buttons:
     - "Calculate Results" button (primary style, disabled if voting still open)
     - "Recalculate" button (only visible if results already calculated)
     - Confirmation dialog on recalculate: "Recalculating will discard all disqualifications and recalculate from votes"
     - "Publish Results" toggle switch (disabled until results calculated)
     - On publish: show confirmation "Results will be visible to public"
     - Show "Published" status badge when published
   - Per category disqualification management:
     - List of categories
     - Expandable category section showing full vote results
     - For each vote in the results:
       - Display: car ID, vote count, place (calculated from other votes)
       - DisqualifyToggle component to mark vote as disqualified
       - On toggle: updates vote disqualified flag
     - After making disqualifications: "Recalculate" button to recalculate rankings
   - Results preview:
     - Show category results after calculation
     - Show place numbers based on vote counts
     - Display disqualifications (crossed out or marked)
   - Loading states during calculation
   - Error messages if calculation fails
   - Success toast after publishing

### User Placement History Component

4. Integrate placement history into user profile page (`/profile/$userId`):
   - Create `apps/web/src/components/results/PlacementHistory.tsx`:
     - Props: userId
     - Displays user's placement history across all events
     - Stats section showing:
       - Total awards (sum of placements)
       - 1st place count
       - 2nd place count
       - 3rd place count
       - Events participated
     - Placement list:
       - Table or list view
       - Columns: event name (linked), date, category, place (with trophy icon), vehicle
       - Sortable by: date, place
       - Filter by place (all, 1st, 2nd, 3rd)
     - Empty state if no placements
     - Loading skeleton while fetching data

### Results Components

5. Create `apps/web/src/components/results/ResultsPodium.tsx`:
   - Props: top3 array (containing 1st, 2nd, 3rd place placements)
   - Visual podium display:
     - 1st place (center, tallest block): larger height and styling
     - 2nd place (left): medium height
     - 3rd place (right): smaller height
     - Each block shows:
       - Car ID large and prominent
       - Vehicle info (make/model/year)
       - Driver name (if available)
       - Vote count
       - Trophy icon (gold for 1st, silver for 2nd, bronze for 3rd)
   - Responsive: on mobile, podium stacks vertically
   - Styling with Tailwind using color variants (gold: amber, silver: slate, bronze: orange)

6. Create `apps/web/src/components/results/ResultsTable.tsx`:
   - Props: results array, onSort callback, sortBy, sortOrder
   - Table component:
     - Columns: place, car ID, vehicle, driver name, vote count
     - Sortable headers (click to sort)
     - Responsive: horizontal scroll on mobile
     - Rows highlighted if top 3 (gold/silver/bronze tint)
     - Empty state if no results
   - Pagination if results exceed 50 entries

7. Create `apps/web/src/components/results/ResultsStats.tsx`:
   - Props: event object with stats
   - Displays statistics bar with:
     - Total votes cast
     - Number of categories
     - Participation rate (percentage or "X of Y drivers")
   - Responsive grid layout (stacks on mobile)
   - Each stat in its own card or section

8. Create `apps/web/src/components/results/CategoryResults.tsx`:
   - Props: category object, results array, eventId
   - Wrapper component combining ResultsPodium and ResultsTable
   - Header: category name and description
   - Podium section
   - Full rankings table below
   - Share result for category (optional)

9. Create `apps/web/src/components/results/CalculateResultsButton.tsx`:
   - Props: eventId, disabled?, onSuccess callback
   - Button labeled "Calculate Results"
   - On click: show loading state with spinner
   - Disabled if event voting still open
   - On success: show success toast, call onSuccess callback
   - On error: show error toast with message
   - Handle API errors gracefully

10. Create `apps/web/src/components/results/DisqualifyToggle.tsx`:
    - Props: voteId, isDisqualified, onChange callback, disabled?
    - Toggle switch or checkbox
    - Label: "Disqualified" or "Mark as Invalid"
    - On toggle: calls onChange with new state
    - Shows confirmation toast after change
    - Loading state during API call

11. Create `apps/web/src/components/results/PlacementCard.tsx`:
    - Props: placement object (event, category, place, vehicle, date)
    - Card component showing single placement entry
    - Display: event name (linked), date, category, place with trophy icon, vehicle make/model
    - Responsive styling
    - Click navigates to event results page
    - Trophy icon styling (gold for 1st, silver for 2nd, bronze for 3rd)

12. Create `apps/web/src/components/results/TrophyIcon.tsx`:
    - Props: place (1, 2, 3), size? ('sm', 'md', 'lg')
    - SVG or icon component
    - Gold trophy for 1st place
    - Silver trophy for 2nd place
    - Bronze trophy for 3rd place
    - No icon for 4th+ place
    - Aria labels for accessibility

## Files to Create/Modify

**Create:**
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/hooks/api/use-voting-results.ts`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/events/$eventId.results.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/events/$eventId.manage.results.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/results/ResultsPodium.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/results/ResultsTable.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/results/ResultsStats.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/results/CategoryResults.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/results/CalculateResultsButton.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/results/DisqualifyToggle.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/results/PlacementCard.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/results/PlacementHistory.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/results/TrophyIcon.tsx`

**Modify:**
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/profile/$userId.tsx` — integrate PlacementHistory component

## Acceptance Criteria

- Results page displays when published, hides when not published
- Podium visually distinguishes 1st, 2nd, 3rd place with sizing and color
- Trophy icons display correctly for top 3 placements
- Results table shows full rankings with sortable columns
- Stats summary accurately reflects vote totals and participation
- Results management page shows calculation button (disabled if voting open)
- Calculate Results button triggers calculation, shows loading state, displays success
- Recalculate button shows confirmation before recalculating
- Publish Results toggle enables after calculation, shows confirmation on publish
- Disqualify toggle works per vote and updates rankings on recalculate
- User placement history displays on profile with stats
- Placement cards show trophy icons for top 3, link to event results
- All components responsive on mobile (< 768px), tablet (768px - 1023px), and desktop (≥ 1024px)
- Share results link is copyable and works correctly
- Loading states display during data fetch and mutation operations
- Error messages display helpfully if calculation or publish fails
- TypeScript compiles in strict mode with no errors
