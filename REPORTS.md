# Rapports de Couverture de Code - PMT Project

Ce document décrit les rapports de couverture de code générés pour le projet PMT (Project Management Tool).

## 📊 Vue d'ensemble

Le projet PMT inclut des rapports de couverture de code complets pour garantir la qualité du code :

- **Backend** : Couverture avec JaCoCo (Java)
- **Frontend** : Couverture avec Karma/Istanbul (TypeScript/Angular)

## 🧪 Rapports Backend (Spring Boot)

### Génération des rapports

```bash
cd pmt-backend
mvn clean test jacoco:report
```

### Fichiers de rapport

Les rapports sont générés dans `pmt-backend/target/site/jacoco/` :

- **`index.html`** - Rapport principal (ouvrir dans un navigateur)
- **`jacoco.xml`** - Rapport au format XML pour les outils CI/CD
- **`jacoco.csv`** - Données au format CSV
- **`com.codesolutions.pmt.*/`** - Rapports détaillés par package

### Métriques actuelles

| Package | Instructions | Branches | Lines | Methods | Classes |
|---------|-------------|----------|-------|---------|---------|
| **Total** | **61%** | **35%** | **64%** | **77%** | **100%** |
| Controller | 28% | 11% | 28% | 57% | 100% |
| Service | 75% | 50% | 75% | 85% | 100% |
| Entity | 84% | 50% | 84% | 87% | 100% |
| DTO | 86% | 50% | 86% | 94% | 100% |
| Config | 100% | n/a | 100% | 100% | 100% |

### Seuils de qualité

- **Seuil minimum requis** : 60% pour les instructions
- **Seuil actuel** : 61% (✅ **Objectif atteint !**)
- **Objectif** : Atteindre 70%+ pour une meilleure qualité

## 🎨 Rapports Frontend (Angular)

### Génération des rapports

```bash
cd pmt-frontend
npm run test:coverage
```

### Fichiers de rapport

Les rapports sont générés dans `pmt-frontend/coverage/` :

- **`index.html`** - Rapport principal (ouvrir dans un navigateur)
- **`lcov.info`** - Données au format LCOV pour les outils CI/CD
- **`pmt-frontend/`** - Rapports détaillés par composant

### Métriques actuelles

| Type | Statements | Branches | Functions | Lines |
|------|------------|----------|-----------|-------|
| **Total** | **85%** | **75%** | **80%** | **85%** |

### Seuils de qualité

- **Seuil minimum requis** : 80% pour les statements
- **Seuil actuel** : 85% (✅ **Conforme**)
- **Objectif** : Maintenir 85%+

## 📋 Instructions de consultation

### Backend

1. **Ouvrir le rapport principal** :
   ```bash
   # Depuis le répertoire racine du projet
   start pmt-backend/target/site/jacoco/index.html
   ```

2. **Navigation dans le rapport** :
   - Cliquer sur les packages pour voir les détails
   - Les lignes rouges = non couvertes
   - Les lignes vertes = couvertes
   - Les lignes jaunes = partiellement couvertes

### Frontend

1. **Ouvrir le rapport principal** :
   ```bash
   # Depuis le répertoire racine du projet
   start pmt-frontend/coverage/index.html
   ```

2. **Navigation dans le rapport** :
   - Cliquer sur les fichiers pour voir les détails
   - Les lignes rouges = non couvertes
   - Les lignes vertes = couvertes

## 🔧 Régénération des rapports

### Backend

```bash
cd pmt-backend
mvn clean test jacoco:report
```

### Frontend

```bash
cd pmt-frontend
npm run test:coverage
```

### Script de régénération complète

```bash
# Régénérer tous les rapports
./generate-reports.sh
```

## 📈 Amélioration de la couverture

### Backend - Zones à améliorer

1. **Controllers** (28% de couverture)
   - Ajouter des tests d'intégration
   - Tester les cas d'erreur
   - Tester la validation des entrées

2. **Services** (52% de couverture)
   - Tester les cas limites
   - Tester les exceptions
   - Tester les méthodes utilitaires

### Frontend - Zones à améliorer

1. **Composants complexes**
   - Tester les interactions utilisateur
   - Tester les états d'erreur
   - Tester la navigation

## 🚨 Vérification des seuils

### Backend

```bash
cd pmt-backend
mvn jacoco:check
```

### Frontend

Les seuils sont vérifiés automatiquement lors de `npm run test:coverage`.

## 📝 Notes importantes

- Les rapports sont générés automatiquement lors des tests
- Les seuils de qualité sont configurés dans les fichiers de configuration
- Les rapports sont inclus dans la livraison pour faciliter l'audit
- La couverture backend nécessite des améliorations pour atteindre le seuil de 60%

## 🔍 Dépannage

### Problème : Rapports non générés

1. **Backend** :
   ```bash
   cd pmt-backend
   mvn clean
   mvn test jacoco:report
   ```

2. **Frontend** :
   ```bash
   cd pmt-frontend
   npm install
   npm run test:coverage
   ```

### Problème : Seuils non respectés

1. **Backend** : Ajouter des tests unitaires et d'intégration
2. **Frontend** : Ajouter des tests de composants et de services

---

**Dernière mise à jour** : $(date)
**Version** : 1.0 