# Session 33 — Messaging Pages

## Dependencies
Session 21 (messaging API), 25 (layout shell)

## Branch
`session/33-messaging-pages`

## Goal
Build the messaging inbox, message detail view, and compose interface supporting direct messages, event broadcasts, and club broadcasts. Enable users to receive notifications, read messages, and send communications to individuals or groups.

## Tasks

### TanStack Query Hooks

1. Create `apps/web/src/hooks/api/use-messages.ts` with the following hooks:
   - `useInbox(filters?: { type?: 'all' | 'direct' | 'eventBroadcast' | 'clubBroadcast'; page?: number; pageSize?: number })` — fetch paginated list of received messages
   - `useSentMessages(filters?: { page?: number; pageSize?: number })` — fetch list of messages sent by authenticated user
   - `useMessage(messageId: string)` — fetch single message detail and mark as read on load
   - `useSendMessage()` — mutation for POST /api/messages (sends direct message, event broadcast, or club broadcast)
   - `useEventMessages(eventId: string)` — fetch all messages for a specific event (broadcasts)
   - `useClubMessages(clubId: string)` — fetch all messages for a specific club (broadcasts)
   - `useUnreadCount()` — fetch unread message count for current user
   - Export query option factories following TanStack Query conventions
   - All hooks include proper error handling and cache invalidation
   - Inbox query should support pagination and filtering

### Inbox Page

2. Create `apps/web/src/routes/messages/index.tsx`:
   - Page title "Messages"
   - Tab navigation: "Inbox" and "Sent"
   - Inbox tab shows:
     - Filter controls: dropdown to show "All", "Direct Messages", "Event Broadcasts", "Club Broadcasts"
     - Search bar: search by subject or sender name (debounced)
     - Message list via MessageList component:
       - Each message as MessageCard component
       - Columns/sections: sender avatar, sender name, subject, message preview (truncated), timestamp, unread indicator
       - Hover state with cursor pointer
       - Unread messages highlighted (bold subject, background tint)
       - Click to open message detail
       - Right-click context menu (optional): mark as read, delete, archive
     - Pagination with page numbers and next/previous buttons
     - Loading skeleton states while fetching
     - Empty state if no messages
   - Sent tab shows:
     - Similar layout but shows recipients instead of sender
     - Subject, recipient count or name, timestamp, "Read by X of Y" status (if available)
     - No unread indicators
   - Unread count badge in navigation (TopNav and MobileNav) shows unread message count

### Message Detail Page

3. Create `apps/web/src/routes/messages/$messageId.tsx`:
   - Full message view:
     - Header section showing: subject, from (sender name + avatar), to (recipient info or "All registrants of [Event]" / "All members of [Club]"), timestamp
     - Body section: full message text (rendered as markdown or plain text based on storage)
     - Metadata: message type badge (Direct/Event Broadcast/Club Broadcast), read count if applicable
   - Auto-marks message as read on page load
   - Actions:
     - Reply button (visible only for direct messages)
     - Delete button (for received messages)
     - Print button (optional)
     - Back to inbox link
   - Responsive layout (message text wraps on mobile, sender info stacks)
   - Loading state while fetching message

### Compose Message Page

4. Create `apps/web/src/routes/messages/compose.tsx`:
   - Page title "New Message"
   - Requires authentication (redirect to login if needed)
   - Message type selector at top:
     - Radio or button group: "Direct", "Event Broadcast", "Club Broadcast"
     - Changes form fields based on selection
   - Form fields:
     - **Direct message:**
       - Recipient selector: user search input (debounced), shows user cards below input with avatar + name
       - Click user card to select recipient
       - Selected recipient shown as chip or tag with remove button
     - **Event Broadcast:**
       - Event selector: dropdown of events user manages (populated from API)
       - Shows selected event details: name, date, registration count
     - **Club Broadcast:**
       - Club selector: dropdown of clubs user is member of (populated from API)
       - Shows selected club details: name, member count
     - Subject field: text input (required)
     - Message body field: textarea (required, large)
   - Send button:
     - Primary style, labels change based on message type: "Send Message", "Send to Event", "Send to Club"
     - On click for broadcasts: show confirmation modal with recipient count ("This will be sent to X registrants" / "This will be sent to X members")
     - Loading state on button during submission
   - Character count for message body (optional, e.g., "1250 / 5000")
   - Draft auto-save on each input change (optional, debounced)
   - On successful send: redirect to message detail page
   - Error messages for validation failures

