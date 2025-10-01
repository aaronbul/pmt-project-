# Initialisation de la Base de Données PMT

## Vue d'ensemble

La base de données MySQL est automatiquement initialisée lors du premier démarrage de l'application via Docker Compose.

## Fichiers d'initialisation

### `init.sql`
Ce fichier contient :
- Création de toutes les tables nécessaires
- Insertion des données de référence (rôles, statuts)
- Création des utilisateurs de test
- Création des projets de test
- Création des tâches de test
- Insertion des données d'historique et notifications

## Processus d'initialisation automatique

1. **Démarrage MySQL** : Le conteneur MySQL démarre
2. **Exécution automatique** : Le fichier `init.sql` est automatiquement exécuté via le volume monté dans `/docker-entrypoint-initdb.d/`
3. **Base prête** : La base de données est immédiatement utilisable avec toutes les données de test

## Données de test incluses

### Utilisateurs
- `john.doe` / `password123` (Admin)
- `mariana.silva` / `password123` (Membre)
- `nicolas.martin` / `password123` (Membre)
- `alice.dupont` / `password123` (Observateur)
- `bob.wilson` / `password123` (Membre)

### Rôles
- `ADMIN` : Accès complet au projet
- `MEMBER` : Peut créer et modifier des tâches
- `OBSERVER` : Lecture seule

### Statuts de tâches
- `TODO` : À faire
- `IN_PROGRESS` : En cours
- `REVIEW` : En révision
- `DONE` : Terminé
- `CANCELLED` : Annulé

### Projets de test
1. **PMT - Project Management Tool**
   - Description : Développement d'une plateforme de gestion de projet collaboratif
   - Créé par : john.doe
   - Membres : 4 utilisateurs avec différents rôles

2. **E-commerce Platform**
   - Description : Création d'une plateforme e-commerce moderne
   - Créé par : mariana.silva
   - Membres : 3 utilisateurs

3. **Mobile App Redesign**
   - Description : Refonte complète de l'application mobile
   - Créé par : nicolas.martin
   - Membres : 3 utilisateurs

## Réinitialisation

Pour réinitialiser complètement la base de données :

```bash
# Arrêter les conteneurs
docker-compose down

# Supprimer le volume de données
docker-compose down -v

# Redémarrer
docker-compose up -d
```

## Accès à la base de données

### Via phpMyAdmin
- URL : http://localhost:8081
- Utilisateur : `pmt_user`
- Mot de passe : `pmt_password`

### Via ligne de commande
```bash
# Se connecter au conteneur MySQL
docker exec -it pmt-mysql mysql -u pmt_user -p

# Mot de passe : pmt_password
```

## Structure de la base de données

Voir le fichier `schema.png` pour un aperçu visuel de la structure de la base de données.

## Dépannage

### Problème : Base de données vide
1. Vérifier que le fichier `init.sql` existe dans le dossier `database/`
2. Vérifier les logs MySQL : `docker-compose logs mysql`
3. Réinitialiser complètement : `docker-compose down -v && docker-compose up -d`

### Problème : Erreurs d'initialisation
1. Vérifier la syntaxe SQL dans `init.sql`
2. Vérifier les logs MySQL pour les erreurs spécifiques
3. S'assurer que MySQL a les permissions nécessaires 