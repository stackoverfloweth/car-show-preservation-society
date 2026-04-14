# Session 25 — Frontend Layout & Navigation Shell

## Dependencies
Session 04 (frontend skeleton)

## Branch
`session/25-layout-shell`

## Goal
Build the production-ready responsive layout shell with top navigation, mobile bottom navigation, breadcrumbs, and the comprehensive base component library that all other frontend pages will depend on. This session establishes the visual foundation and common UI patterns for the entire application.

## Tasks
1. Build layout components in `apps/web/src/components/layout/`:
   - **AppShell.tsx** — main wrapper that applies consistent layout structure. Children render in main content area with proper padding/margin. Includes TopNav, MobileNav, and main content layout.
   - **TopNav.tsx** — horizontal navigation bar: CSPS logo/brand on left (links to /), navigation links in center (Events, Clubs, Garage), auth section on right (Clerk UserButton for authenticated users or Sign In link for guests)
   - **MobileNav.tsx** — bottom tab bar for mobile (visible on screens < 768px). Tabs: Home, Events, Clubs, Garage, Profile. Show/hide based on screen size with Tailwind breakpoints.
   - **Breadcrumbs.tsx** — auto-generated navigation breadcrumbs from TanStack Router location context. Format: Home > Section > SubSection. Clickable breadcrumbs navigate back.
   - **PageHeader.tsx** — reusable component for page title sections. Props: title (required), subtitle (optional), action buttons (optional). Appears at top of page content.
   - **Container.tsx** — max-width (1200px) centered container with consistent horizontal padding. Used to wrap all page content.

2. Build base UI components in `apps/web/src/components/ui/`:
   - **Button.tsx** — variants (primary, secondary, ghost, danger), sizes (sm, md, lg), loading state with spinner, disabled state, icon support
   - **Input.tsx** — text input with optional label, placeholder, error message, help text, required indicator
   - **TextArea.tsx** — multi-line input, similar structure to Input
   - **Select.tsx** — dropdown component with options, label, error state, placeholder
   - **Card.tsx** — container component with sections: header (optional), body, footer (optional). Shadows and rounded corners.
   - **Modal.tsx** — dialog overlay with scrim, keyboard escape support, accessible with aria-modal, title and body sections
   - **Badge.tsx** — inline status badges with variants (success, warning, error, info). Used for status displays like "Upcoming", "Checked In", "Paid"
   - **Avatar.tsx** — circular user/club avatar with image fallback. If no image, display initials. Size variants.
   - **EmptyState.tsx** — placeholder component for empty lists. Props: icon, title, description, action button (optional)
   - **LoadingSkeleton.tsx** — animated skeleton loader. Common variant for cards, lists, text lines
   - **Pagination.tsx** — page navigation controls. Props: current page, total pages, onPageChange callback
   - **SearchInput.tsx** — input field with search icon (left side), debounced onChange event, clear button on right
   - **Toast.tsx** — notification toast. Use lightweight library like sonner or shadcn/ui toast. Supports success, error, info, warning

3. Update `apps/web/src/routes/__root.tsx` to use AppShell as root layout. Wrap router outlet with AppShell.

4. Set up toast/notification provider at root level (wrap Router with ToastProvider)

5. Define CSPS design tokens in `apps/web/src/styles/globals.css`:
   - Color palette: primary, secondary, accent, success, warning, error, neutral grays
   - Spacing scale: use Tailwind defaults
   - Typography: define font families, sizes, weights via Tailwind theme
   - Shadows and border-radius standards

6. All components should be responsive (mobile-first Tailwind approach). Use `sm:`, `md:`, `lg:` breakpoints appropriately.

7. All components must be fully typed with TypeScript. Define component prop interfaces clearly.

## Files to Create/Modify
**Create:**
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/layout/AppShell.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/layout/TopNav.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/layout/MobileNav.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/layout/Breadcrumbs.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/layout/PageHeader.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/layout/Container.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/ui/Button.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/ui/Input.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/ui/TextArea.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/ui/Select.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/ui/Card.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/ui/Modal.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/ui/Badge.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/ui/Avatar.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/ui/EmptyState.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/ui/LoadingSkeleton.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/ui/Pagination.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/ui/SearchInput.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/components/ui/Toast.tsx`

**Modify:**
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/routes/__root.tsx`
- `/Users/evansutherland/Development/car-show-preservation-society/apps/web/src/styles/globals.css`

## Acceptance Criteria
- Layout renders correctly on desktop (≥1024px), tablet (768px-1023px), and mobile (<768px)
- TopNav displays with logo on left, nav links in center, auth on right
- MobileNav appears only on mobile and contains all main navigation targets
- Navigation links work correctly with TanStack Router (active link styling)
- All UI components render with proper Tailwind styling (no unstyled defaults)
- Button component supports all variants and sizes
- Input/TextArea show validation errors
- Modal opens/closes, supports keyboard escape, maintains focus
- Toast/notification system displays without errors
- Loading states (skeletons) animate smoothly
- EmptyState displays helpful message when list is empty
- Pagination controls work and reflect correct page state
- SearchInput shows debounced search with clear button
- All components pass TypeScript strict mode
