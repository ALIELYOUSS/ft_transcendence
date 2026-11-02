# WeMeet Project Documentation

## 1. Project overview

WeMeet is a social platform designed to help users create profiles, discover
people with shared interests, create activities, and communicate in group
chats. The current implementation establishes the application foundation:

- a Next.js frontend;
- a NestJS backend API;
- PostgreSQL persistence through Prisma;
- user registration and login;
- Google OAuth login;
- JWT access and refresh tokens;
- user, interest, social, activity, and chat data models.

The project is currently at the stage where the authentication foundation is
mostly present, but protected application pages and authorization still need
to be completed before the rest of the platform can safely use user data.

### Current progress for teammates

The authentication foundation is implemented. Users can register with an
email, log in with a password, use Google OAuth, refresh their JWT tokens, and
log out. Passwords are hashed with bcrypt, refresh tokens are stored as hashes
in the database, and Prisma connects the NestJS API to PostgreSQL.

The project now runs through Docker Compose. Nginx is the public entry point:
it serves HTTPS, sends `/api/*` requests to NestJS, and sends all other
requests to Next.js. The local certificate is self-signed and is intended for
development only.

## 2. Overall architecture

```mermaid
flowchart LR
    Browser["Browser<br/>https://localhost"]
    Nginx["Nginx reverse proxy<br/>:80 / :443"]
    Frontend["Next.js frontend<br/>:3000"]
    API["NestJS API<br/>:3001"]
    DB[("PostgreSQL<br/>:5432")]
    Adminer["Adminer<br/>:8080"]
    Google["Google OAuth"]

    Browser -->|"HTTPS pages"| Nginx
    Nginx -->|"Browser pages"| Frontend
    Nginx -->|"/api/*"| API
    API -->|"Prisma"| DB
    Adminer --> DB
    API -->|"OAuth redirect"| Google
    Google -->|"OAuth callback"| API
    API -->|"Redirect to frontend"| Nginx
```

### Main responsibilities

| Layer         | Location                                                       | Responsibility                                    |
| ------------- | -------------------------------------------------------------- | ------------------------------------------------- |
| Frontend      | [`frontend/`](frontend/)                                       | Pages, forms, API requests, and session handling  |
| Backend       | [`backend/src/`](backend/src/)                                 | API routes, validation, authentication, OAuth     |
| Database      | [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma) | Users and application data                        |
| Reverse proxy | [`nginx/default.conf`](nginx/default.conf)                     | HTTPS termination and routing                     |
| Runtime       | [`docker-compose.yml`](docker-compose.yml)                     | Nginx, frontend, backend, PostgreSQL, and Adminer |
| Documentation | [`README.md`](README.md)                                       | Quick project overview and setup                  |

## 3. Technology stack

### Frontend

- Next.js `16.3.6`
- React `19.2.8`
- TypeScript
- Tailwind CSS
- Next.js App Router

The frontend contains authentication routes under
[`frontend/app/auth/`](frontend/app/auth/):

- `/auth/login`
- `/auth/signup`
- `/auth/google/callback`

### Backend

- JSON Web Tokens
- bcrypt
- class-validator
- Swagger

The backend starts on port `3001` by default. The bootstrap configuration is
in [`backend/src/main.ts`](backend/src/main.ts).

### Database

- PostgreSQL `17-alpine`
- Prisma `7`
- Adminer for browser-based database inspection

The database container is configured in
[`docker-compose.yml`](docker-compose.yml). Prisma migrations are stored
under [`backend/prisma/migrations/`](backend/prisma/migrations/).

## 4. Backend structure

```mermaid
flowchart TD
    Main["main.ts"]
    App["AppModule"]
    AuthModule["AuthModule"]
    AuthController["AuthController"]
    AuthService["AuthService"]
    GoogleStrategy["GoogleStrategy"]
    PrismaModule["PrismaModule"]
    PrismaService["PrismaService"]
    Database[("PostgreSQL")]

    Main --> App
    App --> AuthModule
    App --> PrismaModule
    AuthModule --> AuthController
    AuthModule --> AuthService
    AuthModule --> GoogleStrategy
    AuthModule --> PrismaModule
    PrismaModule --> PrismaService
    AuthService --> PrismaService
    PrismaService --> Database
```

### Application bootstrap

