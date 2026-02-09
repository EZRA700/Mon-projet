# Multi-stage build pour optimiser la taille de l'image

# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Installer OpenSSL pour Prisma
RUN apk add --no-cache openssl

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm install --production && \
    npm install -g prisma && \
    npx prisma generate

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app

# Installer OpenSSL pour Prisma
RUN apk add --no-cache openssl

# Créer un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

# Copier les node_modules depuis l'étape deps
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./
COPY --from=deps /app/prisma ./prisma

# Copier le code source
COPY . .

# Changer les permissions après copie
RUN chown -R expressjs:nodejs /app

# Changer vers l'utilisateur non-root
USER expressjs

# Exposer le port
EXPOSE 5000

# Script de démarrage pour exécuter les migrations puis démarrer le serveur
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
