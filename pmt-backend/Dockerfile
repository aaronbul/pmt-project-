# Dockerfile pour le backend Spring Boot PMT

# Étape 1 : Build avec Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier le fichier pom.xml
COPY pom.xml .

# Télécharger les dépendances (cache layer)
RUN mvn dependency:go-offline -B

# Copier le code source
COPY src ./src

# Build de l'application
RUN mvn clean package -DskipTests

# Étape 2 : Runtime avec JRE
FROM eclipse-temurin:21-jre-alpine

# Installer curl pour les health checks
RUN apk add --no-cache curl

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S javauser && adduser -u 1001 -S javauser -G javauser

# Définir le répertoire de travail
WORKDIR /app

# Copier le JAR depuis l'étape de build
COPY --from=build /app/target/*.jar app.jar

# Changer les permissions
RUN chown -R javauser:javauser /app

# Passer à l'utilisateur non-root
USER javauser

# Exposer le port
EXPOSE 8080

# Variables d'environnement
ENV SPRING_PROFILES_ACTIVE=docker
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# Commande de démarrage
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"] 