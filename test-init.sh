#!/bin/bash

# Script de test pour vérifier l'initialisation de la base de données PMT

echo "🧪 Test d'initialisation de la base de données PMT"
echo "=================================================="

# Vérifier que Docker est en cours d'exécution
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker n'est pas en cours d'exécution"
    exit 1
fi

echo "✅ Docker est en cours d'exécution"

# Arrêter et nettoyer les conteneurs existants
echo "🔄 Nettoyage des conteneurs existants..."
docker-compose down -v > /dev/null 2>&1

# Démarrer les services
echo "🚀 Démarrage des services..."
docker-compose up -d mysql

# Attendre que MySQL soit prêt
echo "⏳ Attente que MySQL soit prêt..."
sleep 30

# Vérifier que MySQL est en cours d'exécution
if ! docker-compose ps mysql | grep -q "Up"; then
    echo "❌ MySQL n'a pas démarré correctement"
    docker-compose logs mysql
    exit 1
fi

echo "✅ MySQL est en cours d'exécution"

# Attendre un peu plus pour l'initialisation
echo "⏳ Attente de l'initialisation..."
sleep 10

# Tester la connexion et vérifier les données
echo "🔍 Vérification des données..."

# Vérifier que la base de données existe
DB_EXISTS=$(docker exec pmt-mysql mysql -u pmt_user -ppmt_password -e "SHOW DATABASES LIKE 'pmt_db';" 2>/dev/null | wc -l)
if [ "$DB_EXISTS" -lt 2 ]; then
    echo "❌ La base de données 'pmt_db' n'existe pas"
    exit 1
fi

echo "✅ Base de données 'pmt_db' existe"

# Vérifier les tables
TABLES_COUNT=$(docker exec pmt-mysql mysql -u pmt_user -ppmt_password pmt_db -e "SHOW TABLES;" 2>/dev/null | wc -l)
if [ "$TABLES_COUNT" -lt 8 ]; then
    echo "❌ Nombre de tables insuffisant: $TABLES_COUNT"
    exit 1
fi

echo "✅ Tables créées ($TABLES_COUNT tables)"

# Vérifier les utilisateurs
USERS_COUNT=$(docker exec pmt-mysql mysql -u pmt_user -ppmt_password pmt_db -e "SELECT COUNT(*) FROM users;" 2>/dev/null | tail -n 1)
if [ "$USERS_COUNT" -lt 5 ]; then
    echo "❌ Nombre d'utilisateurs insuffisant: $USERS_COUNT"
    exit 1
fi

echo "✅ Utilisateurs créés ($USERS_COUNT utilisateurs)"

# Vérifier les projets
PROJECTS_COUNT=$(docker exec pmt-mysql mysql -u pmt_user -ppmt_password pmt_db -e "SELECT COUNT(*) FROM projects;" 2>/dev/null | tail -n 1)
if [ "$PROJECTS_COUNT" -lt 3 ]; then
    echo "❌ Nombre de projets insuffisant: $PROJECTS_COUNT"
    exit 1
fi

echo "✅ Projets créés ($PROJECTS_COUNT projets)"

# Vérifier les tâches
TASKS_COUNT=$(docker exec pmt-mysql mysql -u pmt_user -ppmt_password pmt_db -e "SELECT COUNT(*) FROM tasks;" 2>/dev/null | tail -n 1)
if [ "$TASKS_COUNT" -lt 10 ]; then
    echo "❌ Nombre de tâches insuffisant: $TASKS_COUNT"
    exit 1
fi

echo "✅ Tâches créées ($TASKS_COUNT tâches)"

# Afficher un résumé des données
echo ""
echo "📊 Résumé des données initialisées:"
echo "-----------------------------------"
docker exec pmt-mysql mysql -u pmt_user -ppmt_password pmt_db -e "
SELECT 'Utilisateurs' as Type, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Projets', COUNT(*) FROM projects
UNION ALL
SELECT 'Tâches', COUNT(*) FROM tasks
UNION ALL
SELECT 'Membres de projet', COUNT(*) FROM project_members
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications;
" 2>/dev/null

echo ""
echo "🎉 Test d'initialisation réussi !"
echo "La base de données est correctement initialisée avec toutes les données de test."
echo ""
echo "Vous pouvez maintenant démarrer l'application complète avec:"
echo "docker-compose up -d" 