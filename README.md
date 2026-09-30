# wemeet technology versions

This file records the technology versions agreed for the wemeet project.

## Applications

| Area | Technology | Version |
| --- | --- | --- |
| Frontend | Next.js | 16.3.6 |
| Frontend runtime | React | 19.2.8 |
| Frontend language | TypeScript | 5.x |
| Backend framework | NestJS | 12.0.1 |
| Backend language | TypeScript | 6.0.2 |
| Database ORM | Prisma | 7.10.0 |
| API documentation | `@nestjs/swagger` | 12.0.2 |
| API documentation UI | `swagger-ui-express` | 5.0.1 |

## Infrastructure

| Tool | Version |
| --- | --- |
| Node.js | 20 LTS |
| npm | Comes with Node.js 20 LTS |
| PostgreSQL Docker image | 17-alpine |
| Adminer Docker image | 4 |
| Docker Compose | Current Docker Compose version |

## Local service ports

| Service | Port |
| --- | ---: |
| Next.js frontend | 3002 |
| NestJS backend | 3000 |
| PostgreSQL | 5433 |
| Adminer | 8080 |

## Backend setup notes

- Prisma schema: `backend/prisma/schema.prisma`
- Prisma environment template: `backend/.env.example`
- Swagger UI: `http://localhost:3000/docs`
- Prisma client generation: `npm run prisma:generate`
- Prisma schema validation: `npm run prisma:validate`
- Prisma development migration: `npm run prisma:migrate`