### Message Components

5. Create `apps/web/src/components/messages/MessageList.tsx`:
   - Props: messages array, onMessageClick callback, loading state
   - Renders list of MessageCard components
   - Loading skeleton states
   - Empty state display with helpful message
   - Pagination controls

6. Create `apps/web/src/components/messages/MessageCard.tsx`:
   - Props: message object, onClick handler, isUnread
   - Card or list item displaying message preview:
     - Sender avatar (left side)
     - Sender name (or "All registrants of Event X" for broadcasts)
     - Subject (bold if unread)
     - Message preview (first 100 chars, truncated with ellipsis)
     - Timestamp (relative, e.g., "2 hours ago")
     - Unread dot indicator (right side, visible if isUnread)
     - Message type badge (optional, small): Direct/Broadcast
   - Responsive: stacks on mobile
   - Hover styling: slight shadow, background color change
   - Click handler navigates to message detail

7. Create `apps/web/src/components/messages/MessageDetail.tsx`:
   - Props: message object, loading state
   - Displays: subject, from, to, timestamp, body
   - Reply button (conditional)
   - Delete button (conditional)
   - Back link
   - Loading states

8. Create `apps/web/src/components/messages/ComposeForm.tsx`:
   - Props: onSuccess callback
   - Manages: message type selection, form data, validation
   - Renders: type selector, recipient/event/club selector, subject, body, send button
   - Handles form submission
   - Shows validation errors inline

9. Create `apps/web/src/components/messages/RecipientSelector.tsx`:
   - Props: messageType ('direct' | 'eventBroadcast' | 'clubBroadcast'), onSelect callback
   - Renders different UI based on messageType:
     - **Direct:** user search input with debounced results, shows user cards
     - **Event:** event dropdown selector
     - **Club:** club dropdown selector
   - Returns selected recipient/event/club data on select

10. Create `apps/web/src/components/messages/UnreadBadge.tsx`:
    - Props: count number
    - Small circular badge showing unread message count
    - Red/primary color background
    - White text
    - Size variants (sm, md)
    - Hidden if count is 0
    - Used in TopNav and MobileNav

## Files to Create/Modify

**Create:**
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/hooks/api/use-messages.ts`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/messages/index.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/messages/$messageId.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/messages/compose.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/messages/MessageList.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/messages/MessageCard.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/messages/MessageDetail.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/messages/ComposeForm.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/messages/RecipientSelector.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/messages/UnreadBadge.tsx`

**Modify:**
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/layout/TopNav.tsx` — add unread count badge to messages nav link
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/layout/MobileNav.tsx` — add unread count badge to messages nav tab

## Acceptance Criteria

- Inbox displays all received messages with sender name, subject, preview, and timestamp
- Messages marked as unread are visually distinct (bold, background tint)
- Inbox filters work: show all, direct messages only, event broadcasts only, club broadcasts only
- Message search is debounced and filters inbox by subject or sender
- Pagination navigates through messages correctly
- Message detail page displays full message content
- Message automatically marks as read on page load
- Sent messages tab shows messages sent by user
- Compose page switches forms based on message type (direct/event broadcast/club broadcast)
- Direct message shows user search with recipient selection
- Event broadcast shows event dropdown and displays registration count
- Club broadcast shows club dropdown and displays member count
- Broadcast compose shows confirmation modal with recipient count
- Send button disabled during submission (loading state)
- Successful send redirects to sent message or confirmation page
- Unread count badge displays in TopNav and MobileNav
- Unread count updates when message is read
- All pages responsive on mobile (< 768px), tablet (768px - 1023px), and desktop (≥ 1024px)
- Loading skeleton states display during data fetching
- Empty states display with helpful messages
- Validation errors display inline with recovery options
- TypeScript compiles in strict mode with no errors
