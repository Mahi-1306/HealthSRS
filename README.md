# HealthSRS — Health Coach Application & Review System

Full-stack Health Coach credentialing, application, and RBAC review platform built with **Spring Boot 3 (Java 21)**, **MySQL 8**, **React 18 (Vite)**, and **Tailwind CSS**.

## Project Structure

- `backend/HealthSRS` — Spring Boot REST API on port `7980` with Spring Security + JWT, JPA/Hibernate + MySQL, and Swagger UI.
- `frontend` — React + Tailwind CSS SPA on port `5173` (proxying `/api` to `http://localhost:7980`).

## Database Setup (MySQL)

By default, [application.properties](backend/HealthSRS/src/main/resources/application.properties) connects to:
- URL: `jdbc:mysql://localhost:3306/healthsrs?createDatabaseIfNotExist=true`
- Username: `MYSQL_USER` (default `root`)
- Password: `MYSQL_PASSWORD` (default empty)

Set environment variables before starting the backend if your MySQL credentials differ:
```powershell
$env:MYSQL_USER = "root"
$env:MYSQL_PASSWORD = "your_mysql_password"
```

## Seeded Demo Accounts

On startup, `DataSeeder` creates demo accounts and sample health coaches/applications if the tables are empty:

| Role | Email | Password |
| --- | --- | --- |
| `ADMIN` | `admin@test.com` | `admin123` |
| `REVIEWER` | `reviewer@test.com` | `reviewer123` |
| `APPLICANT` | `applicant@test.com` | `applicant123` |

## API & Swagger Docs

- Swagger UI: `http://localhost:7980/swagger-ui.html`
- OpenAPI JSON: `http://localhost:7980/v3/api-docs`
- Health Check: `GET http://localhost:7980/api/health`
