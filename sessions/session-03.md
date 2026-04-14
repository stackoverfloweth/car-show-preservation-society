# Session 03 — Backend Skeleton

## Dependencies
Session 01

## Branch
`session/03-backend-skeleton`

## Goal
Build out the Hono API skeleton with middleware stack, Clerk authentication integration, typed response helpers, error handling, and Railway deployment config. By the end, the API should have a health check endpoint and a protected test endpoint that validates Clerk JWTs. The API should be ready to be deployed to Railway with all necessary environment variables and Docker configuration.

## Tasks

1. **Install Backend Dependencies**
   - Update `apps/api/package.json` dependencies:
     - `hono` — core framework
     - `@hono/clerk-auth` — Clerk integration
     - `@clerk/backend` — Clerk SDK
     - `@hono/zod-validator` — Zod validation middleware
     - `zod` — schema validation
     - `dotenv` — environment loading
   - Update dev dependencies:
     - `tsx` — TypeScript runner
     - `@types/node` — Node types

2. **Create Environment Configuration**
   - Create `apps/api/src/env.ts` with:
     - Zod schema for validating environment variables:
       - `CLERK_SECRET_KEY` (required)
       - `CLERK_PUBLISHABLE_KEY` (required, for reference)
       - `PORT` (optional, defaults to 3000)
       - `NODE_ENV` (optional, defaults to development)
       - `API_URL` (optional, for CORS)
     - Parse and validate environment at module load time
     - Export parsed config object with proper typing
     - Throw clear error messages if required vars are missing
   - Update `apps/api/.env.example` with:
     ```
     CLERK_SECRET_KEY=sk_test_xxx
     CLERK_PUBLISHABLE_KEY=pk_test_xxx
     PORT=3000
     NODE_ENV=development
     ```

3. **Build Authentication Middleware**
   - Create `apps/api/src/middleware/auth.ts` with:
     - `requireAuth` middleware:
       - Verifies Clerk JWT token from Authorization header (Bearer scheme)
       - Extracts userId from token claims
       - Throws HTTPException(401) if invalid or missing
       - Injects userId into context
       - Returns next handler with updated context
     - `optionalAuth` middleware:
       - Attempts to verify token but doesn't throw on failure
       - Sets userId in context if valid, undefined if not
       - Always allows request to proceed
     - Use `@hono/clerk-auth` under the hood
     - Export both middleware functions and a typed context interface with userId

4. **Build Error Handling Middleware**
   - Create `apps/api/src/middleware/error-handler.ts` with:
     - Global error handler middleware
     - Catches `HTTPException` and returns formatted JSON error:
       ```typescript
       {
         error: string;
         statusCode: number;
         details?: any;
       }
       ```
     - Catches unknown errors (500 Internal Server Error):
       ```typescript
       {
         error: 'Internal Server Error';
         statusCode: 500;
       }
       ```
     - Logs errors to console (structure compatible with future logging service)
     - Set appropriate HTTP status codes

5. **Build Request ID Middleware**
   - Create `apps/api/src/middleware/request-id.ts` with:
     - Generates or extracts request ID from header
     - Uses `crypto.randomUUID()` if not provided
     - Injects into context and response headers (X-Request-Id)
     - All subsequent logs and traces can reference this ID

6. **Build Response Helpers**
   - Create `apps/api/src/lib/response.ts` with:
     - `success<T>(data: T, statusCode?: number)` — returns `{ data, statusCode }`
     - `error(message: string, statusCode: number)` — returns `{ error, statusCode }`
     - `paginated<T>(items: T[], total: number, page: number, pageSize: number)` — returns `{ items, total, page, pageSize }`
     - All helpers ensure consistent JSON response shape
     - Export TypeScript types for response shapes

7. **Set Up Logging Middleware**
   - Use Hono's built-in logger middleware (`hono/logger`)
   - Configure to log request method, path, status, and duration
   - Format for readability in development and JSON parsing in production

8. **Set Up CORS Middleware**
   - Use Hono's `cors` middleware
   - Configure to allow:
     - Origins from `API_URL` environment variable (or * in dev)
     - Methods: GET, POST, PUT, DELETE, OPTIONS
     - Headers: Content-Type, Authorization
     - Credentials: true

