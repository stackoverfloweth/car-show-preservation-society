# Session 04 — Frontend Skeleton

## Dependencies
Session 01

## Branch
`session/04-frontend-skeleton`

## Goal
Scaffold the React frontend with TanStack Router (file-based routing), TanStack Query for data fetching, Clerk authentication, Tailwind CSS with CSPS design tokens, and a basic layout shell. By the end, users should be able to sign in with Clerk and see a protected page. The frontend should have a clean, responsive navigation structure ready for future pages.

## Tasks

1. **Install Frontend Dependencies**
   - Update `apps/web/package.json` dependencies:
     - `react` — UI library
     - `react-dom` — DOM rendering
     - `@tanstack/react-router` — file-based routing
     - `@tanstack/react-query` — data fetching/caching
     - `@clerk/clerk-react` — Clerk authentication UI
     - `tailwindcss` — utility CSS
     - `@tailwindcss/vite` — Tailwind Vite plugin
   - Update dev dependencies:
     - `@types/react` — React types
     - `@types/react-dom` — DOM types
     - `@vitejs/plugin-react` — React JSX compilation
     - `vite` — bundler
     - `@tanstack/router-plugin` — Vite plugin for file-based routing
     - `typescript` — TypeScript support
     - `tailwindcss` (dev)
     - `postcss` (dev) — CSS processing

2. **Configure Vite**
   - Update `apps/web/vite.config.ts` with:
     - React plugin: `@vitejs/plugin-react`
     - TanStack Router plugin: `@tanstack/router-plugin/vite`
     - Alias `@` → `src/`
     - Base path configured (default `/`)
     - Environment variables: `VITE_API_URL`
   - Example structure:
     ```typescript
     import { defineConfig } from 'vite';
     import react from '@vitejs/plugin-react';
     import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
     
     export default defineConfig({
       plugins: [TanStackRouterVite(), react()],
       resolve: { alias: { '@': '/src' } },
       server: { port: 5173 },
     });
     ```

3. **Configure Tailwind CSS**
   - Create `apps/web/tailwind.config.ts` with:
     - Content paths: `['./index.html', './src/**/*.{js,ts,jsx,tsx}']`
     - Theme extends with CSPS design tokens:
       - **Colors:**
         - Primary (navy): `#1a2744` (dark navy)
         - Accent (gold): `#d4af37` (gold/amber)
         - Secondary (light): `#f5f5f5` (clean white/off-white)
         - Neutral grays: `#333`, `#666`, `#999`, `#ccc`
       - **Typography:**
         - Font family: `Inter` or system fonts
         - Font sizes: standard Tailwind scale (12, 14, 16, 18, 20, 24, 28, 32)
         - Line heights: relaxed, normal, tight
       - **Spacing:**
         - Standard Tailwind spacing scale (4, 8, 12, 16, 20, 24, 32, 40)
       - **Border radius:**
         - Small: `0.25rem`
         - Medium: `0.5rem`
         - Large: `1rem`
     - Plugins: none initially
   - Create `apps/web/postcss.config.js` with Tailwind processing

4. **Create Global Styles**
   - Create `apps/web/src/styles/globals.css` with:
     - `@tailwind base`, `@tailwind components`, `@tailwind utilities`
     - Custom base styles (if needed):
       - Body: font-sans, color-gray-900, antialiased
       - Links: underline-offset, hover effects
     - Accessibility: focus-visible styles, skip-to-content link
     - Print media queries

