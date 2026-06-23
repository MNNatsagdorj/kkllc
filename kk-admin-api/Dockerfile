# ---- build stage ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
# 의존성 캐시 레이어: pom 먼저 복사 → 변경 없으면 재다운로드 생략
COPY pom.xml .
RUN mvn -q -e -DskipTests dependency:go-offline
COPY src ./src
RUN mvn -q -e -DskipTests clean package

# ---- runtime stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app
# Spring Boot 3 는 실행 가능 jar 하나만 생성(.original 은 .jar 로 끝나지 않아 매칭 안 됨)
COPY --from=build /app/target/*.jar app.jar
# Render free(512MB) 환경에서 메모리 절약
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=70 -XX:+UseSerialGC -Xss512k"
# 문서용. 실제 포트는 Render 가 주입하는 $PORT 를 application.yml 에서 사용
EXPOSE 8085
ENTRYPOINT ["java","-jar","/app/app.jar"]
