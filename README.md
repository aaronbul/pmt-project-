# PMT - Project Management Tool

Une plateforme de gestion de projet collaboratif destinée aux équipes de développement logiciel.

## 🚀 Fonctionnalités

- **Gestion des utilisateurs** : Inscription, connexion, gestion des profils
- **Gestion des projets** : Création, modification, suppression de projets
- **Gestion des tâches** : Création, assignation, suivi des tâches
- **Gestion des membres** : Invitation, attribution de rôles (admin, membre, observateur)
- **Notifications** : Système de notifications en temps réel
- **Historique** : Suivi des modifications et actions

## 🏗️ Architecture

### Frontend
- **Framework** : Angular 20
- **UI** : Angular Material
- **Tests** : Jasmine + Karma
- **Build** : Angular CLI

### Backend
- **Framework** : Spring Boot 3.5
- **Base de données** : MySQL 8.0
- **ORM** : Spring Data JPA + Hibernate
- **Tests** : JUnit 5 + Mockito + Jacoco
- **Build** : Maven

### Infrastructure
- **Conteneurisation** : Docker + Docker Compose
- **CI/CD** : GitHub Actions
- **Registry** : Docker Hub

## 📋 Prérequis

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Git**

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

# Vérifier le statut
docker-compose ps
```

**Note importante** : La base de données MySQL sera automatiquement initialisée avec les données de test lors du premier démarrage. Aucune action manuelle n'est requise.

### 3. Accéder à l'application
- **Frontend** : http://localhost
- **Backend API** : http://localhost:8080
- **phpMyAdmin** : http://localhost:8081
  - Utilisateur : `pmt_user`
  - Mot de passe : `pmt_password`

### 4. Données de test disponibles

L'application est livrée avec des données de test pré-configurées :

**Utilisateurs de test** :
- `john.doe` / `password123`
- `mariana.silva` / `password123`
- `nicolas.martin` / `password123`
- `alice.dupont` / `password123`
- `bob.wilson` / `password123`

**Projets de test** :
- PMT - Project Management Tool
- E-commerce Platform
- Mobile App Redesign

**Tâches de test** : Plusieurs tâches sont créées avec différents statuts et priorités.

### 5. Vérification de l'initialisation

Pour vérifier que la base de données a été correctement initialisée :

```bash
# Vérifier les logs MySQL
docker-compose logs mysql

# Se connecter à la base de données
docker exec -it pmt-mysql mysql -u pmt_user -p pmt_db

# Vérifier les tables
SHOW TABLES;

# Vérifier les utilisateurs
SELECT username, email FROM users;

# Vérifier les projets
SELECT name, description FROM projects;
```

**Mot de passe** : `pmt_password`

### 6. Test automatisé de l'initialisation

Pour tester automatiquement que l'initialisation fonctionne correctement :

```bash
# Rendre le script exécutable (Linux/Mac)
chmod +x test-init.sh

# Exécuter le test
./test-init.sh
```

Ce script vérifie automatiquement que :
- La base de données est créée
- Toutes les tables sont présentes
- Les données de test sont insérées
- Les utilisateurs, projets et tâches sont disponibles

## 🧪 Tests

### Tests Backend
```bash
cd pmt-backend
./mvnw test
./mvnw test jacoco:report
```

### Tests Frontend
```bash
cd pmt-frontend
npm test
npm run test:coverage
```

### Tests avec Docker
```bash
# Tests backend dans un conteneur
docker run --rm -v $(pwd)/pmt-backend:/app -w /app maven:3.9.6-eclipse-temurin-21 mvn test

# Tests frontend dans un conteneur
docker run --rm -v $(pwd)/pmt-frontend:/app -w /app node:20 npm test
```

## 🔧 Développement

### Mode développement local

```bash
# Lancer seulement la base de données
docker-compose up mysql phpmyadmin -d

# Backend (dans un terminal)
cd pmt-backend
./mvnw spring-boot:run

