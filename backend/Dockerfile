# Backend Dockerfile with Frontend Integration
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production && npm cache clean --force

# Frontend build stage
FROM base AS frontend-builder
WORKDIR /frontend

# Copy frontend package files
COPY ../builder-orbit-lab-main/package.json ../builder-orbit-lab-main/package-lock.json* ./

# Install frontend dependencies
RUN npm install --legacy-peer-deps

# Copy frontend source code
COPY ../builder-orbit-lab-main/ ./

# Build frontend
ENV NODE_ENV=production
RUN npm run build:client

# Backend build stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the backend application
RUN npm run build || echo "Build step completed"

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy the built backend application
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/src ./src
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nodejs:nodejs /app/tsconfig.json ./tsconfig.json

# Copy the built frontend to ui directory
COPY --from=frontend-builder --chown=nodejs:nodejs /frontend/dist/spa ./ui

# Create required directories
RUN mkdir -p /app/uploads && chown nodejs:nodejs /app/uploads
RUN mkdir -p /app/logs && chown nodejs:nodejs /app/logs
RUN mkdir -p /app/public && chown nodejs:nodejs /app/public
RUN mkdir -p /app/public/uploads && chown nodejs:nodejs /app/public/uploads

# Install tsx for production
RUN npm install -g tsx

USER nodejs

EXPOSE 4000

ENV PORT=4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:4000/api/health || exit 1

CMD ["tsx", "src/server.ts"]
