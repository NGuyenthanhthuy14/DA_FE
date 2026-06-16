# syntax=docker/dockerfile:1

FROM node:20-alpine AS base

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

FROM base AS deps

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm npm ci

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN node -e "require('@next/env').loadEnvConfig(process.cwd()); console.log('NEXT_PUBLIC_API_URL at build:', process.env.NEXT_PUBLIC_API_URL || '<empty>')" \
  && printf "window.__RUNTIME_CONFIG__ = window.__RUNTIME_CONFIG__ || {};\n" > public/__env.js \
  && npm run build

FROM base AS runner

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
