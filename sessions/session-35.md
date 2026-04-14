# Session 35 — Error Handling & Loading States

## Dependencies
Sessions 25 (layout shell), 26 (user profiles), 27 (club management), 28 (vehicle garage), 29 (events), 30 (registrations), 31 (voting), 32 (messaging), 33 (notifications)

## Branch
`session/35-error-handling`

## Goal
Add comprehensive error handling, loading skeletons, empty states, optimistic updates, and visual polish across the entire frontend application. This ensures a robust user experience with graceful degradation when data is loading or errors occur.

## Tasks

1. Create global error handling:
   - Create `apps/web/src/components/ErrorBoundary.tsx`:
     - React error boundary component that catches render errors
     - Displays user-friendly error page with: error icon, "Something went wrong" message, stack trace (dev only), "Try Again" button
     - Reset button clears error state and retries rendering
     - Logs errors to console and optionally to error monitoring service
   
   - Create `apps/web/src/components/RouteError.tsx`:
     - TanStack Router error component for route-level errors
     - Differentiates between error types:
       - 404 errors: "Page not found" with navigation suggestions
       - 403 errors: "You don't have permission to view this" with home button
       - 401 errors: "Please sign in to continue"
       - 5xx errors: "Server error, please try again later"
     - Each error type has appropriate messaging and action buttons
   
   - Configure TanStack Router not found component:
     - Create `apps/web/src/routes/404.tsx` or use router config
     - Shows "Page not found" page with search and navigation links
     - Suggests browsing events, clubs, or home page

2. Create skeleton loading components in `apps/web/src/components/ui/`:
   - `Skeleton.tsx`:
     - Base skeleton animation component with pulse effect
     - Accepts className and arbitrary height/width
     - Uses Tailwind animate-pulse with gray-200 background
     - Smooth fade-in when real content loads
   
   - Create skeleton variants in respective domain folders:
     - `apps/web/src/components/events/EventCardSkeleton.tsx`: matches EventCard layout
     - `apps/web/src/components/events/EventDetailSkeleton.tsx`: matches event detail page
     - `apps/web/src/components/clubs/ClubCardSkeleton.tsx`: matches club card
     - `apps/web/src/components/vehicles/VehicleCardSkeleton.tsx`: matches vehicle card
     - `apps/web/src/components/registrations/RegistrationTableSkeleton.tsx`: matches table layout
     - `apps/web/src/components/voting/ResultsSkeleton.tsx`: matches results display
     - `apps/web/src/components/messages/MessageListSkeleton.tsx`: matches message list

3. Create empty state components:
   - Create `apps/web/src/components/ui/EmptyState.tsx`:
     - Generic empty state with: icon (lucide-react), title, description, optional action button
     - Tailored styling with neutral colors
     - Accepts props: `icon`, `title`, `description`, `actionLabel?`, `onAction?`
   
   - Use `EmptyState` throughout app for:
     - "No events found" with "Create event" button
     - "No vehicles in your garage" with "Add vehicle" button
     - "No registrations" with "Browse events" button
     - "No messages" with "Start a conversation" button
     - "No results yet" on voting results page (before results available)
     - "No club members" on club management page
     - "No sponsors" on event sponsors page

4. Implement optimistic updates for mutations:
   - Voting (ballot submission):
     - Update ballot UI optimistically before server confirmation
     - Update vote tally in real-time
     - Rollback on error with toast notification
   
   - Check-in (registration check-in):
     - Optimistically show assigned carId immediately
     - Update registration status to "checked-in"
     - Rollback if check-in fails
   
   - Message read status:
     - Mark message as read in UI immediately
     - Update read count optimistically
     - Sync with server in background
   
   - Profile update:
     - Show updated values immediately
     - Disable form during submission
     - Rollback on error

5. Improve form error handling:
   - All form components show inline validation errors:
     - Error messages displayed directly below relevant field
     - Red border on invalid input
     - Error text in red color (#EF4444)
   
   - API errors display as toast notifications:
     - Consistent toast styling (top-right, auto-dismiss after 5s)
     - Include error message from server
     - Add "Retry" option for mutations that support it
   
   - Network error banner:
     - Sticky banner at top: "Connection lost. Changes will be saved when you're back online."
     - Auto-dismiss when connection restored
     - Applies to all queries/mutations

6. Add TanStack Query global error handler:
   - Configure in `apps/web/src/lib/api-client.ts`:
     - Global error callback for all failed queries
     - Show toast for failed mutations
     - Suppress toasts for specific errors (e.g., 404 on optional data)
   
   - Automatic retry strategy:
     - Retry transient errors (network, 5xx) with exponential backoff
     - Max 3 retries
     - Do NOT retry for 4xx errors (they're intentional)
   
   - Distinguish between user errors (validation) and system errors

7. Polish page transitions:
   - Implement skeleton loading for all data-dependent routes
   - No layout shift when skeletons replaced with real content:
     - Set height on skeleton to match final content
     - Use proper spacing that matches real components
   
   - Smooth fade-in animation for loaded content:
     - Use Tailwind opacity transition (transition-opacity duration-200)
   
   - Loading state indicators for lazy-loaded components

## Files to Create
- `apps/web/src/components/ErrorBoundary.tsx`
- `apps/web/src/components/RouteError.tsx`
- `apps/web/src/routes/404.tsx`
- `apps/web/src/components/ui/Skeleton.tsx`
- `apps/web/src/components/ui/EmptyState.tsx`
- `apps/web/src/components/events/EventCardSkeleton.tsx`
- `apps/web/src/components/events/EventDetailSkeleton.tsx`
- `apps/web/src/components/clubs/ClubCardSkeleton.tsx`
- `apps/web/src/components/vehicles/VehicleCardSkeleton.tsx`
- `apps/web/src/components/registrations/RegistrationTableSkeleton.tsx`
- `apps/web/src/components/voting/ResultsSkeleton.tsx`
- `apps/web/src/components/messages/MessageListSkeleton.tsx`

## Files to Modify
- `apps/web/src/main.tsx` (wrap app with ErrorBoundary)
- `apps/web/src/routes/__root.tsx` (configure router error handling)
- `apps/web/src/lib/api-client.ts` (add global error handler and retry logic)
- All route files that fetch data (use loading states and skeletons)
- All major list/detail components (add empty state fallback)
- All form components (add inline error display)
- `apps/web/src/styles/globals.css` (add toast styles if needed)
- `apps/web/package.json` (if toast library not already included)

## Acceptance Criteria
- App doesn't crash on uncaught errors — ErrorBoundary catches and displays user-friendly page
- All list pages show skeleton loaders while data is fetching
- All empty lists show contextual empty state with call-to-action
- 404 page displays for invalid routes with helpful navigation
- API errors show toast notifications with retry option where applicable
- Optimistic updates work for voting, check-in, and message read status
- Forms display inline validation errors below each field
- Page loads have no layout shift (skeletons match final dimensions)
- Network disconnection shows banner; banner dismisses when online
- TanStack Query retries transient errors automatically
- Smooth fade-in animation when content loads
- TypeScript compiles cleanly with strict mode
- All new components have proper TypeScript types
- Mobile responsive loading states