5. **Create API Client**
   - Create `apps/web/src/lib/api-client.ts` with:
     - Configured fetch wrapper that:
       - Prepends `VITE_API_URL` to all relative URLs
       - Automatically attaches Clerk session token as Bearer auth
       - Parses JSON responses
       - Handles error responses (4xx, 5xx)
       - Re-throws errors with consistent format
     - Generic methods with proper TypeScript:
       - `get<T>(url: string): Promise<T>`
       - `post<T>(url: string, body: any): Promise<T>`
       - `put<T>(url: string, body: any): Promise<T>`
       - `delete<T>(url: string): Promise<T>`
     - Clerk token retrieval: use `getToken()` from Clerk
     - Error type: `ApiError` with message and status
   - Example wrapper:
     ```typescript
     import { useAuth } from '@clerk/clerk-react';
     
     export const api = {
       async get<T>(path: string): Promise<T> {
         const { getToken } = useAuth();
         const token = await getToken();
         const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
           headers: { Authorization: `Bearer ${token}` },
         });
         if (!response.ok) throw new Error(response.statusText);
         return response.json();
       },
       // ... post, put, delete
     };
     ```

6. **Configure Clerk**
   - Create `apps/web/src/lib/clerk.ts` with:
     - Clerk configuration constants
     - Export `CLERK_PUBLISHABLE_KEY` from environment
   - Update `.env.example` with `VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx`

7. **Create Root Layout**
   - Create `apps/web/src/routes/__root.tsx` with:
     - Root route component using TanStack Router
     - Layout shell structure:
       - Header with navigation:
         - Logo/home link
         - Nav links: Events, Clubs, Garage, (Help/About if space)
         - Clerk `<UserButton />` on the right
       - Main content area: `<Outlet />`
       - Optional footer
     - Mobile responsive:
       - Hamburger menu on mobile
       - Full nav on desktop (>=768px)
       - Flex/grid layout
     - Tailwind styling with CSPS brand colors:
       - Header bg: navy primary
       - Text: white/light on dark
       - Accent links: gold on hover
     - Use Tailwind classes for responsiveness:
       - `md:flex`, `hidden md:block`, etc.

8. **Create Index Route (Home)**
   - Create `apps/web/src/routes/index.tsx` with:
     - Simple home page placeholder
     - Hero section with:
       - Large headline: "Car Show Preservation Society"
       - Subtitle: "Discover, Share, Preserve"
       - Call-to-action buttons (Sign In, Sign Up)
       - Link to /events, /clubs, /garage
     - Tailwind styling matching brand
     - Responsive layout

9. **Create Sign In Route**
   - Create `apps/web/src/routes/login.tsx` with:
     - Clerk's `<SignIn />` component wrapped in a page layout
     - Redirect to `/profile` on successful sign-in (via `redirectUrl` prop)
     - Fallback message if already signed in (link to home)
     - Centered layout, card styling

10. **Create Sign Up Route**
    - Create `apps/web/src/routes/signup.tsx` with:
      - Clerk's `<SignUp />` component wrapped in a page layout
      - Redirect to `/profile` on successful sign-up
      - Fallback message if already signed in
      - Centered layout, card styling

11. **Create Protected Profile Route**
    - Create `apps/web/src/routes/profile/index.tsx` with:
      - Use Clerk's `useAuth()` hook to check authentication
      - Redirect to `/login` if not authenticated (use route loader)
      - Display user info:
        - First name, last name, email from Clerk `useUser()` hook
        - User ID
        - Sign-out button
      - Simple card layout with Tailwind
    - Create route loader that checks auth:
      ```typescript
      export const Route = createFileRoute('/profile/')({
        beforeLoad: ({ location }) => {
          const { userId } = useAuth();
          if (!userId) {
            throw redirect({ to: '/login', search: { redirect: location.href } });
          }
        },
        component: ProfilePage,
      });
      ```

12. **Set Up Clerk Provider**
    - Update `apps/web/src/main.tsx` with:
      - Import Clerk provider: `<ClerkProvider>`
      - Set publishable key from environment
      - Wrap entire app and router
      - Configure Clerk to work with custom API URL (optional)
    - Example:
      ```typescript
      import { ClerkProvider } from '@clerk/clerk-react';
      
      <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ClerkProvider>
      ```

