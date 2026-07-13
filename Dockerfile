# Etape 1 : Installation des dépendances
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copie des fichiers de package
COPY package.json package-lock.json* ./
RUN npm ci

# Etape 2 : Build de l'application Next.js
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Déclaration des variables d'environnement requises au build
ARG NEXT_PUBLIC_VELOV_API_URL
ARG NEXT_PUBLIC_VELOV_API_BASE_URL

ENV NEXT_PUBLIC_VELOV_API_URL=${NEXT_PUBLIC_VELOV_API_URL}
ENV NEXT_PUBLIC_VELOV_API_BASE_URL=${NEXT_PUBLIC_VELOV_API_BASE_URL}

# Désactiver la télémétrie Next.js pendant le build
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Etape 3 : Runner (environnement de production minimal)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Récupération automatique de la compilation standalone optimisée
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]



# docker build \
#     --build-arg NEXT_PUBLIC_VELOV_API_URL="https://votre-url-api-realtime/stations" \
#     --build-arg NEXT_PUBLIC_VELOV_API_BASE_URL="http://localhost:8000" \
#     -t velohot-frontend:latest .

# docker run -d -p 3000:3000 --name velohot-frontend-app velohot-frontend:latest