9. **Create Route Mounting Pattern**
   - Update `apps/api/src/index.ts` with:
     - Import and instantiate Hono app
     - Apply middleware in correct order:
       1. Logger
       2. Request ID
       3. CORS
       4. Error handler (wrap all routes)
     - Create route group mounting system:
       - Health check routes
       - Auth routes (login, me, user)
       - (Other route files to be mounted later)
     - Export app for Railway/deployment
     - Add development server startup with console message showing port

10. **Create Health Check Endpoint**
    - Create `apps/api/src/routes/health.ts` with:
      - `GET /api/health` endpoint
      - Returns: `{ status: 'ok', timestamp: ISO string }`
      - No authentication required
      - Used for deployment health checks and liveness probes
    - Mount in main index.ts

11. **Create Protected User Endpoint**
    - Create `apps/api/src/routes/me.ts` with:
      - `GET /api/me` endpoint
      - Apply `requireAuth` middleware
      - Returns authenticated user's Clerk ID:
        ```typescript
        {
          userId: string;
          createdAt: ISO string;
        }
        ```
      - Throws 401 if not authenticated
      - For testing JWT validation end-to-end
    - Mount in main index.ts

12. **Create Dockerfile for Deployment**
    - Create `apps/api/Dockerfile` with:
      - Multi-stage build:
        - Builder stage: Node 20-alpine, install dependencies, build
        - Runtime stage: Node 20-alpine, copy built app, run
      - Expose port 3000
      - Health check: curl /api/health every 30 seconds
      - CMD: `node dist/index.js`
      - Non-root user for security
      - Minimal attack surface (alpine base, no dev deps)

13. **Configure Railway Deployment**
    - Create `apps/api/railway.json` with:
      - Build command: `pnpm install && pnpm build`
      - Start command: `pnpm start`
      - Port: 3000
      - Environment variable placeholders for Clerk keys
    - Or create `apps/api/nixpacks.toml` if using Nix

14. **Update Package.json Scripts**
    - Update `apps/api/package.json` scripts:
      - `dev` — `tsx watch src/index.ts`
      - `build` — `tsc`
      - `start` — `node dist/index.js`
      - `typecheck` — `tsc --noEmit`

15. **Create Request/Response Types**
    - Create `apps/api/src/types/index.ts` with:
      - `HealthResponse` type
      - `MeResponse` type
      - Generic `ApiResponse<T>` wrapper
      - `ApiError` type matching error-handler output
    - Use in route handlers for type safety

## Files to Create/Modify

**Create:**
- `apps/api/src/env.ts`
- `apps/api/src/middleware/auth.ts`
- `apps/api/src/middleware/error-handler.ts`
- `apps/api/src/middleware/request-id.ts`
- `apps/api/src/lib/response.ts`
- `apps/api/src/routes/health.ts`
- `apps/api/src/routes/me.ts`
- `apps/api/src/types/index.ts`
- `apps/api/Dockerfile`
- `apps/api/railway.json`

**Modify:**
- `apps/api/src/index.ts` (rewrite with middleware and routes)
- `apps/api/package.json` (add dependencies and scripts)
- `apps/api/.env.example` (update with required Clerk vars)

## Acceptance Criteria

- [x] `pnpm --filter api dev` starts server and logs listening on port 3000
- [x] `GET /api/health` returns 200 with `{ status: 'ok', timestamp: '...' }`
- [x] `GET /api/me` without Authorization header returns 401 with proper error format
- [x] `GET /api/me` with valid Clerk JWT returns 200 with `{ userId: string }`
- [x] `GET /api/me` with invalid/malformed JWT returns 401
- [x] All error responses follow consistent format: `{ error: string, statusCode: number }`
- [x] Response headers include `X-Request-Id` on all responses
- [x] CORS headers are present in responses
- [x] Dockerfile builds successfully: `docker build apps/api -t csps-api`
- [x] TypeScript compiles cleanly with `pnpm --filter api typecheck`
- [x] All middleware are applied in correct order
- [x] Clerk environment variables are properly validated at startup
- [x] Error handling catches and formats exceptions without crashing
- [x] Logger middleware outputs request details on each request