[`backend/src/main.ts`](backend/src/main.ts) performs the following work:

1. Creates the NestJS application.
2. Enables Swagger at `/docs`.
3. Enables a global `ValidationPipe` with `whitelist: true`.
4. Enables CORS for frontend-to-backend requests.
5. Listens on `PORT`, or `3001` when `PORT` is not defined.

### Authentication module

[`backend/src/auth/auth.module.ts`](backend/src/auth/auth.module.ts)
registers:

- `AuthController`;
- `AuthService`;
- `GoogleStrategy`;
- `ConfigModule`;
- `PrismaModule`.

Google configuration is loaded by
[`backend/src/auth/google-oauth.config.ts`](backend/src/auth/google-oauth.config.ts).

The authentication request path is:

```mermaid
flowchart LR
    Form["Login or signup form"] -->|"/api/auth/*"| Proxy["Nginx"]
    Proxy -->|"/auth/*"| Controller["AuthController"]
    Controller --> Service["AuthService"]
    Service --> Hash["bcrypt / JWT"]
    Service --> Prisma["PrismaService"]
    Prisma --> DB[("PostgreSQL")]
    Google["Google OAuth"] --> Strategy["GoogleStrategy"]
    Strategy --> Service
```

The `/api` prefix belongs to the public proxy URL. Nginx removes that prefix
before forwarding the request, so NestJS continues to handle routes such as
`/auth/login` and `/auth/google/callback`.

### Request lifecycle: top to bottom

The following graph shows what happens to an authentication request from the
browser until the response returns to the user:

```mermaid
flowchart TD
    Start["User submits login/signup<br/>or clicks Google login"]
    HTTPS["Browser sends HTTPS request<br/>https://localhost/api/auth/..."]
    Proxy["Nginx :443<br/>terminates TLS"]
    Rewrite["Nginx rewrites the path<br/>/api/auth/login -> /auth/login"]
    Controller["NestJS AuthController<br/>matches the route"]
    Validate["Validation and authentication<br/>DTO checks, bcrypt, or GoogleStrategy"]
    Service["AuthService<br/>login, registration, or OAuth account linking"]
    Database["PrismaService<br/>reads or writes PostgreSQL"]
    Tokens["Create or rotate JWT tokens<br/>hash refresh token in database"]
    Response["NestJS returns JSON or redirects<br/>to /auth/google/callback"]
    Frontend["Next.js receives the response<br/>session handling is incomplete"]
    Google["Google OAuth consent<br/>and callback"]

    Start --> HTTPS
    HTTPS --> Proxy
    Proxy --> Rewrite
    Rewrite --> Controller
    Controller --> Validate
    Validate --> Service
    Service --> Database
    Database --> Tokens
    Tokens --> Response
    Response --> Frontend
    Validate -. "Google login branch" .-> Google
    Google --> Service
```

## 5. Authentication implementation

### 5.1 Email registration

The registration form is implemented in
[`frontend/components/signup/signup_card.tsx`](frontend/components/signup/signup_card.tsx).
It sends a request to `POST /auth/register` containing:

```json
{
  "username": "example-user",
  "email": "user@example.com",
  "password": "password",
  "interests": ["sport", "music"]
}
```

The backend validates the request with
[`create-auth.dto.ts`](backend/src/auth/dto/create-auth.dto.ts):

- `username` must be a non-empty string;
- `email` must be a valid email;
- `password` must be a non-empty string;
- at least one interest is required.

The service then:

1. checks whether the email already exists;
2. hashes the password with bcrypt;
3. creates or reuses interests with Prisma `connectOrCreate`;
4. creates the user;
5. removes the password from the returned response.

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant API
    participant Database

    User->>Frontend: Fill registration form
    Frontend->>API: POST /auth/register
    API->>API: Validate DTO
    API->>Database: Check email
    API->>API: Hash password with bcrypt
    API->>Database: Create user and connect interests
    Database-->>API: New user
    API-->>Frontend: User data without password
    Frontend-->>User: Show success or error