13. **Set Up TanStack Query**
    - Create `apps/web/src/lib/query-client.ts` with:
      - Configured `QueryClient` with defaults:
        - `staleTime: 1000 * 60 * 5` (5 minutes)
        - `gcTime: 1000 * 60 * 10` (10 minutes)
        - `retry: 1`
      - Export instance for use in providers
    - Wrap `<QueryClientProvider>` in main.tsx

14. **Configure Entry Point**
    - Update `apps/web/src/main.tsx` to:
      - Import global styles
      - Set up providers in correct order:
        1. Clerk
        2. Query Client
        3. Router
      - Mount to `#root` element
    - Create `apps/web/index.html` with:
      - DOCTYPE and meta tags
      - Viewport configuration
      - Favicon/theme color
      - `<div id="root"></div>` for React
      - Script tag for `src/main.tsx`

15. **Create TypeScript Configuration**
    - Update `apps/web/tsconfig.json` to:
      - Extend `tsconfig.base.json`
      - React JSX settings: `react-jsx`
      - Lib: DOM, ES2020
      - Strict mode enabled
      - Module resolution: bundler
      - Paths: `@/*` → `src/*`

16. **Create App Component**
    - Create `apps/web/src/App.tsx` (optional, can be removed if using pure router)
    - If used: wrap with providers, render router

17. **Test API Integration**
    - Create `apps/web/src/routes/test.tsx` (test-only route) with:
      - Button to call `GET /api/health`
      - Display response or error
      - Verify API client works
      - Can be deleted after confirming integration
    - Or add a test in profile page

18. **Update Build Scripts**
    - Update `apps/web/package.json` scripts:
      - `dev` — `vite`
      - `build` — `vite build`
      - `preview` — `vite preview`
      - `typecheck` — `tsc --noEmit`

## Files to Create/Modify

**Create:**
- `apps/web/vite.config.ts` (rewrite)
- `apps/web/tailwind.config.ts`
- `apps/web/postcss.config.js`
- `apps/web/tsconfig.json` (rewrite)
- `apps/web/index.html` (rewrite)
- `apps/web/src/main.tsx` (rewrite)
- `apps/web/src/App.tsx` (optional)
- `apps/web/src/styles/globals.css`
- `apps/web/src/lib/api-client.ts`
- `apps/web/src/lib/query-client.ts`
- `apps/web/src/lib/clerk.ts`
- `apps/web/src/routes/__root.tsx`
- `apps/web/src/routes/index.tsx`
- `apps/web/src/routes/login.tsx`
- `apps/web/src/routes/signup.tsx`
- `apps/web/src/routes/profile/index.tsx`
- `apps/web/src/routeTree.gen.ts` (auto-generated by TanStack Router)

**Modify:**
- `apps/web/package.json`
- `apps/web/.env.example`

## Acceptance Criteria

- [x] `pnpm --filter web dev` starts Vite dev server on localhost:5173 without errors
- [x] Home page (`/`) loads and displays with CSPS branding (navy, gold colors)
- [x] Navigation bar is visible with logo, nav links, and user menu
- [x] Navigation is mobile-responsive (hamburger on small screens)
- [x] `/login` route displays Clerk SignIn component and can authenticate users
- [x] `/signup` route displays Clerk SignUp component
- [x] After sign-in, user is redirected to `/profile`
- [x] `/profile` is protected: unauthenticated users redirect to `/login`
- [x] `/profile` displays user info from Clerk (name, email, user ID)
- [x] Clerk UserButton shows in header after sign-in and allows sign-out
- [x] API client successfully calls `/api/health` endpoint (CORS working)
- [x] API client automatically attaches Clerk auth token to requests
- [x] Tailwind CSS is properly configured with CSPS design tokens
- [x] TypeScript compiles cleanly with `pnpm --filter web typecheck`
- [x] No console errors in browser dev tools
- [x] All routes render without errors
- [x] TanStack Query is configured and can be used in components
- [x] Environment variables are properly validated (VITE_API_URL, VITE_CLERK_PUBLISHABLE_KEY)
- [x] ESLint and Prettier can be run on web package
