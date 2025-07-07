# Tests du Projet PMT

Ce document décrit la configuration et l'exécution des tests pour le projet PMT (Project Management Tool).

## Structure des Tests

### Backend (Spring Boot)

Les tests du backend sont organisés dans le répertoire `pmt-backend/src/test/` :

- **Tests unitaires** : `src/test/java/com/codesolutions/pmt/service/`
- **Tests d'intégration** : `src/test/java/com/codesolutions/pmt/controller/`
- **Tests de configuration** : `src/test/java/com/codesolutions/pmt/`

#### Services testés :
- `UserServiceTest` - Tests pour la gestion des utilisateurs
- `ProjectServiceTest` - Tests pour la gestion des projets
- `TaskServiceTest` - Tests pour la gestion des tâches

#### Contrôleurs testés :
- `UserControllerTest` - Tests d'intégration pour l'API utilisateurs

### Frontend (Angular)

Les tests du frontend sont organisés dans le répertoire `pmt-frontend/src/app/` :

- **Tests de services** : `src/app/services/*.spec.ts`
- **Tests de composants** : `src/app/pages/*/*.spec.ts`

#### Services testés :
- `AuthService` - Tests pour l'authentification

#### Composants testés :
- `LoginComponent` - Tests pour le composant de connexion

## Configuration

### Backend - Jacoco

La couverture de code est configurée avec **Jacoco** dans le `pom.xml` :

```xml
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.11</version>
    <!-- Configuration détaillée... -->
</plugin>
```

**Seuils de couverture** :
- Lignes de code : 60% minimum
- Branches : 60% minimum
- Fonctions : 60% minimum

### Frontend - Karma + Jasmine

La couverture de code est configurée avec **Karma** dans `karma.conf.js` :

```javascript
coverageReporter: {
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}
```

**Seuils de couverture** :
- Lignes de code : 80% minimum
- Branches : 80% minimum
- Fonctions : 80% minimum

## Exécution des Tests

### Backend

```bash
# Exécuter tous les tests
cd pmt-project/pmt-backend
mvn test

# Exécuter les tests avec couverture
mvn clean test jacoco:report

# Vérifier la couverture
mvn jacoco:check
```

**Rapports générés** :
- HTML : `target/site/jacoco/index.html`
- XML : `target/site/jacoco/jacoco.xml`

### Frontend

```bash
# Exécuter tous les tests
cd pmt-project/pmt-frontend
npm test

# Exécuter les tests avec couverture
npm run test:coverage

# Exécuter les tests en mode watch
npm run test:watch
```

**Rapports générés** :
- HTML : `coverage/pmt-frontend/index.html`
- LCOV : `coverage/pmt-frontend/lcov.info`

## Bonnes Pratiques

### Tests Unitaires

1. **Nommage** : `[Classe]Test` pour les tests unitaires
2. **Structure** : Utiliser le pattern AAA (Arrange, Act, Assert)
3. **Mocking** : Utiliser Mockito pour les dépendances
4. **Couverture** : Tester les cas de succès et d'erreur

### Tests d'Intégration

1. **Nommage** : `[Contrôleur]Test` pour les tests d'intégration
2. **Configuration** : Utiliser `@WebMvcTest` pour les contrôleurs
3. **HTTP** : Tester les codes de statut et le contenu des réponses
4. **Validation** : Tester la validation des entrées

### Tests Frontend

1. **Nommage** : `*.spec.ts` pour tous les tests
2. **Configuration** : Utiliser TestBed et les modules de test Angular
3. **Mocking** : Utiliser les spies Jasmine pour les services
4. **UI** : Tester les interactions utilisateur et les états

## Exemples de Tests

### Test Unitaire Backend

```java
@Test
void createUser_Success() {
    // Given
    when(userRepository.existsByUsername(anyString())).thenReturn(false);
    when(userRepository.save(any(User.class))).thenReturn(testUser);

    // When
    UserDTO result = userService.createUser(testUserDto);

    // Then
    assertNotNull(result);
    assertEquals(testUser.getUsername(), result.getUsername());
    verify(userRepository).save(any(User.class));
}
```

### Test d'Intégration Backend

```java
@Test
void register_Success() throws Exception {
    // Given
    when(userService.createUser(any(UserDTO.class))).thenReturn(testUserDto);

    // When & Then
    mockMvc.perform(post("/api/users/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(createUserDto)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.username").value("testuser"));
}
```

### Test Frontend

```typescript
it('should handle successful login', () => {
    // Given
    authService.login.and.returnValue(of(mockUser));

    // When
    component.onLogin();

    // Then
    expect(authService.login).toHaveBeenCalledWith(component.loginRequest);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
});
```

## Maintenance

### Ajout de nouveaux tests

1. **Backend** : Créer une classe `[Service]Test` dans le package approprié
2. **Frontend** : Créer un fichier `[Component].spec.ts` à côté du composant
3. **Documentation** : Mettre à jour ce fichier avec les nouveaux tests

### Mise à jour des seuils

1. **Backend** : Modifier les seuils dans `pom.xml` (section jacoco:check)
2. **Frontend** : Modifier les seuils dans `karma.conf.js` (section coverageReporter)

### Exécution en CI/CD

Les tests sont automatiquement exécutés dans le pipeline CI/CD avec :
- Vérification de la couverture de code
- Génération des rapports
- Notification en cas d'échec

## Dépannage

### Problèmes courants

1. **Tests qui échouent** : Vérifier les mocks et les données de test
2. **Couverture insuffisante** : Ajouter des tests pour les branches manquantes
3. **Tests lents** : Optimiser les mocks et réduire les appels HTTP

### Commandes utiles

```bash
# Backend - Tests spécifiques
mvn test -Dtest=UserServiceTest

# Frontend - Tests spécifiques
ng test --include="**/auth.service.spec.ts"

# Nettoyage
mvn clean
npm run clean
``` 