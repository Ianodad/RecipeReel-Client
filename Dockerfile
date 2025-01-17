# Base Stage: Common dependencies
FROM node:18-alpine AS base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
# EXPOSE 9000

# Builder Stage: Builds the application
FROM base AS builder
WORKDIR /app
COPY . .

# Define build arguments for environment variables
ARG NEXT_BACKEND_API_URL

# Set environment variables for the build using the correct format
ENV NEXT_BACKEND_API_URL=${NEXT_BACKEND_API_URL}
RUN npm install
RUN npm run build

# Production Stage: Prepare for production
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
RUN npm ci

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# ENV PORT=9000
CMD ["npm", "start"]

# Development Stage: For local development
FROM base AS dev
ENV NODE_ENV=development
# ENV PORT=9000
RUN npm install 
COPY . .
CMD ["npm", "run", "dev"]
