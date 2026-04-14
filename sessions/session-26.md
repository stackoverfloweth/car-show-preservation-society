# Session 26 — Auth & User Profile Pages

## Dependencies
Sessions 05 (user API), 25 (layout shell)

## Branch
`session/26-auth-profile-pages`

## Goal
Build authentication pages (sign-in and sign-up using Clerk components), user profile editor, and public profile viewing with placement history display. This establishes the user account system and visibility controls.

## Tasks
1. Create TanStack Query hooks in `apps/web/src/hooks/api/use-users.ts`:
   - **useUser(userId)** — query hook that fetches a single user's public profile from GET /api/users/:userId
   - **useUpdateProfile()** — mutation hook for PUT /api/users/me to update authenticated user's profile
   - **useSearchUsers(query)** — query hook that searches users from GET /api/users/search?q=...
   - **useUserPlacements(userId)** — query hook that fetches placement history from GET /api/users/:userId/placements
   - All hooks should use appropriate staleTime and query keys

2. Build authentication pages:
   - **/login** — route file `apps/web/src/routes/login.tsx`: Clerk `<SignIn />` component. Center it with custom styling to match CSPS design tokens. Show "Need an account? Sign up" link to signup page.
   - **/signup** — route file `apps/web/src/routes/signup.tsx`: Clerk `<SignUp />` component, styled consistently. Show "Already have an account? Sign in" link.

3. Build user profile pages:
   - **/profile** — authenticated user's own profile edit page. Route file: `apps/web/src/routes/profile/index.tsx`. Display edit form with fields: name, email, phone, location (text input for now — Mapbox integration in session 34), profile image upload, privacy toggles (show/hide profile, show/hide location, show/hide placements). Save button calls useUpdateProfile mutation. Show success/error toast. Show loading state during save.
   - **/profile/:userId** — public profile view. Route file: `apps/web/src/routes/profile/$userId.tsx`. Display user info card, location (if not hidden), vehicle list (if exists and not hidden), placement history. Handle privacy settings: if location hidden, don't show it; if placements hidden, don't show history. Show "Edit Profile" button only if viewing own profile.

4. Create profile-related components in `apps/web/src/components/profile/`:
   - **ProfileForm.tsx** — form component for editing profile. Props: initialData (user), onSubmit (called with updated data), isLoading. Includes name, email, phone, location, image upload, privacy toggles. Use form UI components from session 25.
   - **ProfileCard.tsx** — display card showing user info, avatar, name, location. Props: user data, isOwnProfile (boolean to show edit button).
   - **PlacementHistory.tsx** — table/list showing past placements. Props: placements array, userId. Columns: event name, date, category, placement position.

5. Add protected route logic: `/profile` without userId should be accessible only to authenticated users. Redirect unauthenticated users to `/login`. Use Clerk's `useAuth()` hook in loaders or route guards.

6. Handle Clerk auth state: Use Clerk's `<ClerkProvider>` at app root (if not already done in session 04). Use `useAuth()` and `useUser()` hooks from Clerk to determine authenticated state and user data.

## Files to Create/Modify
**Create:**
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/hooks/api/use-users.ts`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/login.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/signup.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/profile/index.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/profile/$userId.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/profile/ProfileForm.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/profile/ProfileCard.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/profile/PlacementHistory.tsx`

## Acceptance Criteria
- Sign-in page loads with Clerk component and is styled to match CSPS theme
- Sign-up page loads with Clerk component
- After sign-in, user is redirected to home or profile page (Clerk default behavior)
- Authenticated user can access /profile and see the edit form
- Profile form updates save via mutation hook and show success toast
- Profile form validation shows errors for invalid inputs
- Public profile page (/profile/:userId) displays user info correctly
- Privacy settings are respected: hidden fields don't appear on public profile
- Placement history displays correctly for users with placements
- Unauthenticated users accessing /profile are redirected to /login
- Loading states show skeletons while data fetches
