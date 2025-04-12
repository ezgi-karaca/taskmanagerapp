FROM openjdk:17-jdk-slim

COPY . /app
WORKDIR /app

RUN ./mvnw clean install -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/taskmanagerapp-0.0.1-SNAPSHOT.jar"]


