# Stage 1: Build the application
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /app

# Install build dependencies for native modules (like bcrypt)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Remove development dependencies
RUN npm prune --production

# Stage 2: Runtime environment
FROM node:20-alpine

WORKDIR /app

# Copy built assets and necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
# Prisma 7 loads datasource.url from prisma.config.ts, so it must exist at runtime
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Create a simple entrypoint script to run migrations before starting.
# NOTE: BusyBox `echo` in Alpine does not interpret `\n`, so we use `printf`
# to make sure real newlines (and a proper shebang line) end up in the file.
RUN printf '#!/bin/sh\nset -e\nnpx prisma migrate deploy\nexec npm run start:prod\n' > /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

# Expose the application port
EXPOSE 3333

# Start the application
CMD ["/app/entrypoint.sh"]
