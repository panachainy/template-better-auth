# Multi-stage Dockerfile for Bun application

# Stage 1: Dependencies
FROM oven/bun:1.3.3-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies (production only for final image)
RUN bun install --frozen-lockfile --production --ignore-scripts

# Stage 2: Build
FROM oven/bun:1.3.3-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package.json bun.lock tsconfig.json biome.json ./
COPY index.ts ./
COPY lib ./lib

# Build the application
RUN bun run build

# Stage 3: Production
FROM oven/bun:1.3.3-alpine AS runner
WORKDIR /app

# Set to production
ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 bunuser

# Copy the built application
COPY --from=builder /app/dist/index.js ./

# Switch to non-root user
USER bunuser

# Expose port (adjust if your app uses a different port)
EXPOSE 3000

# Start the application
CMD ["bun", "index.js"]