```

### 5.2 Email login

The login UI is in
[`frontend/components/login/login_card.tsx`](frontend/components/login/login_card.tsx).
The backend login logic is in
[`backend/src/auth/auth.service.ts`](backend/src/auth/auth.service.ts).

The intended flow is:

1. frontend submits email and password;
2. backend finds the user;
3. bcrypt compares the submitted password with the stored hash;
4. backend creates an access token and refresh token;
5. backend stores a bcrypt hash of the refresh token;
6. the backend returns the tokens, but the email login UI does not yet create a
   usable frontend session from that response.

The access token expires after 15 minutes. The refresh token expires after
7 days.

### 5.3 Google OAuth

The Google button is implemented in
[`frontend/components/auth/google-button.tsx`](frontend/components/auth/google-button.tsx).
It starts the flow with `GET /auth/google`.

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant API
    participant Google
    participant Database

    User->>Frontend: Click Google login
    Frontend->>API: GET /auth/google
    API->>Google: Redirect for consent
    Google-->>API: GET /auth/google/callback
    API->>API: GoogleStrategy validates profile
    API->>Database: Find by googleId or email
    alt Existing user
        API->>Database: Link googleId
    else New user
        API->>Database: Create user
    end
    API->>API: Create JWT tokens
    API-->>Frontend: Redirect with tokens
    Frontend->>Frontend: Save tokens
```

The callback page is
[`frontend/app/auth/google/callback/page.tsx`](frontend/app/auth/google/callback/page.tsx).
It reads `accessToken` and `refreshToken` from the callback URL, stores them in
`localStorage`, and redirects to the login page.

### 5.4 Refresh tokens

The refresh endpoint is `POST /auth/refresh`.

The backend:

1. verifies the refresh JWT using `REFRESH_TOKEN_SECRET`;
2. loads the user from the token subject;
3. compares the supplied token with the stored bcrypt hash;
4. creates a new access token and refresh token;
5. replaces the stored refresh-token hash.

The refresh token is therefore rotated when it is successfully used.

### 5.5 Logout

The logout endpoint is `POST /auth/logout`.

The backend verifies the refresh token, finds the user, and sets the stored
`refreshedToken` value to `null`. Future refresh attempts with that token then
fail.

## 6. Current API endpoints

Through the supported Docker workflow, browser requests use the HTTPS origin
and `/api` prefix, for example `https://localhost/api/auth/login`. Nginx
removes `/api` before forwarding the request to the backend. Direct backend
requests use `http://localhost:3001/auth/...` and bypass Nginx.

| Method   | Endpoint                | Current purpose                  | Current protection |
| -------- | ----------------------- | -------------------------------- | ------------------ |
| `POST`   | `/auth/register`        | Register with email and password | Public             |
| `POST`   | `/auth/login`           | Login with email and password    | Public             |
| `GET`    | `/auth/google`          | Start Google OAuth               | Public             |
| `GET`    | `/auth/google/callback` | Complete Google OAuth            | Passport           |
| `POST`   | `/auth/refresh`         | Rotate JWT tokens                | Token required     |
| `POST`   | `/auth/logout`          | Invalidate refresh token         | Token required     |
| `GET`    | `/auth/list`            | List user IDs and emails         | Currently public   |
| `GET`    | `/auth/:id`             | Read a user ID and email         | Currently public   |
| `PATCH`  | `/auth/:id`             | Update user fields               | Currently public   |
| `DELETE` | `/auth/:id`             | Delete a user                    | Currently public   |

Swagger documentation is available directly at `http://localhost:3001/docs`.
It is not currently routed by Nginx at `https://localhost/api/docs`.

## 7. Database model

The current schema is defined in
[`backend/prisma/schema.prisma`](backend/prisma/schema.prisma).

```mermaid
erDiagram
    USER ||--o{ INTEREST : has
    USER ||--o| PROFILE : owns
    USER ||--o{ FRIEND : sends
    USER ||--o{ POST : writes
    USER ||--o{ COMMENT : writes
    USER ||--o{ LIKE : creates
    USER ||--o{ SLOT : hosts
    USER ||--o{ SLOT_PARTICIPANT : joins
    USER ||--o{ MESSAGE : sends
    USER ||--o{ GROUP_CHAT_PARTICIPANT : joins
    SLOT ||--o{ SLOT_PARTICIPANT : contains
    SLOT ||--o| GROUP_CHAT : creates
    GROUP_CHAT ||--o{ MESSAGE : contains
    GROUP_CHAT ||--o{ GROUP_CHAT_PARTICIPANT : contains
    POST ||--o{ COMMENT : has
    POST ||--o{ LIKE : has

    USER {
        uuid id PK
        string username UK
        string email UK
        string password
        string googleId UK
        enum role
        string refreshedToken
    }
    INTEREST {
        uuid id PK
        string name UK
    }
    PROFILE {
        uuid id PK
        uuid userId UK
    }
    FRIEND {
        uuid id PK
        uuid userId
        uuid friendId
        enum status
    }
    SLOT {
        uuid id PK
        uuid hostId
        string title
        string location
        int capacityTarget
        enum status
    }
```

