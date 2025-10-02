# eclipse-temurin - high performace java runtime
# 17-jdk - jdk17
# alpine - meaning that the application will run in alpine linux which is good for creating very small docker images
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY target/nightshiftInventory-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT [ "java", "-jar", "app.jar" ]