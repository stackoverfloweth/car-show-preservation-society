# ---- Builder ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace manifests
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/

# Install all dependencies (needed for build)
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/api ./apps/api

# Build
RUN pnpm --filter @csps/api build

# ---- Runtime ----
FROM node:20-alpine AS runtime

WORKDIR /app

# Non-root user
RUN addgroup -S csps && adduser -S csps -G csps

RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace manifests for production install
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/ ./packages/

RUN pnpm install --frozen-lockfile --prod

# Copy compiled output
COPY --from=builder /app/apps/api/dist ./apps/api/dist

USER csps

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "apps/api/dist/server.js"]
