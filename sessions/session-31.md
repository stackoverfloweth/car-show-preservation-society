# Session 31 — Voting Pages

## Dependencies
Sessions 13, 14, 15 (ballot system + guest voting + kiosk API), 25 (layout shell)

## Branch
`session/31-voting-pages`

## Goal
Build all three voting interfaces — authenticated driver voting in the app, kiosk mode for shared devices at events, and guest ballot completion from shared links. Support multiple ballots per driver, vote modification, sharing, and different UI optimizations for each context.

## Tasks

### TanStack Query Hooks

1. Create `apps/web/src/hooks/api/use-ballots.ts` with the following hooks:
   - `useMyBallots(eventId: string)` — list ballots for authenticated user at specific event with included voting categories and current votes
   - `useBallot(ballotId: string)` — single ballot detail with all vote entries and category information
   - `useCreateBallot(eventId: string)` — mutation for POST /api/events/:eventId/ballots to create new ballot for user
   - `useCastVotes(ballotId: string)` — mutation for PUT /api/ballots/:id/votes to save vote entries
   - `useShareBallot(ballotId: string)` — mutation for POST /api/ballots/:id/share (via email or phone)
   - `useGuestBallot(ballotId: string, accessToken?: string)` — fetch guest ballot without authentication
   - `useCastGuestVotes(ballotId: string, accessToken?: string)` — mutation for guest vote submission (no auth required)
   - `useKioskAuth(eventId: string)` — mutation for POST /api/events/:eventId/kiosk/auth (carId + registrationCode login)
   - `useKioskBallots(kioskToken: string)` — fetch ballots using kiosk authentication token
   - Export query option factories following TanStack Query conventions
   - All hooks include proper error handling and cache invalidation

### Driver Voting Page

2. Create `apps/web/src/routes/events/$eventId.vote.tsx`:
   - Page title "[Event Name] Voting"
   - Requires authentication (redirect to login if needed)
   - Display voting window status: "Not Started", "Voting Open", "Voting Closed" with countdown timer if applicable
   - Load user's ballots for the event
   - For each ballot (typically 1, but support multiple):
     - Ballot card with expandable/collapsible state
     - Card header shows "Ballot [N] of [Total]" and status
     - Expanded view shows voting categories list
     - Per voting category row:
       - Category name and description
       - Car ID input field (number type) with validation
       - "Scan QR" button placeholder for future QR scanning implementation
       - Inline validation messages for each input
       - Vote count limit display if applicable
     - Submit button for each ballot: "Submit Votes" or "Update Votes"
     - Success toast on successful vote submission
     - Error messages on validation failure
   - "Share Ballot" button per ballot: opens ShareBallotModal
   - "All Ballots Cast" message if all ballots have been submitted (with option to modify votes)
   - Disable voting interface if event voting window is closed
   - Loading states during data fetch and submission
   - Error state display with recovery options

### Kiosk Voting Page

