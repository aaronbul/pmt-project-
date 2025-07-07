# PMT Backend - Spring Boot

## Description
Backend Spring Boot pour l'application PMT (Project Management Tool). Cette application fournit une API REST complète pour la gestion de projets, utilisateurs, tâches et notifications.

## Technologies utilisées
- **Spring Boot 3.5.3**
- **Spring Data JPA**
- **Spring Security** (pour le PasswordEncoder uniquement)
- **MySQL 8.0+**
- **Java 21**
- **Maven**

## Prérequis
- Java 21 ou supérieur
- MySQL 8.0 ou supérieur
- Maven 3.6+

## Configuration

### 1. Base de données
Assurez-vous que MySQL est installé et en cours d'exécution. Créez la base de données en exécutant le script SQL :

```bash
mysql -u root -p < ../database/init.sql
```

### 2. Configuration de l'application
Modifiez le fichier `src/main/resources/application.properties` selon votre configuration :

```properties
# Configuration de la base de données
spring.datasource.url=jdbc:mysql://localhost:3306/pmt_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=votre_username
spring.datasource.password=votre_password
```

## Installation et exécution

### 1. Compilation
```bash
mvn clean compile
```

### 2. Exécution
```bash
mvn spring-boot:run
```

L'application sera accessible à l'adresse : `http://localhost:8080`

### 3. Tests
```bash
mvn test
```

## Structure du projet

```
src/main/java/com/codesolutions/pmt/
├── config/                 # Configuration Spring
│   ├── SecurityConfig.java
│   └── WebSecurityConfig.java
├── controller/             # Contrôleurs REST
│   ├── HomeController.java
│   ├── UserController.java
│   └── ProjectController.java
├── dto/                    # Data Transfer Objects
│   ├── UserDto.java
│   ├── ProjectDto.java
│   └── ProjectMemberDto.java
├── entity/                 # Entités JPA
│   ├── User.java
│   ├── Project.java
│   ├── Task.java
│   ├── Role.java
│   ├── ProjectMember.java
│   ├── TaskStatus.java
│   ├── TaskHistory.java
│   └── Notification.java
├── repository/             # Repositories Spring Data
│   ├── UserRepository.java
│   ├── ProjectRepository.java
│   ├── TaskRepository.java
│   └── RoleRepository.java
└── service/                # Services métier
    ├── UserService.java
    └── ProjectService.java
```

## API Endpoints

### Utilisateurs (`/api/users`)
- `POST /api/users` - Créer un utilisateur
- `POST /api/users/login` - Authentification
- `GET /api/users` - Récupérer tous les utilisateurs
- `GET /api/users/{id}` - Récupérer un utilisateur par ID
- `GET /api/users/username/{username}` - Récupérer par nom d'utilisateur
- `GET /api/users/email/{email}` - Récupérer par email
- `GET /api/users/search/username?q={query}` - Recherche par nom d'utilisateur
- `GET /api/users/search/email?q={query}` - Recherche par email
- `GET /api/users/project/{projectId}` - Utilisateurs d'un projet
- `GET /api/users/project/{projectId}/role/{roleName}` - Utilisateurs avec rôle spécifique
- `GET /api/users/assigned-tasks` - Utilisateurs avec tâches assignées
- `PUT /api/users/{id}` - Mettre à jour un utilisateur
- `DELETE /api/users/{id}` - Supprimer un utilisateur

### Projets (`/api/projects`)
- `POST /api/projects?createdById={id}` - Créer un projet
- `GET /api/projects` - Récupérer tous les projets
- `GET /api/projects/paged` - Projets avec pagination
- `GET /api/projects/{id}` - Récupérer un projet par ID
- `GET /api/projects/search?name={name}` - Recherche par nom
- `GET /api/projects/created-by/{userId}` - Projets créés par un utilisateur
- `GET /api/projects/user/{userId}` - Projets d'un utilisateur
- `GET /api/projects/user/{userId}/role/{roleName}` - Projets avec rôle spécifique
- `GET /api/projects/recent` - Projets récents
- `PUT /api/projects/{id}` - Mettre à jour un projet
- `DELETE /api/projects/{id}` - Supprimer un projet

### Gestion des membres (`/api/projects/{projectId}/members`)
- `POST /api/projects/{projectId}/members` - Ajouter un membre
- `DELETE /api/projects/{projectId}/members/{userId}` - Supprimer un membre
- `PUT /api/projects/{projectId}/members/{userId}/role` - Changer le rôle

### Informations système
- `GET /api/` - Page d'accueil
- `GET /api/health` - Santé de l'application
- `GET /api/info` - Informations sur l'application

## Données de test

L'application est livrée avec des données de test :

### Utilisateurs
- **john.doe** (john.doe@example.com) - Admin principal
- **mariana.silva** (mariana.silva@example.com) - Tech Lead
- **nicolas.martin** (nicolas.martin@example.com) - Product Owner
- **alice.dupont** (alice.dupont@example.com) - Développeuse
- **bob.wilson** (bob.wilson@example.com) - Développeur

**Mot de passe pour tous les utilisateurs :** `password123`

### Projets de test
1. **PMT - Project Management Tool** - Le projet actuel
2. **E-commerce Platform** - Projet exemple
3. **Mobile App Redesign** - Projet exemple

## Fonctionnalités implémentées

### ✅ Gestion des utilisateurs
- Inscription et authentification
- CRUD complet
- Recherche et filtrage
- Gestion des profils

### ✅ Gestion des projets
- Création et modification de projets
- Gestion des membres avec rôles
- Recherche et filtrage
- Statistiques de projet

### ✅ Système de rôles
- ADMIN : Accès complet
- MEMBER : Création et gestion des tâches
- OBSERVER : Lecture seule

### ✅ API REST complète
- Endpoints RESTful
- Validation des données
- Gestion des erreurs
- CORS configuré pour Angular

## Prochaines étapes

### À implémenter
- [ ] Gestion des tâches (TaskService, TaskController)
- [ ] Gestion des notifications
- [ ] Historique des modifications
- [ ] Tests unitaires et d'intégration
- [ ] Documentation Swagger/OpenAPI
- [ ] Logging avancé
- [ ] Cache Redis
- [ ] Sécurité JWT

## Développement

### Ajout d'un nouvel endpoint
1. Créer le DTO si nécessaire
2. Ajouter la méthode dans le service
3. Créer l'endpoint dans le contrôleur
4. Ajouter les tests

### Structure recommandée
- **Controllers** : Gestion des requêtes HTTP
- **Services** : Logique métier
- **Repositories** : Accès aux données
- **DTOs** : Transfert de données
- **Entities** : Modèle de données

## Support

Pour toute question ou problème, consultez la documentation ou contactez l'équipe de développement. 