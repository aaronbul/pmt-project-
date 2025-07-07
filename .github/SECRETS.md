# Configuration des Secrets GitHub Actions

Ce document explique comment configurer les secrets GitHub nécessaires pour le pipeline CI/CD du projet PMT.

## 🔐 Secrets Requis

### 1. DOCKER_USERNAME
**Description** : Nom d'utilisateur Docker Hub  
**Type** : String  
**Exemple** : `votre-username`

### 2. DOCKER_PASSWORD
**Description** : Mot de passe ou token Docker Hub  
**Type** : Secret  
**Exemple** : `votre-password-ou-token`

## 📋 Configuration

### Étape 1 : Créer un compte Docker Hub

1. Allez sur [Docker Hub](https://hub.docker.com/)
2. Créez un compte gratuit
3. Notez votre nom d'utilisateur

### Étape 2 : Créer un Access Token Docker Hub

1. Connectez-vous à Docker Hub
2. Allez dans **Account Settings** > **Security**
3. Cliquez sur **New Access Token**
4. Donnez un nom (ex: "PMT CI/CD")
5. Sélectionnez **Read & Write** permissions
6. Copiez le token généré

### Étape 3 : Configurer les secrets GitHub

1. Allez dans votre repository GitHub
2. Cliquez sur **Settings** > **Secrets and variables** > **Actions**
3. Cliquez sur **New repository secret**

#### Secret 1 : DOCKER_USERNAME
- **Name** : `DOCKER_USERNAME`
- **Value** : Votre nom d'utilisateur Docker Hub

#### Secret 2 : DOCKER_PASSWORD
- **Name** : `DOCKER_PASSWORD`
- **Value** : Votre token Docker Hub (pas votre mot de passe)

## 🔒 Sécurité

### Bonnes pratiques

1. **Utilisez des tokens** au lieu des mots de passe
2. **Limitez les permissions** des tokens
3. **Régénérez régulièrement** les tokens
4. **Ne partagez jamais** les secrets

### Permissions minimales

Le token Docker Hub doit avoir :
- ✅ **Read & Write** pour les repositories
- ❌ Pas besoin d'admin permissions

## 🚀 Test de la configuration

Une fois les secrets configurés :

1. **Poussez sur la branche main** :
   ```bash
   git push origin main
   ```

2. **Vérifiez le workflow** :
   - Allez dans l'onglet **Actions** de votre repository
   - Le workflow "PMT CI/CD Pipeline" devrait se déclencher

3. **Vérifiez les images** :
   - Allez sur votre profil Docker Hub
   - Les images `pmt-backend` et `pmt-frontend` devraient apparaître

## 🐛 Dépannage

### Erreur d'authentification Docker

```
Error: failed to authorize: failed to fetch anonymous token
```

**Solution** : Vérifiez que `DOCKER_USERNAME` et `DOCKER_PASSWORD` sont corrects.

### Erreur de permissions

```
Error: denied: requested access to the resource is denied
```

**Solution** : Vérifiez que le token a les bonnes permissions.

### Images non trouvées

```
Error: failed to compute cache key: failed to calculate checksum
```

**Solution** : Vérifiez que les Dockerfiles sont corrects et que le contexte de build est valide.

## 📞 Support

En cas de problème :

1. Vérifiez les logs GitHub Actions
2. Testez l'authentification Docker localement
3. Vérifiez la configuration des secrets
4. Consultez la documentation Docker Hub 