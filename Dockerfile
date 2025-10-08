# Multi-stage Dockerfile for Bun application

# Stage 1: Dependencies
FROM oven/bun:1.2.5-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies (production only for final image)
RUN bun install --frozen-lockfile

# Stage 2: Build
FROM oven/bun:1.2.5-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package.json bun.lock tsconfig.json biome.json ./
COPY index.ts ./
COPY lib ./lib

# Run biome check
RUN bun run check

# Stage 3: Production
FROM oven/bun:1.2.5-alpine AS runner
WORKDIR /app

# Set to production
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 bunuser

# Copy necessary files
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/index.ts ./
COPY --from=builder /app/lib ./lib

# Switch to non-root user
USER bunuser

# Expose port (adjust if your app uses a different port)
EXPOSE 3000

# Start the application
CMD ["bun", "run", "start"]
