# Stage 1: Build the application using the Gradle image
FROM gradle:jdk17-alpine AS builder
# Set the working directory in the container
WORKDIR /home/gradle/project

# Copy only the necessary files for initializing the Gradle build first
COPY ./gradlew ./gradlew
COPY ./gradle ./gradle
COPY ./build.gradle ./build.gradle
COPY ./settings.gradle ./settings.gradle
# Grant execution permission to the Gradle wrapper
RUN chmod +x ./gradlew

# Download dependencies without building the project to cache layers
RUN ./gradlew --no-daemon dependencies

# Now copy the source files
COPY ./src ./src

# Build the application using the Gradle wrapper. Skip tests to speed up the build.
RUN ./gradlew build --no-daemon -x test

# Stage 2: Create the runtime image with a smaller base
FROM eclipse-temurin:17-jre-alpine

# Set a non-root user for security (optional but recommended)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy the built JAR from the build stage
COPY --from=builder /home/gradle/project/build/libs/*.jar /app.jar

# Expose port 8080
EXPOSE 8080

# Set the command to run the application
CMD ["java", "-jar", "/app.jar"]

# how to run the container