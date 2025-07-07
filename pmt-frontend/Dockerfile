# Dockerfile pour le frontend Angular PMT

# Étape 1 : Build avec Node.js
FROM node:20-alpine AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Build de l'application
RUN npm run build

# Étape 2 : Serveur web avec nginx
FROM nginx:alpine

# Copier la configuration nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers buildés depuis l'étape précédente
COPY --from=build /app/dist/pmt-frontend/browser /usr/share/nginx/html

# Exposer le port
EXPOSE 80

# Variables d'environnement
ENV NGINX_HOST=localhost
ENV NGINX_PORT=80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"] 