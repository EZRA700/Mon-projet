# Multi-stage build pour optimiser la taille de l'image

# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Argument pour l'URL de l'API
ARG VITE_API_URL=http://localhost:5012/api
ENV VITE_API_URL=${VITE_API_URL}

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Build de l'application avec l'URL de l'API
RUN npm run build

# Stage 2: Production avec Nginx
FROM nginx:alpine AS runner

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers buildés depuis l'étape builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]
