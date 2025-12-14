# eclipse-temurin - high performance java runtime
# 17-jdk - jdk17
# alpine - meaning that the application will run in alpine linux which is good for creating very small docker images
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# copy pom first for dependency caching
COPY pom.xml .
RUN ./mvnw dependency:go-offline || mvn dependency:go-offline

# copy source and build
COPY src ./src
RUN ./mvnw clean package -DskipTests || mvn clean package -DskipTests


# ---------- runtime stage ----------
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