### User fields

- identity: `id`, `username`, `email`;
- profile: `bio`, `avatarUrl`, `latitude`, `longitude`;
- authentication: `password`, `googleId`, `refreshedToken`;
- authorization: `role`;
- timestamps: `createdAt`, `updatedAt`.

The available roles are `USER` and `ADMIN`. The roles exist in the schema, but
role-based authorization has not yet been wired into the controller.

## 8. Frontend work completed

The authentication interface is split into reusable components:

```text
frontend/
├── app/auth/login/page.tsx
├── app/auth/signup/page.tsx
├── app/auth/google/callback/page.tsx
├── components/auth/
│   ├── google-button.tsx
│   ├── input.tsx
│   ├── password-input.tsx
│   └── primary-button.tsx
├── components/login/
│   ├── left_panel.tsx
│   ├── login.tsx
│   ├── login_card.tsx
│   └── signup_prompt.tsx
└── components/signup/
    ├── interest-picker.tsx
    ├── signup-fields.tsx
    ├── signup_card.tsx
    └── signup.tsx
```

The signup interface currently provides:

- username, email, and password fields;
- interest selection;
- Google signup;
- backend error display;
- success display after registration.

The login interface currently provides:

- email and password fields;
- Google login;
- links toward signup and legal pages.

## 9. Configuration and local development

The backend expects environment variables similar to:

```env
DATABASE_URL=postgresql://ali:555@localhost:5432/trans_db
ACCESS_TOKEN_SECRET=replace-with-a-long-secret
REFRESH_TOKEN_SECRET=replace-with-a-long-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://localhost/api/auth/google/callback
FRONTEND_URL=https://localhost
```

Never commit real secrets.

### Start the database

```bash
docker compose up -d db adminer
```

PostgreSQL is available on port `5432`. Adminer is available at
`http://localhost:8080`.

### Install dependencies

```bash
./scripts/install.sh
```

This script installs the locked backend and frontend dependencies, including
the existing NestJS, Passport, Google OAuth, JWT, bcrypt, Prisma, and frontend
packages. It then generates and validates Prisma Client. Future modules such
as profile or additional authentication features can be added to the normal
package manifests and installed by running the same script again.

### Prepare Prisma

```bash
cd backend
npm run prisma:generate
npm run prisma:validate
npm run prisma:migrate
```

### Start the supported local workflow

The supported browser workflow is Docker Compose with Nginx in front of the
frontend and backend:

```bash
docker compose up --build
```

Then open `https://localhost`. Because the local certificate is self-signed,
the browser will display a development certificate warning.

### Start the applications directly

The direct workflow is useful for backend development, but it does not provide
the Nginx `/api` proxy. Frontend requests to `/api/auth/*` therefore require a
Next.js rewrite or a matching API base URL before this workflow can support
browser authentication end to end.

In separate terminals:

```bash
cd backend
npm run start:dev
```

```bash
cd frontend
npm run dev
```

Then open:

- frontend: `http://localhost:3000`;
- backend Swagger: `http://localhost:3001/docs`;
- Adminer: `http://localhost:8080`.

## 10. Current progress assessment

| Area                         | Status                 | Explanation                                                   |
| ---------------------------- | ---------------------- | ------------------------------------------------------------- |
| Frontend auth screens        | Partially complete     | Login, signup, OAuth button, and callback exist               |
| Registration API             | Implemented            | DTO validation, bcrypt hashing, interests                     |
| Email login API              | Implemented            | Password verification and JWT creation                        |
| Google OAuth                 | Implemented foundation | Strategy and callback exist                                   |
| Refresh/logout               | Implemented foundation | Hashed refresh tokens and invalidation exist                  |
| Database schema              | Broad foundation       | User, social, activity, and chat models exist                 |
| API documentation            | Available directly     | Swagger is available on the backend, but not proxied by Nginx |
| Protected routes             | Not complete           | CRUD endpoints are still public                               |
| Roles and permissions        | Not complete           | `USER` and `ADMIN` exist only in the schema                   |
| Authenticated frontend pages | Not complete           | No finished dashboard/session guard is present                |
| Automated auth tests         | Not complete           | Registration, login, refresh, logout, and OAuth need coverage |

