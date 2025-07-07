# Base de données PMT

## 📋 Description

Ce dossier contient tous les scripts SQL nécessaires pour initialiser et peupler la base de données de l'application PMT (Project Management Tool).

## 📁 Fichiers

- `init.sql` - Script complet d'initialisation (structure + données)
- `schema.sql` - Structure de la base de données uniquement
- `data.sql` - Données de test uniquement
- `generate-passwords.sql` - Script pour corriger les mots de passe
- `init-phpmyadmin.sql` - Version compatible phpMyAdmin

## 🔐 Mots de passe

**Tous les utilisateurs de test ont le mot de passe : `password123`**

### Utilisateurs de test disponibles :

1. **John Doe** - `john.doe@example.com` (Admin)
2. **Mariana Silva** - `mariana.silva@example.com` (Admin)
3. **Nicolas Martin** - `nicolas.martin@example.com` (Admin)
4. **Alice Dupont** - `alice.dupont@example.com` (Member)
5. **Bob Wilson** - `bob.wilson@example.com` (Member)

## 🚀 Installation

### Option 1 : Script complet
```sql
-- Exécuter le fichier init.sql dans votre client MySQL
source init.sql;
```

### Option 2 : Via phpMyAdmin
1. Créer une base de données `pmt_db`
2. Importer le fichier `init-phpmyadmin.sql`

### Option 3 : Ligne de commande
```bash
mysql -u root -p < init.sql
```

## 🔧 Correction des mots de passe

Si vous rencontrez des problèmes d'authentification avec les utilisateurs de test, exécutez le script de correction :

```sql
source generate-passwords.sql;
```

## 📊 Structure de la base

- **users** - Utilisateurs de l'application
- **projects** - Projets
- **project_members** - Membres des projets avec leurs rôles
- **tasks** - Tâches des projets
- **task_status** - Statuts des tâches (TODO, IN_PROGRESS, etc.)
- **task_history** - Historique des modifications de tâches
- **notifications** - Notifications des utilisateurs
- **roles** - Rôles (ADMIN, MEMBER, OBSERVER)

## 🧪 Données de test

Le script inclut :
- 5 utilisateurs de test
- 3 projets de test
- 11 tâches réparties sur les projets
- Historique des modifications
- Notifications de test

## ⚠️ Notes importantes

- Les mots de passe sont hashés avec BCrypt
- Tous les utilisateurs de test utilisent le même hash pour `password123`
- Les relations entre les entités sont préservées
- Les contraintes d'intégrité référentielle sont respectées

## Configuration Spring Boot

Dans `application.properties` :
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/pmt_db
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
```

## Notes importantes

- Les mots de passe sont hashés avec BCrypt
- Les contraintes de clés étrangères sont configurées avec CASCADE appropriés
- Les index sont créés pour optimiser les performances
- La base de données utilise MySQL 8.0+ 