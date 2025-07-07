# Guide de Déploiement PMT

Ce guide décrit comment déployer l'application PMT (Project Management Tool) en utilisant Docker et Docker Compose.

## 📋 Prérequis

- **Docker** (version 20.10 ou supérieure)
- **Docker Compose** (version 2.0 ou supérieure)
- **Git** (pour cloner le repository)

## 🚀 Déploiement Rapide

### 1. Cloner le repository

```bash
git clone <repository-url>
cd pmt-project
```

### 2. Lancer l'application

```bash
# Construire et démarrer tous les services
docker-compose up -d

# Vérifier le statut des services
docker-compose ps
```

### 3. Accéder à l'application

- **Frontend** : http://localhost
- **Backend API** : http://localhost:8080
- **phpMyAdmin** : http://localhost:8081
  - Utilisateur : `pmt_user`
  - Mot de passe : `pmt_password`

## 🔧 Configuration

### Variables d'environnement

Les variables d'environnement sont configurées dans `docker-compose.yml` :

```yaml
# Base de données
MYSQL_ROOT_PASSWORD: rootpassword
MYSQL_DATABASE: pmt_db
MYSQL_USER: pmt_user
MYSQL_PASSWORD: pmt_password

# Backend
SPRING_PROFILES_ACTIVE: docker
SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/pmt_db
```

### Ports

- **80** : Frontend Angular
- **8080** : Backend Spring Boot
- **3306** : Base de données MySQL
- **8081** : phpMyAdmin

## 🐳 Services Docker

### Frontend (Angular)
- **Image** : Basée sur Node.js 20 + nginx
- **Port** : 80
- **Fonctionnalités** :
  - Build optimisé pour la production
  - Compression gzip
  - Headers de sécurité
  - Cache des assets statiques

### Backend (Spring Boot)
- **Image** : Basée sur OpenJDK 21
- **Port** : 8080
- **Fonctionnalités** :
  - Multi-stage build avec Maven
  - Utilisateur non-root
  - Configuration JVM optimisée

### Base de données (MySQL)
- **Image** : MySQL 8.0
- **Port** : 3306
- **Fonctionnalités** :
  - Initialisation automatique
  - Données de test incluses
  - Volume persistant

### phpMyAdmin (Optionnel)
- **Image** : phpMyAdmin officielle
- **Port** : 8081
- **Fonctionnalités** :
  - Interface web pour MySQL
  - Connexion pré-configurée

## 📊 Monitoring et Logs

### Vérifier les logs

```bash
# Logs de tous les services
docker-compose logs

# Logs d'un service spécifique
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql

# Logs en temps réel
docker-compose logs -f
```

### Health Checks

Les services incluent des health checks automatiques :

```bash
# Vérifier l'état des services
docker-compose ps

# Vérifier les health checks
docker inspect pmt-backend | grep -A 10 "Health"
```

## 🔄 Gestion des Services

### Redémarrer un service

```bash
# Redémarrer le backend
docker-compose restart backend

# Redémarrer tous les services
docker-compose restart
```

### Mettre à jour l'application

```bash
# Arrêter les services
docker-compose down

# Reconstruire les images
docker-compose build --no-cache

# Redémarrer les services
docker-compose up -d
```

### Sauvegarder la base de données

```bash
# Créer une sauvegarde
docker exec pmt-mysql mysqldump -u pmt_user -ppmt_password pmt_db > backup.sql

# Restaurer une sauvegarde
docker exec -i pmt-mysql mysql -u pmt_user -ppmt_password pmt_db < backup.sql
```

## 🛠️ Développement

### Mode développement

```bash
# Lancer seulement la base de données
docker-compose up mysql phpmyadmin -d

# Développer en local avec les services externes
# Frontend : npm start (port 4200)
# Backend : mvn spring-boot:run (port 8080)
```

### Debugging

```bash
# Accéder au conteneur backend
docker exec -it pmt-backend bash

# Accéder au conteneur frontend
docker exec -it pmt-frontend sh

# Accéder à MySQL
docker exec -it pmt-mysql mysql -u pmt_user -ppmt_password pmt_db
```

## 🔒 Sécurité

### Production

Pour un déploiement en production :

1. **Changer les mots de passe par défaut**
2. **Configurer HTTPS** (certificats SSL)
3. **Restreindre l'accès réseau**
4. **Configurer un reverse proxy** (nginx/traefik)
5. **Activer l'authentification** pour phpMyAdmin

### Variables d'environnement sécurisées

```bash
# Créer un fichier .env
cat > .env << EOF
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_PASSWORD=your_secure_password
SPRING_PROFILES_ACTIVE=production
EOF

# Utiliser le fichier .env
docker-compose --env-file .env up -d
```

## 🚨 Dépannage

### Problèmes courants

1. **Ports déjà utilisés**
   ```bash
   # Vérifier les ports utilisés
   netstat -tulpn | grep :80
   netstat -tulpn | grep :8080
   
   # Modifier les ports dans docker-compose.yml
   ```

2. **Base de données ne démarre pas**
   ```bash
   # Vérifier les logs MySQL
   docker-compose logs mysql
   
   # Supprimer le volume et redémarrer
   docker-compose down -v
   docker-compose up -d
   ```

3. **Backend ne peut pas se connecter à la base**
   ```bash
   # Vérifier que MySQL est prêt
   docker-compose logs mysql | grep "ready for connections"
   
   # Vérifier la connectivité
   docker exec pmt-backend ping mysql
   ```

4. **Frontend ne charge pas**
   ```bash
   # Vérifier les logs nginx
   docker-compose logs frontend
   
   # Vérifier la configuration nginx
   docker exec pmt-frontend nginx -t
   ```

### Commandes utiles

```bash
# Nettoyer les conteneurs arrêtés
docker container prune

# Nettoyer les images non utilisées
docker image prune

# Nettoyer les volumes non utilisés
docker volume prune

# Nettoyer tout
docker system prune -a
```

## 📈 Performance

### Optimisations recommandées

1. **Backend** :
   - Ajuster `JAVA_OPTS` selon la RAM disponible
   - Configurer le pool de connexions MySQL
   - Activer la compression gzip

2. **Frontend** :
   - Optimiser les images et assets
   - Configurer le cache CDN
   - Activer la compression Brotli

3. **Base de données** :
   - Ajuster les paramètres MySQL
   - Configurer les index appropriés
   - Optimiser les requêtes

## 🔄 CI/CD

### Intégration avec GitHub Actions

Voir le fichier `.github/workflows/deploy.yml` pour l'automatisation du déploiement.

### Déploiement automatisé

```bash
# Script de déploiement
#!/bin/bash
set -e

echo "🚀 Déploiement PMT..."

# Pull des dernières modifications
git pull origin main

# Build et déploiement
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Vérification
sleep 30
docker-compose ps

echo "✅ Déploiement terminé !"
```

## 📞 Support

Pour toute question ou problème :

1. Vérifier les logs : `docker-compose logs`
2. Consulter la documentation : `README.md`
3. Ouvrir une issue sur le repository
4. Contacter l'équipe de développement 