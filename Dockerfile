# Build stage
FROM node:22-slim AS builder

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy lockfile and package.json first to leverage Docker cache
COPY package.json pnpm-lock.yaml .npmrc ./

# Install dependencies
RUN pnpm install --frozen-lockfile

COPY . .

# Build the project
RUN pnpm run build

# Production stage
FROM node:22-slim

# Enable pnpm in production stage too
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Default environment variables
ENV NODE_ENV=production

CMD ["node", "dist/index.js"]