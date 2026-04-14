# Session 36 — SEO & Performance

## Dependencies
All frontend sessions (25–35)

## Branch
`session/36-seo-performance`

## Goal
Optimize the frontend for search engine visibility (meta tags on public pages) and runtime performance (code splitting, image optimization, bundle analysis). Ensure the application is discoverable and loads quickly.

## Tasks

1. Add SEO meta tags using TanStack Router:
   - Create `apps/web/src/lib/seo.ts`:
     - Helper function `createMeta(title, description, imageUrl?, canonical?)` to generate meta tag objects
     - Helper for structured data (JSON-LD) generation
   
   - Update public routes with meta tags:
     - `apps/web/src/routes/__root.tsx` (app shell):
       - Default title: "Car Show Preservation Society"
       - Default description: "Join the car show community. Organize events, register vehicles, vote on cars, and connect with fellow enthusiasts."
     
     - `apps/web/src/routes/index.tsx` (home):
       - Title: "Car Show Preservation Society | Events & Community"
       - Description: "Discover upcoming car shows, create events, and vote on your favorite vehicles."
     
     - `apps/web/src/routes/events/index.tsx` (event listing):
       - Title: "Car Shows & Events | CSPS"
       - Description: "Browse upcoming car shows and events. Filter by location and date."
     
     - `apps/web/src/routes/events/new.tsx` (create event):
       - Title: "Create New Event | CSPS"
       - Description: "Host a car show and manage registration, voting, and results."
     
     - `apps/web/src/routes/events/$eventId.tsx` (event detail):
       - Title: "[Event Name] | CSPS"
       - Description: "Register and vote at [Event Name] on [Date]"
       - og:image: first event image (if available)
       - og:url: full event URL
       - Structured data (Event schema with name, date, location, organizer)
     
     - `apps/web/src/routes/clubs/index.tsx` (club listing):
       - Title: "Car Clubs | CSPS"
       - Description: "Discover car clubs and connect with fellow enthusiasts."
     
     - `apps/web/src/routes/clubs/$clubId.tsx` (club detail):
       - Title: "[Club Name] | CSPS"
       - Description: Club description (first 160 characters)
       - og:image: club logo or featured image
     
     - `apps/web/src/routes/profile/$userId.tsx` (user profile):
       - Title: "[User Name] | CSPS"
       - Description: User bio or "Member of [Club Names]"
       - og:image: profile picture
     
     - `apps/web/src/routes/events/$eventId/results.tsx` (event results):
       - Title: "[Event Name] Results | CSPS"
       - Description: "View voting results from [Event Name]"

2. Add Open Graph tags for social sharing:
   - Include in all public pages:
     - og:title (same as page title)
     - og:description (same as meta description)
     - og:image (relevant image, min 1200x630px)
     - og:url (canonical URL)
     - og:type (website, article, etc.)
   
   - Fallback image for pages without specific image:
     - CSPS logo or default brand image (stored in public/)

3. Create `apps/web/src/lib/seo.ts`:
   - Export helper functions:
     - `generateEventSchema(event)` — JSON-LD Event schema
     - `generateOrganizationSchema()` — JSON-LD Organization schema
     - `generateBreadcrumbSchema(items)` — JSON-LD BreadcrumbList schema
   
   - Helper to inject structured data in page head

4. Image optimization:
   - Create `apps/web/src/components/ui/CloudinaryImage.tsx`:
     - Takes props: `src` (Cloudinary URL), `alt`, `width`, `height`, `className?`
     - Generates responsive srcset using Cloudinary URL transforms:
       - `w_400,dpr_1` for small screens
       - `w_800,dpr_1` for medium screens
       - `w_1200,dpr_1` for large screens
       - `w_1600,dpr_2` for 2x DPI devices
     - Uses `loading="lazy"` for below-fold images
     - Includes explicit `width` and `height` attributes to prevent CLS (Cumulative Layout Shift)
     - Renders as `<img>` with srcset and sizes attribute
   
   - Replace all `<img>` tags throughout the app:
     - Event images in cards and detail pages
     - Club logos and images
     - Vehicle images
     - User profile pictures
     - Sponsor logos
   
   - Verify images have alt text for accessibility

