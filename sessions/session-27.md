# Session 27 — Club Pages

## Dependencies
Sessions 06, 07 (club API + memberships), 25 (layout shell)

## Branch
`session/27-club-pages`

## Goal
Build all club-related frontend pages: listing with search and pagination, detailed club view, club creation and editing, and membership management interface. This enables users to discover, create, and manage clubs.

## Tasks
1. Create TanStack Query hooks in `apps/web/src/hooks/api/use-clubs.ts`:
   - **useClubs(filter?)** — query hook for GET /api/clubs with optional filters (name, skip pagination params)
   - **useClub(clubId)** — query hook for GET /api/clubs/:clubId with relations
   - **useCreateClub()** — mutation hook for POST /api/clubs
   - **useUpdateClub(clubId)** — mutation hook for PUT /api/clubs/:clubId
   - **useDeleteClub(clubId)** — mutation hook for DELETE /api/clubs/:clubId

2. Create membership hooks in `apps/web/src/hooks/api/use-club-memberships.ts`:
   - **useClubMembers(clubId)** — query hook for GET /api/clubs/:clubId/members
   - **useJoinClub(clubId)** — mutation for POST /api/clubs/:clubId/join
   - **useApplyToClub(clubId, message?)** — mutation for POST /api/clubs/:clubId/apply with optional message
   - **useInviteMember(clubId)** — mutation for POST /api/clubs/:clubId/invite with email
   - **useRemoveMember(clubId, userId)** — mutation for DELETE /api/clubs/:clubId/members/:userId
   - **useApproveApplication(clubId, applicationId)** — mutation for PUT /api/club-applications/:applicationId/approve
   - **useRejectApplication(clubId, applicationId)** — mutation for PUT /api/club-applications/:applicationId/reject

3. Build club listing page (**/clubs**):
   - Route file: `apps/web/src/routes/clubs/index.tsx`
   - Display club cards in a grid layout
   - Search bar at top (debounced search by club name)
   - Pagination controls
   - Each card shows: club logo, name, member count, event count
   - "Create Club" button (visible if authenticated) in top right
   - Clicking card navigates to club detail page

4. Build club detail page (**/clubs/:clubId**):
   - Route file: `apps/web/src/routes/clubs/$clubId.tsx`
   - Display club header with logo, name, description
   - Show member count and join status
   - Upcoming events section (list/grid of next N events)
   - Past events section (list/grid of recent past events)
   - Sponsors section (displays club sponsors)
   - If authenticated user is not a member:
     - If club.joinable === true: "Join Club" button
     - If club.joinable === false: "Apply to Join" button (shows modal for optional message)
   - If already a member: show "Member" badge, show "Leave Club" button
   - If authenticated user is club admin: show "Edit Club" button

5. Build club creation page (**/clubs/new**):
   - Route file: `apps/web/src/routes/clubs/new.tsx`
   - Require authentication (redirect to /login if not)
   - Form with fields: name, description, logo URL (or upload button), joinable toggle
   - Submit button calls useCreateClub
   - On success, redirect to new club's detail page
   - Show validation errors

6. Build club editing page (**/clubs/:clubId/edit**):
   - Route file: `apps/web/src/routes/clubs/$clubId/edit.tsx`
   - Require club admin permission (redirect if not authorized)
   - Tabbed interface:
     - **General** — edit name, description, logo, joinable toggle
     - **Members** — show member list with actions (remove, change role). Show invite modal/form to add new members by email.
     - **Applications** — if joinable=false, show pending applications with approve/reject buttons
     - **Sponsors** — show club sponsors (CRUD interface, see session 24)
   - Save changes via useUpdateClub
   - Show success/error toasts

7. Build components in `apps/web/src/components/clubs/`:
   - **ClubCard.tsx** — card component showing club summary. Props: club data, onClick handler.
   - **ClubForm.tsx** — reusable form for create/edit. Props: initialData (optional), onSubmit, isLoading.
   - **MemberList.tsx** — table of club members. Props: members, isAdmin (bool to show actions), onRemove callback, onRoleChange callback.
   - **InviteMemberModal.tsx** — modal form to invite member by email. Props: clubId, onClose, onSuccess.
   - **ApplicationList.tsx** — table of pending applications (if joinable=false). Props: applications, onApprove, onReject callbacks.
   - **ClubSponsorList.tsx** — display list of club sponsors (read-only or editable if admin). Props: sponsors, isAdmin, clubId.
   - **JoinClubButton.tsx** — button that either joins immediately (if joinable) or shows apply modal (if not).

## Files to Create/Modify
**Create:**
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/hooks/api/use-clubs.ts`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/hooks/api/use-club-memberships.ts`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/clubs/index.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/clubs/new.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/clubs/$clubId.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/clubs/$clubId/edit.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/clubs/ClubCard.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/clubs/ClubForm.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/clubs/MemberList.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/clubs/InviteMemberModal.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/clubs/ApplicationList.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/clubs/ClubSponsorList.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/clubs/JoinClubButton.tsx`

## Acceptance Criteria
- Club listing page loads with search and pagination working
- Club cards display with correct data (name, member count, event count)
- Club detail page shows all sections (header, members, events, sponsors) correctly
- Join/apply flow works: joinable clubs show "Join" button, non-joinable show "Apply" with modal
- Club creation form validates and creates club successfully
- Club admin can access edit page and modify general info, manage members, view sponsors
- Membership management works: can invite, remove, approve/reject applications
- Member list shows correct permissions and action availability
- All pages show loading states while fetching
- Error states display helpful messages
- Role-based UI shows/hides admin controls appropriately
