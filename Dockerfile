# ==========================================
# Multi-Stage Dockerfile for KARTIKA
# Kepatuhan Audit Risiko & Keamanan Aplikasi
# ==========================================

# ------------------------------------------
# Stage 1: Build Environment
# ------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies for build
RUN npm install

# Copy application source code and configurations
COPY . .

# Compile TypeScript and bundle frontend with Vite
RUN npm run build

# ------------------------------------------
# Stage 2: Minimal Production Runtime
# ------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

# Production environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist ./dist

# Copy production Express server runner
COPY server.js ./

# Set security headers and non-root user execution
USER node

# Expose KARTIKA service port
EXPOSE 3000

# Healthcheck for container orchestrators
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start KARTIKA production server
CMD ["node", "server.js"]