5. Code splitting verification:
   - Verify TanStack Router file-based routes auto-split:
     - Each route file should produce its own chunk
     - Test with `npm run build` and check dist/assets/
   
   - Add dynamic imports for heavy components:
     - Mapbox EventMap component (lazy load on map view toggle)
     - QR code generator (lazy load on QR display)
     - Stripe payment form (lazy load on checkout page)
     - Results charts/graphs (lazy load on results page)

6. Bundle analysis:
   - Add `rollup-plugin-visualizer` to `apps/web`:
     - Install: `pnpm add -D rollup-plugin-visualizer`
     - Add to `apps/web/vite.config.ts`:
       ```typescript
       import { visualizer } from "rollup-plugin-visualizer";
       
       plugins: [
         // ... other plugins
         visualizer({ open: true })
       ]
       ```
     - Run build and analyze: `pnpm build`
     - Identify large dependencies:
       - Mapbox GL JS should be lazy-loaded
       - QR code library should be lazy-loaded
       - Stripe.js should be lazy-loaded
     - Document findings and optimizations

7. Create robots.txt and sitemap:
   - Create `apps/web/public/robots.txt`:
     ```
     User-agent: *
     Allow: /
     Disallow: /messages
     Disallow: /profile/editor
     Disallow: /admin
     Sitemap: https://csps.com/sitemap.xml
     ```
   
   - Create `apps/web/scripts/generate-sitemap.ts`:
     - Queries API for all public events and clubs
     - Generates static `apps/web/public/sitemap.xml`
     - Includes:
       - Homepage (daily priority)
       - All public event pages (weekly, changefreq=weekly)
       - All public club pages (monthly, changefreq=monthly)
     - Run as part of build process
     - Include in vite build hook or as separate npm script

8. Vite build optimization:
   - Ensure `apps/web/vite.config.ts` has:
     - Proper minification
     - CSS code splitting
     - Image asset handling
     - Sourcemaps for production debugging (optional)

## Files to Create
- `apps/web/src/lib/seo.ts`
- `apps/web/src/components/ui/CloudinaryImage.tsx`
- `apps/web/public/robots.txt`
- `apps/web/scripts/generate-sitemap.ts`

## Files to Modify
- `apps/web/src/routes/__root.tsx` (add root meta tags and schema)
- `apps/web/src/routes/index.tsx` (add home page meta)
- `apps/web/src/routes/events/index.tsx` (add event list meta)
- `apps/web/src/routes/events/new.tsx` (add create event meta)
- `apps/web/src/routes/events/$eventId.tsx` (add dynamic event meta + schema)
- `apps/web/src/routes/events/$eventId/results.tsx` (add results meta)
- `apps/web/src/routes/clubs/index.tsx` (add club list meta)
- `apps/web/src/routes/clubs/$clubId.tsx` (add dynamic club meta)
- `apps/web/src/routes/profile/$userId.tsx` (add dynamic profile meta)
- `apps/web/vite.config.ts` (add visualizer plugin, build optimizations)
- Various component files (replace `<img>` with `<CloudinaryImage>`)
- `apps/web/package.json` (add rollup-plugin-visualizer, ts-node for sitemap script)
- Root `package.json` (add sitemap generation to build script if needed)

## Acceptance Criteria
- All public pages have appropriate `<title>` tags and meta descriptions
- Open Graph tags present on all public pages with correct image URLs
- Social sharing preview works (test with Facebook/Twitter share debugger)
- All images use `<CloudinaryImage>` with responsive srcset and lazy loading
- No layout shift from images (width/height always set)
- Route-based code splitting working (verify chunks in dist/)
- Heavy libraries (Mapbox, QR, Stripe) lazy-loaded on demand
- Bundle analysis identifies and documents largest modules
- Lighthouse SEO audit score > 90
- robots.txt accessible at /robots.txt
- Sitemap generation script produces valid XML
- Sitemap includes all public events and clubs with last-modified dates
- TypeScript compiles cleanly
- No console warnings about missing alt text or image dimensions
- Mobile and desktop versions render correctly
