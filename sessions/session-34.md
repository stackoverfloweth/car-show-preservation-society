# Session 34 — Mapbox Integration

## Dependencies
Sessions 09 (events), 25 (layout shell)

## Branch
`session/34-mapbox`

## Goal
Integrate Mapbox GL JS for location search (geocoding), event map display, and location-based event filtering. This session creates reusable map components that plug into the event forms, profile editor, and event listing.

## Tasks

1. Install dependencies in `apps/web`:
   - Add `mapbox-gl` and `@mapbox/search-js-react` to package.json
   - Run `pnpm install`

2. Create `apps/web/src/lib/mapbox.ts`:
   - Initialize Mapbox client with `VITE_MAPBOX_TOKEN` environment variable
   - Implement `geocodeLocation(query: string)` function:
     - Calls Mapbox forward geocoding API
     - Returns array of results with: `placeName`, `latitude`, `longitude`, `mapboxId`
     - Includes debounce handling for real-time search
   - Implement `reverseGeocode(lat: number, lng: number)` function:
     - Calls Mapbox reverse geocoding API
     - Returns place name and formatted address
   - Implement `calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number })` function:
     - Uses Haversine formula for calculating distance in miles
     - Used for radius-based filtering

3. Create map components in `apps/web/src/components/maps/`:
   - `LocationSearch.tsx`:
     - Text input with debounced search (300ms delay)
     - Dropdown menu showing geocoding results
     - Displays up to 6 suggestions
     - On selection, calls `onChange` callback with `{ placeName, latitude, longitude, mapboxId }`
     - Shows selected location with name and clear button
     - Includes optional small inline map preview of selected location (Mapbox static map URL)
     - Keyboard navigation (arrow keys, Enter)
     - Mobile-friendly with touch support

   - `EventMap.tsx`:
     - Renders interactive Mapbox GL map
     - Accepts prop: `events: Array<{ id, name, date, location: { lat, lng }, clubName }>`
     - Displays pin markers for each event
     - Clickable pins show popup with: event name, date, club name, "View Event" link
     - "Events near me" feature:
       - Button to request browser geolocation
       - Shows blue circle on map for selected radius
       - Filters displayed events to those within radius
     - Marker clustering when zoomed out (use mapbox-gl-cluster or built-in clustering)
     - Responsive container sizing
     - Initial zoom/center based on events or user location

   - `LocationDisplay.tsx`:
     - Renders small, static Mapbox map for a single location
     - Accepts prop: `location: { latitude, longitude, placeName }`
     - Shows single pin centered on the map
     - Minimal interactivity (zoom only, no pan)
     - Used on event detail pages
     - Dimensions suitable for sidebar or section display

   - `NearbyEventsFilter.tsx`:
     - "Use my location" button (triggers browser `navigator.geolocation`)
     - Radius dropdown: 10 mi, 25 mi, 50 mi, 100 mi
     - Shows current filter state: "Within 25 miles of [Location Name]"
     - "Clear filter" button to reset
     - Integrates with event listing query (passes latitude, longitude, radiusInMiles to API)
     - Error handling for geolocation denial

4. Integrate components into existing pages:
   - Event creation form (`apps/web/src/components/events/EventFormGeneral.tsx` from session 29):
     - Replace text location input with `<LocationSearch />` component
     - Store selected location as structured data (lat, lng, placeName)
   
   - Profile editor (`apps/web/src/components/ProfileForm.tsx` from session 26):
     - Replace text location input with `<LocationSearch />` component
     - Update profile mutation to send structured location data
   
   - Event listing (`apps/web/src/routes/events/index.tsx`):
     - Add toggle button to switch between "List" and "Map" views
     - In map view, render `<EventMap events={events} />`
     - Add `<NearbyEventsFilter />` above listing (applies to both list and map views)
     - Update query hook to support location-based filtering parameters
   
   - Event detail page (`apps/web/src/routes/events/$eventId.tsx`):
     - Add `<LocationDisplay location={event.location} />` in location section
     - Display location name and address below the map
   
   - Search subscription form (if exists from session 22):
     - Use `<LocationSearch />` for subscription location input

5. Add styles and configuration:
   - Import Mapbox GL CSS in `apps/web/src/styles/globals.css`:
     ```css
     @import 'mapbox-gl/dist/mapbox-gl.css';
     ```
   - Ensure Tailwind utility classes work with map container (width/height management)
   - Add custom styles for map popups to match CSPS design

## Files to Create
- `apps/web/src/lib/mapbox.ts`
- `apps/web/src/components/maps/LocationSearch.tsx`
- `apps/web/src/components/maps/EventMap.tsx`
- `apps/web/src/components/maps/LocationDisplay.tsx`
- `apps/web/src/components/maps/NearbyEventsFilter.tsx`

## Files to Modify
- `apps/web/src/styles/globals.css` (add mapbox-gl CSS import)
- `apps/web/src/components/events/EventFormGeneral.tsx` (swap in LocationSearch)
- `apps/web/src/routes/events/index.tsx` (add map view toggle and nearby filter)
- `apps/web/src/routes/events/$eventId.tsx` (add LocationDisplay)
- `apps/web/package.json` (add mapbox-gl and @mapbox/search-js-react)

## Acceptance Criteria
- LocationSearch autocompletes place names and returns structured location data
- EventMap displays pins for events with clickable popups
- "Events near me" feature uses browser geolocation and filters by selected radius
- LocationDisplay shows static map on event detail pages
- Location search integrated into event creation and profile editor forms
- Map components render correctly on mobile (responsive sizing)
- All components accept and properly type location props
- TypeScript compiles cleanly with strict mode
- Environment variable VITE_MAPBOX_TOKEN is documented and required
- No console errors or warnings related to Mapbox
