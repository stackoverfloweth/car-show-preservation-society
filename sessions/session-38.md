# Session 38 — Deployment & DevOps

## Dependencies
All sessions (01–37)

## Branch
`session/38-deployment`

## Goal
Set up production deployment infrastructure: Railway for API and PostgreSQL database, Vercel for frontend, GitHub Actions for CI/CD, and automated database migration strategy. Ensure the system can be reliably deployed to production with zero downtime and full observability.

## Tasks

1. Railway API deployment setup:
   - Review and finalize `apps/api/Dockerfile`:
     - Multi-stage build process:
       - Stage 1: Build container with Node, install deps, build TypeScript
       - Stage 2: Slim runtime container, copy built assets only
       - Use node:20-alpine as base for minimal size
     - Include health check: `HEALTHCHECK CMD curl -f http://localhost:$PORT/api/health || exit 1`
     - Expose PORT (default 3000)
     - Entry point: `node dist/index.js`
   
   - Create `apps/api/railway.toml`:
     ```toml
     [build]
     builder = "dockerfile"
     
     [deploy]
     startCommand = "node dist/index.js"
     healthcheckPath = "/api/health"
     restartPolicyMaxRetries = 5
     
     [[services]]
     name = "postgres"
     image = "postgres:15"
     ```
   
   - Environment variables in Railway dashboard:
     - DATABASE_URL (auto-provided by Railway)
     - CLERK_SECRET_KEY
     - CLERK_WEBHOOK_SECRET
     - STRIPE_SECRET_KEY
     - STRIPE_WEBHOOK_SECRET
     - CLOUDINARY_URL
     - CLOUDINARY_PRESET
     - MAPBOX_TOKEN
     - PORT (default 3000)
     - NODE_ENV=production
   
   - Database configuration:
     - Enable automatic daily backups
     - Connection pooling (PgBouncer): min_pool_size=2, max_pool_size=20
     - SSL required for connections
     - Enable monitoring and logs
   
   - Deploy process:
     - Push to main branch triggers Railway deploy
     - Run migrations as part of release (via release command or startup hook)
     - Health check validates deployment before marking healthy

