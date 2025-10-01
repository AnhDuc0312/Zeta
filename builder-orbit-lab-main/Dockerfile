# Frontend Dockerfile
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
ENV NODE_ENV=production
RUN npm run build:client

# Create simple server
RUN mkdir -p dist/server
RUN echo 'import express from "express"; const app = express(); app.use(express.static("dist/spa")); app.get("*", (req, res) => { if (req.path.startsWith("/api/")) return res.status(404).json({error: "API not found"}); res.sendFile("dist/spa/index.html", {root: "."}); }); app.listen(8080, () => console.log("Server running on port 8080"));' > dist/server/node-build.mjs

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Change ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 8080

ENV PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080 || exit 1

CMD ["node", "dist/server/node-build.mjs"]