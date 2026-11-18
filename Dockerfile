# syntax=docker/dockerfile:1
# NOTA: no verificado en el entorno de desarrollo original (sin demonio Docker).
# El build prerenderiza contenido y NECESITA acceso a PostgreSQL ya migrado:
#   docker compose up -d db && npm run db:migrate && npm run db:seed   (contra localhost:5432)
#   docker compose build app        (usa network: host, ver docker-compose.yml)

FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG DATABASE_URL
ARG APP_URL=http://localhost:3000
ENV DATABASE_URL=$DATABASE_URL APP_URL=$APP_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
RUN useradd --system --uid 1001 alexandria
COPY --from=build --chown=alexandria /app/package.json ./
COPY --from=build --chown=alexandria /app/node_modules ./node_modules
COPY --from=build --chown=alexandria /app/.next ./.next
COPY --from=build --chown=alexandria /app/public ./public
COPY --from=build --chown=alexandria /app/next.config.ts ./
USER alexandria
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s CMD node -e "fetch('http://localhost:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["npx", "next", "start", "-p", "3000"]