2. Frontend deployment (Vercel):
   - Create `apps/web/vercel.json`:
     ```json
     {
       "buildCommand": "cd ../.. && pnpm --filter web build",
       "outputDirectory": "apps/web/dist",
       "installCommand": "pnpm install",
       "env": {
         "VITE_API_URL": "@vite-api-url",
         "VITE_CLERK_PUBLISHABLE_KEY": "@vite-clerk-publishable-key",
         "VITE_MAPBOX_TOKEN": "@vite-mapbox-token",
         "VITE_CLOUDINARY_CLOUD_NAME": "@vite-cloudinary-cloud-name"
       },
       "rewrites": [
         { "source": "/(.*)", "destination": "/index.html" }
       ],
       "headers": [
         {
           "source": "/assets/(.*)",
           "headers": [
             {
               "key": "Cache-Control",
               "value": "public, max-age=31536000, immutable"
             }
           ]
         }
       ]
     }
     ```
   
   - Environment variables in Vercel dashboard:
     - VITE_API_URL (production API URL, e.g., https://api.csps.com)
     - VITE_CLERK_PUBLISHABLE_KEY (Clerk production key)
     - VITE_MAPBOX_TOKEN (Mapbox client token)
     - VITE_CLOUDINARY_CLOUD_NAME (Cloudinary cloud name)
   
   - Custom domain setup:
     - Add domain in Vercel project settings
     - Update DNS: point CNAME to Vercel's CDN
     - Enable automatic SSL (included)
   
   - Preview deployments for PRs (auto-enabled)

3. GitHub Actions CI pipeline (`.github/workflows/ci.yml`):
   - Trigger: on pull request to main
   - Steps:
     - Checkout code with full history
     - Setup pnpm and Node.js v20 LTS
     - Restore pnpm cache
     - Install dependencies
     - Run lint: `pnpm lint`
     - Run typecheck: `pnpm typecheck`
     - Start PostgreSQL service container
     - Run tests: `pnpm test`
     - Upload coverage reports (optional)
   
   - Service container configuration:
     ```yaml
     services:
       postgres:
         image: postgres:15
         env:
           POSTGRES_PASSWORD: postgres
           POSTGRES_DB: test_db
         options: >-
           --health-cmd pg_isready
           --health-interval 10s
           --health-timeout 5s
           --health-retries 5
         ports:
           - 5432:5432
     ```
   
   - Environment variables:
     - TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/test_db
   
   - Cache strategy:
     - Cache pnpm store with `actions/setup-node@v4` and `pnpm/action-setup@v2`
     - Cache Docker images for faster builds (if applicable)

4. GitHub Actions deploy pipeline (`.github/workflows/deploy.yml`):
   - Trigger: on push to main (after PR merge)
   - Approval required before deploy (optional but recommended)
   - Steps:
     - Checkout code
     - Build Docker image for API
     - Push to Railway (using Railway CLI or Docker Registry)
     - Deploy to Vercel (using Vercel CLI)
     - Run database migrations (via Railway release command or separate step)
     - Health check verification
     - Slack notification on success/failure
   
   - Example using Railway CLI:
     ```yaml
     - name: Deploy to Railway
       env:
         RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
       run: railway up --detach
     ```
   
   - Example using Vercel CLI:
     ```yaml
     - name: Deploy to Vercel
       env:
         VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
       run: |
         pnpm install -g vercel
         vercel deploy --prod --token=$VERCEL_TOKEN
     ```

5. Database migration strategy:
   - Migrations run automatically on deploy:
     - Create release command in Railway: `pnpm db:migrate`
     - Executes before the app service restarts
     - Rollback on error prevents the deploy
   
   - Manual migration process (if needed):
     - SSH into Railway container
     - Run `pnpm db:migrate`
   
   - Rollback procedure:
     - Generate down migration: `pnpm db:migrate:rollback`
     - Apply: `pnpm db:migrate down`
     - Redeploy
   
   - Create `MIGRATION_GUIDE.md` documenting:
     - How to write new migrations
     - How to test locally
     - How to rollback

6. Production checklist:
   - Environment variables:
     - All variables set in Railway and Vercel dashboards
     - No secrets committed to git (use GitHub Secrets)
     - Documented in `.env.example`
   
   - Third-party services:
     - Clerk: Production instance (not development)
     - Stripe: Live mode keys (not test keys)
     - Cloudinary: Production account
     - Mapbox: Production token with rate limits
     - Sendgrid or email service: API key configured
   
   - Domain and SSL:
     - Custom domain configured in Vercel
     - API domain configured and DNS set up
     - SSL certificates auto-renew (Vercel/Railway handle this)
     - CORS configured to allow both frontend and api domains
   
   - Monitoring and logging:
     - Railway logs accessible via dashboard
     - Vercel build logs accessible
     - Application error logging (consider Sentry integration)
     - Database query logs enabled for debugging
   
   - Performance and security:
     - Database connection pooling enabled
     - Redis cache for session tokens (if needed)
     - Rate limiting on API endpoints
     - CORS headers properly configured
     - CSRF protection enabled
   
   - Backups and disaster recovery:
     - PostgreSQL automated daily backups (Railway)
     - Backup retention: 30 days minimum
     - Test restore procedure

7. Create `DEPLOYMENT.md` in project root:
   - Section: "Prerequisites" (Railway account, Vercel account, custom domains)
   - Section: "Environment Variables" — table of all vars with descriptions
   - Section: "Initial Setup" — step-by-step first deploy
   - Section: "Database Migrations" — how to write, test, deploy
   - Section: "Rollback Procedures" — how to revert a migration or deployment
   - Section: "Monitoring and Health Checks" — endpoints and what to watch
   - Section: "Manual Deploy" — how to deploy without GitHub Actions
   - Section: "Troubleshooting" — common issues and fixes
   - Section: "Scaling" — when/how to upgrade database or API instances
   - Include example commands and curl requests

8. Add build and deployment scripts to root `package.json`:
   - `"build"`: `pnpm --filter '*' build`
   - `"typecheck"`: `pnpm --filter '*' typecheck`
   - `"lint"`: `pnpm --filter '*' lint`
   - `"test"`: `pnpm --filter '*' test`
   - `"deploy:migrate"`: `cd apps/api && pnpm db:migrate`

## Files to Create
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`
- `apps/api/railway.toml`
- `apps/web/vercel.json`
- `DEPLOYMENT.md`
- `MIGRATION_GUIDE.md` (optional, link from DEPLOYMENT.md)

## Files to Modify
- `apps/api/Dockerfile` (finalize with multi-stage build and health check)
- `apps/api/package.json` (add start, migrate scripts)
- Root `package.json` (add build, typecheck, lint, test, deploy scripts)
- `.env.example` (ensure all production vars documented)
- `.gitignore` (ensure .env files not committed)

## Acceptance Criteria
- GitHub Actions CI pipeline runs on every PR: lint, typecheck, test all pass
- GitHub Actions deploy pipeline runs on merge to main
- API deploys to Railway and is accessible at production URL (https://api.csps.com)
- Frontend deploys to Vercel and is accessible at production URL (https://csps.com)
- Database migrations run automatically on deploy without manual intervention
- Health check endpoint (`/api/health`) responds 200 OK in production
- Database backups automated and tested (restore once manually)
- All environment variables documented in DEPLOYMENT.md and .env.example
- Rollback procedure tested and documented
- Deployment takes <10 minutes from PR merge to live
- Zero-downtime deployment (no service interruption during deploy)
- All services monitored and logging working
- CORS configured correctly (frontend can call API)
- SSL certificates auto-renew without manual intervention
- Error monitoring integrated (e.g., Sentry, Rollbar) — optional but recommended
- DEPLOYMENT.md is comprehensive and runnable by new team members