# Frontend (dans un autre terminal)
cd pmt-frontend
npm start
```

### Structure du projet
```
pmt-project/
├── pmt-backend/          # Application Spring Boot
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── pmt-frontend/         # Application Angular
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── database/             # Scripts SQL
├── docker-compose.yml    # Orchestration Docker
└── docs/                 # Documentation
```

## 📊 Couverture de Code

### Rapports de couverture inclus

Le projet inclut des rapports de couverture de code complets :

**Backend (JaCoCo)** :
- **Seuil minimum** : 60%
- **Couverture actuelle** : 61% (✅ **Objectif atteint !**)
- **Rapport principal** : `pmt-backend/target/site/jacoco/index.html`
- **Données XML** : `pmt-backend/target/site/jacoco/jacoco.xml`

**Frontend (Karma/Istanbul)** :
- **Seuil minimum** : 80%
- **Couverture actuelle** : 85% (✅ **Conforme**)
- **Rapport principal** : `pmt-frontend/coverage/index.html`
- **Données LCOV** : `pmt-frontend/coverage/lcov.info`

### Consultation des rapports

```bash
# Ouvrir le rapport Backend
start pmt-backend/target/site/jacoco/index.html

# Ouvrir le rapport Frontend
start pmt-frontend/coverage/index.html
```

### Régénération des rapports

```bash
# Script automatique (recommandé)
./generate-reports.sh

# Ou manuellement
cd pmt-backend && mvn clean test jacoco:report
cd pmt-frontend && npm run test:coverage
```

**📝 Documentation complète** : Voir [REPORTS.md](REPORTS.md) pour plus de détails.

### Rapports livrés avec le projet

Les rapports de couverture suivants sont **inclus dans la livraison** :

```
pmt-project/
├── pmt-backend/target/site/jacoco/
│   ├── index.html          # Rapport principal Backend
│   ├── jacoco.xml          # Données XML pour CI/CD
│   └── jacoco.csv          # Données CSV
└── pmt-frontend/coverage/
    ├── index.html          # Rapport principal Frontend
    └── lcov.info           # Données LCOV pour CI/CD
```

**Aucune action manuelle n'est requise** - les rapports sont prêts à être consultés !

## 🔄 CI/CD

Le projet utilise GitHub Actions pour l'automatisation :

### Pipeline
1. **Tests Backend** : Exécution des tests unitaires et d'intégration
2. **Tests Frontend** : Exécution des tests Angular
3. **Build Docker** : Construction des images Docker
4. **Push Registry** : Publication sur Docker Hub
5. **Déploiement** : Déploiement automatique (optionnel)

### Configuration
- **Workflow** : `.github/workflows/ci-cd.yml`
- **Secrets** : Voir `.github/SECRETS.md`

## 🐳 Docker

### Images disponibles
- **pmt-backend** : Application Spring Boot
- **pmt-frontend** : Application Angular + nginx
- **mysql** : Base de données MySQL 8.0
- **phpmyadmin** : Interface de gestion MySQL

### Commandes utiles
```bash
# Construire les images
docker-compose build

# Démarrer les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down

# Nettoyer
docker-compose down -v
docker system prune -a
```

## 📚 Documentation

- **[Guide de déploiement](DEPLOYMENT.md)** : Instructions détaillées
- **[Guide des tests](TESTS.md)** : Configuration et exécution des tests
- **[Configuration CI/CD](.github/SECRETS.md)** : Setup GitHub Actions

## 🔒 Sécurité

### Production
- Changer les mots de passe par défaut
- Configurer HTTPS
- Restreindre l'accès réseau
- Activer l'authentification

### Variables d'environnement
```bash
# Créer un fichier .env
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_PASSWORD=your_secure_password
SPRING_PROFILES_ACTIVE=production
```

## 🚨 Dépannage

### Problèmes courants

1. **Ports déjà utilisés**
   ```bash
   # Vérifier les ports
   netstat -tulpn | grep :80
   netstat -tulpn | grep :8080
   ```

2. **Base de données ne démarre pas**
   ```bash
   # Vérifier les logs
   docker-compose logs mysql
   ```

3. **Backend ne peut pas se connecter**
   ```bash
   # Vérifier la connectivité
   docker exec pmt-backend ping mysql
   ```

### Logs et debugging
```bash
# Logs de tous les services
docker-compose logs

# Logs d'un service spécifique
docker-compose logs backend

# Accéder à un conteneur
docker exec -it pmt-backend bash
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/your-repo/issues)
- **Documentation** : Voir les fichiers dans `docs/`
- **Email** : support@codesolutions.com

---

**Développé avec ❤️ par l'équipe Code Solutions** 