3. Create `apps/web/src/routes/vote/kiosk/$eventId.tsx`:
   - **IMPORTANT:** Standalone page with NO layout shell wrapper — full-screen, dedicated interface
   - Not authenticated with user account (uses device-level kiosk token)
   - Two-part flow:

   **Kiosk Login Screen:**
   - Event name and logo displayed at top
   - Large, prominent input fields for:
     - Car ID (number field with large font)
     - Registration Code (text field with large font)
   - Large "Start Voting" button (primary style, touch-friendly size)
   - On error: shake animation on form, error message display, shake clears on next input
   - On successful auth: transition to ballot interface

   **Kiosk Ballot Interface:**
   - Header showing event name
   - Touch-optimized ballot UI:
     - Large category labels (readable from arm's length)
     - Large number inputs for carId entries (big font, touch-friendly)
     - Large "Submit Votes" button (primary style)
     - Large "Done — Next Voter" button (secondary style) to reset form
   - Voting category loop through ballot categories same as driver voting
   - Inactivity timer display (countdown showing time remaining before auto-logout)
   - Auto-logout after 2 minutes of inactivity:
     - Count down timer visible to user (shows remaining time)
     - Resets on any user interaction (input, button click)
     - On timeout: return to login screen automatically
   - Loading state on submit button during vote submission
   - Success confirmation after vote submission before showing "Next Voter" button
   - Error messages for validation failures
   - "Logout" button to manually return to login screen

### Guest Voting Page

4. Create `apps/web/src/routes/vote/guest/$ballotId.tsx`:
   - **IMPORTANT:** Standalone page with NO layout shell wrapper — full-screen, branded for guest experience
   - Publicly accessible without authentication (requires valid ballotId)
   - Branded header section showing:
     - Event name prominently
     - Message: "You've been invited to vote at [Event Name]"
   - Voting categories section:
     - List of voting categories for the ballot
     - Car ID input field for each category (same as driver voting)
     - Category name and description
     - Validation inline
   - Large "Submit Ballot" button
   - Success page after submission:
     - Thank you message: "Thank you for voting at [Event Name]!"
     - Display submitted vote count
     - Optional: show event details
     - Back to home link or close window option
   - Disabled state if ballot already completed: "This ballot has already been submitted" message with explanation
   - Loading states during submission
   - Error messages with recovery options

### Voting Components

5. Create `apps/web/src/components/voting/BallotCard.tsx`:
   - Props: ballot object, ballotNumber, onVotesSubmit callback, readOnly?
   - Card wrapper showing ballot header
   - Expandable/collapsible content with toggle button
   - Shows "[N] of [total] ballots" in header
   - Renders nested VoteCategoryRow components
   - Submit button for the ballot
   - Share button integration
   - Loading and error states

6. Create `apps/web/src/components/voting/VoteCategoryRow.tsx`:
   - Props: category object, currentVote?, onChange callback, readOnly?
   - Single row layout: category info + input field
   - Left side: category name, description, metadata
   - Right side: CarIdInput component
   - Validation error display below input
   - Vote count display if applicable
   - Responsive layout (stacks on mobile)

7. Create `apps/web/src/components/voting/CarIdInput.tsx`:
   - Props: value, onChange, error?, onScanClick?, disabled?
   - Number input field with large font
   - Placeholder text: "Enter car #"
   - Validation styling: red border on error
   - Optional "Scan QR" button placeholder
   - Clear button on input
   - Numeric validation (reject non-numbers)
   - Accessible labels and aria attributes

8. Create `apps/web/src/components/voting/ShareBallotModal.tsx`:
   - Props: ballotId, onClose, isOpen
   - Modal dialog
   - Title: "Share This Ballot"
   - Two tabs or sections: "Email" and "Phone"
   - Email tab: email input, "Send" button, success message on send
   - Phone tab: phone input (with country code selector), "Send" button, success message
   - Alternative: "Copy Link" button to copy ballot link to clipboard
   - Copy to clipboard feedback (toast)
   - Loading state during send
   - Error messages for validation
   - Close button or ESC key to close

9. Create `apps/web/src/components/voting/VotingStatus.tsx`:
   - Props: event object (with votingStartDate, votingEndDate)
   - Displays status badge and timing info
   - States:
     - "Not Started": gray badge, shows start date
     - "Voting Open": green badge, shows countdown timer to end time
     - "Closed": red badge, shows closed date
   - Countdown timer updates every second
   - Responsive styling for different screen sizes

10. Create `apps/web/src/components/voting/KioskLogin.tsx`:
    - Props: eventId, onLoginSuccess callback, isLoading
    - Full-screen login form for kiosk mode
    - Event name/logo at top
    - Large input fields for Car ID and Registration Code
    - Large submit button
    - Error shake animation on failed auth
    - Auto-focus on Car ID input
    - Touch-optimized sizing and spacing

11. Create `apps/web/src/components/voting/KioskBallot.tsx`:
    - Props: ballot object, onVotesSubmit callback, onLogout, inactivityCountdown
    - Touch-optimized ballot interface
    - Large category labels
    - Large input fields
    - Large action buttons
    - Displays inactivity countdown timer
    - Loads user's ballots for kiosk session

12. Create `apps/web/src/components/voting/GuestBallot.tsx`:
    - Props: ballot object, onSubmit callback, isLoading
    - Branded voting interface for guest
    - Category list with inputs
    - Submit button
    - Thank you message after submission
    - Completion message display

13. Create `apps/web/src/components/voting/InactivityTimer.tsx`:
    - Props: timeout (ms), onTimeout callback, isActive
    - Displays countdown in readable format (e.g., "2:00")
    - Resets on activity detection
    - Visual warning when time < 30 seconds (color change)
    - Calls onTimeout callback when time expires
    - Can be manually reset

## Files to Create/Modify

**Create:**
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/hooks/api/use-ballots.ts`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/events/$eventId.vote.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/vote/kiosk/$eventId.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/vote/guest/$ballotId.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/voting/BallotCard.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/voting/VoteCategoryRow.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/voting/CarIdInput.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/voting/ShareBallotModal.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/voting/VotingStatus.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/voting/KioskLogin.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/voting/KioskBallot.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/voting/GuestBallot.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/voting/InactivityTimer.tsx`

## Acceptance Criteria

- Driver voting page loads user's ballots for the event
- Voting status accurately reflects event voting window (not started, open, closed)
- Driver can view all voting categories and submit votes for each
- Vote modification works while voting window is open
- Ballot sharing via email/phone works correctly (creates guest ballot link)
- Ballot share link generates correctly and is copyable
- Kiosk login accepts Car ID and Registration Code combination
- Kiosk auth failure shows shake animation and error message
- Kiosk ballot interface is optimized for touch (large inputs, buttons)
- Kiosk auto-logout after 2 minutes inactivity with countdown timer
- Inactivity resets on any user interaction
- Guest ballot accessible without authentication via shared link
- Guest ballot displays voting categories and accepts votes
- Guest ballot shows "already submitted" if previously completed
- Guest ballot thank you page displays after submission
- All voting pages responsive on mobile
- Kiosk and guest pages are full-screen without layout shell
- All validation errors display inline with helpful messages
- Loading states display throughout submission and fetch operations
- QR scan button is placeholder-ready for future implementation
- TypeScript compiles in strict mode with no errors
