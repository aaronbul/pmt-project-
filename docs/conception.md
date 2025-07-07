# Conception - PMT Project Management Tool

## 1. Analyse des entités

### Entités principales identifiées

#### 1.1 User (Utilisateur)
- **Attributs** : id, username, email, password, created_at, updated_at
- **Responsabilités** : Authentification, gestion des profils utilisateur
- **Relations** : 
  - One-to-Many avec Project (créateur)
  - Many-to-Many avec Project via ProjectMember
  - One-to-Many avec Task (assigné, créateur)
  - One-to-Many avec Notification
  - One-to-Many avec TaskHistory

#### 1.2 Project (Projet)
- **Attributs** : id, name, description, start_date, created_by, created_at, updated_at
- **Responsabilités** : Gestion des projets, organisation des tâches
- **Relations** :
  - Many-to-One avec User (créateur)
  - Many-to-Many avec User via ProjectMember
  - One-to-Many avec Task

#### 1.3 Task (Tâche)
- **Attributs** : id, title, description, status_id, priority, project_id, assigned_to, created_by, due_date, created_at, updated_at
- **Responsabilités** : Gestion des tâches, suivi du travail
- **Relations** :
  - Many-to-One avec Project
  - Many-to-One avec User (assigné, créateur)
  - Many-to-One avec TaskStatus
  - One-to-Many avec TaskHistory

#### 1.4 ProjectMember (Membre de projet)
- **Attributs** : id, project_id, user_id, role_id, joined_at
- **Responsabilités** : Gestion des rôles et permissions par projet
- **Relations** :
  - Many-to-One avec Project
  - Many-to-One avec User
  - Many-to-One avec Role

#### 1.5 Role (Rôle)
- **Attributs** : id, name
- **Valeurs** : ADMIN, MEMBER, OBSERVER
- **Responsabilités** : Définition des permissions

#### 1.6 TaskStatus (Statut de tâche)
- **Attributs** : id, name
- **Valeurs** : TODO, IN_PROGRESS, REVIEW, DONE, CANCELLED
- **Responsabilités** : Suivi de l'état des tâches

#### 1.7 TaskHistory (Historique des tâches)
- **Attributs** : id, task_id, user_id, action, old_value, new_value, created_at
- **Responsabilités** : Audit trail des modifications
- **Relations** :
  - Many-to-One avec Task
  - Many-to-One avec User

#### 1.8 Notification (Notification)
- **Attributs** : id, user_id, title, message, type, is_read, related_entity_type, related_entity_id, created_at
- **Responsabilités** : Système de notifications
- **Relations** :
  - Many-to-One avec User

## 2. Architecture de la base de données

### 2.1 Normalisation
- **1NF** : Toutes les tables sont en première forme normale
- **2NF** : Pas de dépendances partielles
- **3NF** : Pas de dépendances transitives

### 2.2 Contraintes d'intégrité
- **Clés primaires** : Toutes les tables ont une clé primaire auto-incrémentée
- **Clés étrangères** : Contraintes de référentiel avec CASCADE et SET NULL appropriés
- **Contraintes d'unicité** : 
  - username et email uniques dans users
  - Combinaison project_id + user_id unique dans project_members

### 2.3 Index
- Index sur les clés étrangères pour optimiser les jointures
- Index sur les colonnes fréquemment utilisées dans les requêtes
- Index sur is_read pour les notifications

## 3. Gestion des rôles et permissions

### 3.1 Matrice des permissions

| Action | Admin | Member | Observer |
|--------|-------|--------|----------|
| Ajouter un membre | ✅ | ❌ | ❌ |
| Attribuer un rôle | ✅ | ❌ | ❌ |
| Créer une tâche | ✅ | ✅ | ❌ |
| Assigner une tâche | ✅ | ✅ | ❌ |
| Mettre à jour une tâche | ✅ | ✅ | ❌ |
| Visualiser une tâche | ✅ | ✅ | ✅ |
| Visualiser le tableau de bord | ✅ | ✅ | ✅ |
| Être notifié | ✅ | ✅ | ✅ |
| Voir l'historique | ✅ | ✅ | ✅ |

### 3.2 Implémentation des permissions
- Vérification au niveau de l'API (Spring Security)
- Contrôle d'accès basé sur les rôles (RBAC)
- Validation côté frontend et backend

## 4. Workflow des tâches

### 4.1 Cycle de vie d'une tâche
1. **TODO** : Tâche créée, en attente de prise en charge
2. **IN_PROGRESS** : Tâche en cours de développement
3. **REVIEW** : Tâche en cours de revue
4. **DONE** : Tâche terminée
5. **CANCELLED** : Tâche annulée

### 4.2 Transitions autorisées
- TODO → IN_PROGRESS (Member, Admin)
- IN_PROGRESS → REVIEW (Member, Admin)
- REVIEW → DONE (Member, Admin)
- REVIEW → IN_PROGRESS (Member, Admin)
- Tout statut → CANCELLED (Admin uniquement)

## 5. Système de notifications

### 5.1 Types de notifications
- **TASK_ASSIGNED** : Une tâche vous a été assignée
- **TASK_UPDATED** : Une tâche a été mise à jour
- **PROJECT_INVITATION** : Invitation à rejoindre un projet

### 5.2 Déclencheurs
- Assignation de tâche
- Changement de statut
- Mise à jour de tâche
- Invitation de membre

## 6. Considérations techniques

### 6.1 Sécurité
- Mots de passe hashés avec BCrypt
- Validation des données côté serveur
- Protection contre les injections SQL (JPA/Hibernate)

### 6.2 Performance
- Index sur les colonnes de jointure
- Pagination pour les listes
- Requêtes optimisées avec JPA

### 6.3 Évolutivité
- Architecture modulaire
- Séparation des responsabilités
- API RESTful pour l'intégration future

## 7. Données de test

### 7.1 Utilisateurs de test
- **john.doe** : Admin principal
- **mariana.silva** : Tech Lead
- **nicolas.martin** : Product Owner
- **alice.dupont** : Développeuse
- **bob.wilson** : Développeur

### 7.2 Projets de test
- **PMT** : Le projet actuel
- **E-commerce Platform** : Projet exemple
- **Mobile App Redesign** : Projet exemple

### 7.3 Tâches de test
- Tâches couvrant tous les statuts
- Différentes priorités
- Assignations variées 