The project is therefore ready for the next authentication hardening phase,
but authentication should be completed before exposing social and messaging
features.

## 11. Existing problems

The following issues are present in the current implementation and should be
resolved before social, activity, or chat features are exposed:

1. The email login UI sends the request but does not process the response,
   store a usable session, show an error, or redirect after success.
2. The Google callback places access and refresh tokens in the URL and in
   `localStorage`, exposing credentials to browser history and JavaScript.
3. Refresh and logout require a JSON refresh token even though the backend also
   creates a cookie. Cookie parsing is not enabled consistently.
4. User CRUD routes are public. There is no JWT access-token guard, ownership
   check, or admin authorization, and the update DTO permits fields that should
   not be generally editable.
5. CORS is configured with `origin: '*'` and credentials enabled, which is not
   a valid credentialed browser configuration.
6. The direct `npm run dev` workflow has no `/api` rewrite, while the frontend
   uses relative `/api/auth/*` requests. Docker/Nginx is currently the only
   documented end-to-end browser workflow.
7. Nginx does not proxy Swagger, and Compose exposes the backend and frontend
   ports directly in addition to the public Nginx ports.
8. Database credentials and application secrets are configured in development
   files. They must be externalized, and any exposed credentials must be
   rotated before deployment.
9. Backend startup does not automatically run Prisma migrations. Migration
   execution must remain an explicit, documented deployment step.
10. Authentication has no complete automated test coverage for login, OAuth,
    refresh rotation, logout, protected routes, ownership, or roles.

## 12. Next implementation plan

### Phase 1: Complete the existing authentication flow

1. Handle login responses, errors, loading state, and successful redirect.
2. Add a shared frontend API/session utility and a protected page guard.
3. Use HTTP-only, `Secure`, `SameSite` refresh cookies and remove refresh
   tokens from URLs and `localStorage`.
4. Update refresh and logout to read and clear the cookie consistently.
5. Verify the Google redirect URI and test existing-user linking and new-user
   creation.

### Phase 2: Protect the backend

1. Add a JWT strategy, access-token guard, and current-user decorator.
2. Protect all user CRUD routes and enforce ownership checks.
3. Replace the general update DTO with a whitelist of editable fields.
4. Add roles metadata and an admin guard for administrator-only operations.
5. Configure CORS for the actual frontend origin and credential policy.

### Phase 3: Make the development and deployment workflows reliable

1. Add a documented Next.js `/api` rewrite, or explicitly support only the
   Docker/Nginx workflow for browser authentication.
2. Add frontend and backend healthchecks and make Nginx wait for healthy
   services.
3. Externalize database credentials and secrets through `.env.example` files.
4. Decide whether Swagger should be proxied and configure the route if it is.
5. Remove direct frontend/backend ports from production and document Prisma
   migration, rollback, and shutdown procedures.

### Phase 4: Add tests before feature expansion

1. Cover registration, duplicate users, login, wrong passwords, refresh
   rotation, logout, and Google account linking.
2. Cover unauthenticated access, ownership violations, and admin permissions.
3. Add frontend tests for login, logout, OAuth callback, and protected pages.
4. Add CI checks for linting, typechecking, tests, Docker builds, and Compose
   configuration.

### Phase 5: Build the product features

1. Create an authentication utility for token access.
2. Add automatic access-token refresh on `401` responses.
3. Add logout that clears local session data.
4. Add protected-page handling.
5. Add a user profile/dashboard page.

## 13. Short conclusion

The project already contains the important first layer of WeMeet:
architecture, database models, authentication APIs, OAuth integration, and
frontend authentication screens. The next major milestone is not adding more
screens; it is making the existing authentication secure and complete:

> fix the current login/OAuth issues, protect the backend routes, create a
> real authenticated frontend session, and add tests.
