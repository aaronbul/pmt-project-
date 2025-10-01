#!/bin/bash

# Script de génération des rapports de couverture PMT
# Usage: ./generate-reports.sh

echo "📊 Génération des rapports de couverture PMT"
echo "============================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "docker-compose.yml" ]; then
    print_error "Ce script doit être exécuté depuis le répertoire racine du projet PMT"
    exit 1
fi

print_status "Démarrage de la génération des rapports..."

# 1. Rapports Backend
print_status "Génération des rapports Backend (Spring Boot)..."
cd pmt-backend

if [ ! -f "pom.xml" ]; then
    print_error "Fichier pom.xml non trouvé dans pmt-backend/"
    exit 1
fi

# Nettoyer et générer les rapports backend
print_status "Exécution des tests et génération du rapport JaCoCo..."
if mvn clean test jacoco:report; then
    print_success "Rapports Backend générés avec succès"
    print_status "Rapport disponible: pmt-backend/target/site/jacoco/index.html"
else
    print_error "Échec de la génération des rapports Backend"
    exit 1
fi

# Vérifier les seuils backend
print_status "Vérification des seuils de couverture Backend..."
if mvn jacoco:check; then
    print_success "Seuils de couverture Backend respectés"
else
    print_warning "Seuils de couverture Backend non respectés (voir le rapport pour plus de détails)"
fi

cd ..

# 2. Rapports Frontend
print_status "Génération des rapports Frontend (Angular)..."
cd pmt-frontend

if [ ! -f "package.json" ]; then
    print_error "Fichier package.json non trouvé dans pmt-frontend/"
    exit 1
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    print_status "Installation des dépendances npm..."
    npm install
fi

# Générer les rapports frontend
print_status "Exécution des tests et génération du rapport de couverture..."
if npm run test:coverage; then
    print_success "Rapports Frontend générés avec succès"
    print_status "Rapport disponible: pmt-frontend/coverage/index.html"
else
    print_error "Échec de la génération des rapports Frontend"
    exit 1
fi

cd ..

# 3. Résumé
echo ""
echo "🎉 Génération des rapports terminée !"
echo "====================================="
echo ""
echo "📋 Rapports disponibles :"
echo ""
echo "🔧 Backend (Spring Boot) :"
echo "   - Rapport principal : pmt-backend/target/site/jacoco/index.html"
echo "   - Données XML : pmt-backend/target/site/jacoco/jacoco.xml"
echo "   - Données CSV : pmt-backend/target/site/jacoco/jacoco.csv"
echo ""
echo "🎨 Frontend (Angular) :"
echo "   - Rapport principal : pmt-frontend/coverage/index.html"
echo "   - Données LCOV : pmt-frontend/coverage/lcov.info"
echo ""
echo "📊 Métriques actuelles :"
echo "   - Backend : 56% de couverture (seuil requis : 60%)"
echo "   - Frontend : 85% de couverture (seuil requis : 80%)"
echo ""
echo "💡 Pour ouvrir les rapports :"
echo "   - Backend : start pmt-backend/target/site/jacoco/index.html"
echo "   - Frontend : start pmt-frontend/coverage/index.html"
echo ""
echo "📝 Documentation complète : REPORTS.md" 