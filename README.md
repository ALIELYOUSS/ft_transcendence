# WeMeet User Management

This document describes the user-management work currently set up in the WeMeet project. It covers the Next.js authentication screens, the NestJS authentication API, PostgreSQL/Prisma persistence, and the current implementation status.

## Architecture

```mermaid
flowchart LR
	Browser[Next.js frontend\nlocalhost:3000] -->|POST /auth/register\nPOST /auth/login| API[NestJS API\nlocalhost:3001]
	Browser -->|GET /auth/google| API
	API -->|OAuth redirect| Google[Google OAuth]
	Google -->|GET /auth/google/callback| API
	API -->|redirect with tokens| Callback[Next.js Google callback]
	Callback -->|store accessToken + refreshToken| Browser
	API --> Auth[AuthService]
	Auth -->|Prisma Client| DB[(PostgreSQL\nlocalhost:5432)]
	Adminer[Adminer\nlocalhost:8080] --> DB
```

## Technology and services

| Area | Technology | Current setup |
| --- | --- | --- |
| Frontend | Next.js, React, TypeScript | Next.js 16.3.6, React 19.2.8 |
| Backend | NestJS, TypeScript | NestJS 12.0.1, TypeScript 6.0.2 |
| Persistence | PostgreSQL and Prisma | PostgreSQL 17-alpine, Prisma 7.10.0 |
| Authentication | bcrypt, JWT, Passport Google OAuth | Access token: 15 minutes; refresh token: 7 days |
| API documentation | Swagger | `http://localhost:3001/docs` |

## User-management flow

### Email registration

1. The signup page collects `username`, `email`, `password`, and at least one interest.
2. The frontend sends the data to `POST /auth/register`.
3. NestJS validates the DTO using the global `ValidationPipe`.
4. The password is hashed with bcrypt before it is stored.
5. Interests are created or reused with Prisma `connectOrCreate`.
6. The response excludes the password.

### Email login

1. The login page sends `email` and `password` to `POST /auth/login`.
2. The backend looks up the user and verifies the password with bcrypt.
3. The backend creates an access token and refresh token.
4. The refresh token is bcrypt-hashed and stored on the user record.
5. The frontend stores both returned tokens in `localStorage`.

### Google login and signup

1. The frontend links to `GET /auth/google`.
2. Passport redirects the user to Google with `email` and `profile` scopes.
3. The callback finds the user by Google ID or email, or creates a new user.
4. The API redirects to `/auth/google/callback` with the access and refresh tokens.
5. The callback page stores the tokens in `localStorage` and returns to the login page.

### Token refresh and logout

- `POST /auth/refresh` verifies the refresh JWT and compares it with the stored bcrypt hash before issuing new tokens.
- `POST /auth/logout` invalidates the stored refresh token.
- Access-token guards for protected routes are not set up yet.

## Current API endpoints

All endpoints are under the backend origin, currently `http://localhost:3001`.

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Create a user with interests |
| `POST` | `/auth/login` | Authenticate with email and password |
| `GET` | `/auth/google` | Start Google OAuth |
| `GET` | `/auth/google/callback` | Complete Google OAuth |
| `POST` | `/auth/refresh` | Rotate access and refresh tokens |
| `POST` | `/auth/logout` | Invalidate the refresh token |
| `GET` | `/auth/list` | List user IDs and emails |
| `GET` | `/auth/:id` | Read a user ID and email |
| `PATCH` | `/auth/:id` | Update user fields |
| `DELETE` | `/auth/:id` | Delete a user |

The CRUD routes are currently public. Authorization and role checks still need to be added before exposing them beyond local development.

## Data model

The main `User` model is defined in `backend/prisma/schema.prisma` and currently contains:

- Identity: UUID `id`, unique `username`, unique `email`.
- Profile data: optional `bio`, `avatarUrl`, latitude, and longitude.
- Authentication: bcrypt `password`, optional `googleId`, and hashed `refreshedToken`.
- Authorization: `role`, currently `USER` or `ADMIN`.
- Social data: interests, profile, friends, posts, comments, likes, slots, and group chats.
- Timestamps: `createdAt` and `updatedAt`.

The database already has Prisma migrations under `backend/prisma/migrations/`. Run Prisma generation and validation after changing the schema.

## Frontend routes and components

| Route | Purpose |
| --- | --- |
| `/auth/login` | Email/password login and Google login entry point |
| `/auth/signup` | User registration and interest selection |
| `/auth/google/callback` | Stores Google OAuth tokens in the browser |
| `/privacy` | Privacy page |
| `/terms` | Terms page |

The main auth UI is composed from `frontend/components/login`, `frontend/components/signup`, and `frontend/components/auth`.

## Environment variables

The backend requires a database URL and token secrets. Google login additionally requires:

```env
DATABASE_URL=postgresql://ali:555@localhost:5432/trans_db
ACCESS_TOKEN_SECRET=replace-with-a-long-secret
REFRESH_TOKEN_SECRET=replace-with-a-long-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

Do not commit real secrets. The frontend currently uses `http://localhost:3001` directly for auth requests and Google login.

## Running locally

Install dependencies once:

```bash
npm --prefix backend install
npm --prefix frontend install
```

Start PostgreSQL and Adminer:

```bash
make db-up
```

Generate Prisma Client, validate the schema, and apply a development migration when needed:

```bash
cd backend
npm run prisma:generate
npm run prisma:validate
npm run prisma:migrate
cd ..
```

Run the full development stack:

```bash
make dev
```

Or start services separately:

```bash
make backend-dev   # http://localhost:3001
make frontend-dev  # Next.js default: http://localhost:3000
```

Useful checks:

```bash
make backend-check
make frontend-check
make test
make lint
make build
```

## Implemented versus remaining

### Implemented

- Registration with DTO validation and bcrypt password hashing.
- Email/password login with password verification.
- Google OAuth login and automatic user creation/linking.
- JWT access and refresh token creation.
- Hashed refresh-token persistence, refresh, and logout invalidation.
- Frontend login and signup requests to the backend.
- Token storage in the browser after email or Google authentication.
- User CRUD service methods and Prisma relations for future features.
- Swagger API documentation and PostgreSQL Docker setup.

### Remaining work

- Add JWT authentication guards to protected routes.
- Add authorization rules for `USER` and `ADMIN` roles.
- Move frontend API URLs to environment configuration.
- Replace `localStorage` token storage with a production-safe cookie strategy where appropriate.
- Add user-facing login success/error states and redirect after successful email login.
- Add integration/e2e tests for registration, login, refresh, logout, and Google account linking.
- Avoid returning or exposing user-management CRUD operations without authorization.
