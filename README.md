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

## 2. Overall architecture

```mermaid
flowchart LR
    Browser["Browser<br/>Next.js :3000"]
    API["NestJS API<br/>:3001"]
    DB[("PostgreSQL<br/>:5432")]
    Adminer["Adminer<br/>:8080"]
    Google["Google OAuth"]

    Browser -->|"HTTP / JSON"| API
    Browser -->|"OAuth start"| API
    API -->|"Prisma"| DB
    Adminer --> DB
    API -->|"OAuth redirect"| Google
    Google -->|"OAuth callback"| API
    API -->|"Redirect with tokens"| Browser
```

### Main responsibilities

| Layer | Location | Responsibility |
| --- | --- | --- |
| Frontend | [`frontend/`](../frontend/) | Pages, forms, user interaction, token storage |
| Backend | [`backend/src/`](../backend/src/) | API routes, validation, authentication, OAuth |
| Database | [`backend/prisma/schema.prisma`](../backend/prisma/schema.prisma) | Users and application data |
| Database runtime | [`docker-compose.yml`](../docker-compose.yml) | PostgreSQL and Adminer containers |
| Documentation | [`README.md`](../README.md) | Quick project overview and setup |

## 3. Technology stack

### Frontend

- Next.js `16.3.6`
- React `19.2.8`
- TypeScript
- Tailwind CSS
- Next.js App Router

The frontend contains authentication routes under
[`frontend/app/auth/`](../frontend/app/auth/):

- `/auth/login`
- `/auth/signup`
- `/auth/google/callback`

### Backend

- NestJS `12`
- TypeScript
- Passport
- Passport Google OAuth 2.0
- JSON Web Tokens
- bcrypt
- class-validator
- Swagger

The backend starts on port `3001` by default. The bootstrap configuration is
in [`backend/src/main.ts`](../backend/src/main.ts).

### Database

- PostgreSQL `17-alpine`
- Prisma `7`
- Adminer for browser-based database inspection

The database container is configured in
[`docker-compose.yml`](../docker-compose.yml). Prisma migrations are stored
under [`backend/prisma/migrations/`](../backend/prisma/migrations/).

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

[`backend/src/main.ts`](../backend/src/main.ts) performs the following work:

1. Creates the NestJS application.
2. Enables Swagger at `/docs`.
3. Enables a global `ValidationPipe` with `whitelist: true`.
4. Enables CORS for frontend-to-backend requests.
5. Listens on `PORT`, or `3001` when `PORT` is not defined.

### Authentication module

[`backend/src/auth/auth.module.ts`](../backend/src/auth/auth.module.ts)
registers:

- `AuthController`;
- `AuthService`;
- `GoogleStrategy`;
- `ConfigModule`;
- `PrismaModule`.

Google configuration is loaded by
[`backend/src/auth/google-oauth.config.ts`](../backend/src/auth/google-oauth.config.ts).

## 5. Authentication implementation

### 5.1 Email registration

The registration form is implemented in
[`frontend/components/signup/signup_card.tsx`](../frontend/components/signup/signup_card.tsx).
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
[`create-auth.dto.ts`](../backend/src/auth/dto/create-auth.dto.ts):

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
[`frontend/components/login/login_card.tsx`](../frontend/components/login/login_card.tsx).
The backend login logic is in
[`backend/src/auth/auth.service.ts`](../backend/src/auth/auth.service.ts).

The intended flow is:

1. frontend submits email and password;
2. backend finds the user;
3. bcrypt compares the submitted password with the stored hash;
4. backend creates an access token and refresh token;
5. backend stores a bcrypt hash of the refresh token;
6. frontend stores the returned tokens.

The access token expires after 15 minutes. The refresh token expires after
7 days.

### 5.3 Google OAuth

The Google button is implemented in
[`frontend/components/auth/google-button.tsx`](../frontend/components/auth/google-button.tsx).
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
[`frontend/app/auth/google/callback/page.tsx`](../frontend/app/auth/google/callback/page.tsx).
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

All routes are currently exposed under the backend origin:
`http://localhost:3001`.

| Method | Endpoint | Current purpose | Current protection |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Register with email and password | Public |
| `POST` | `/auth/login` | Login with email and password | Public |
| `GET` | `/auth/google` | Start Google OAuth | Public |
| `GET` | `/auth/google/callback` | Complete Google OAuth | Passport |
| `POST` | `/auth/refresh` | Rotate JWT tokens | Token required |
| `POST` | `/auth/logout` | Invalidate refresh token | Token required |
| `GET` | `/auth/list` | List user IDs and emails | Currently public |
| `GET` | `/auth/:id` | Read a user ID and email | Currently public |
| `PATCH` | `/auth/:id` | Update user fields | Currently public |
| `DELETE` | `/auth/:id` | Delete a user | Currently public |

Swagger documentation is available at:
`http://localhost:3001/docs`.

## 7. Database model

The current schema is defined in
[`backend/prisma/schema.prisma`](../backend/prisma/schema.prisma).

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

The signup interface already provides:

- username, email, and password fields;
- interest selection;
- Google signup;
- backend error display;
- success display after registration.

The login interface already provides:

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
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback
FRONTEND_URL=http://localhost:3000
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

### Start the applications

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

| Area | Status | Explanation |
| --- | --- | --- |
| Frontend auth screens | Mostly complete | Login, signup, OAuth button, and callback exist |
| Registration API | Implemented | DTO validation, bcrypt hashing, interests |
| Email login API | Implemented | Password verification and JWT creation |
| Google OAuth | Implemented foundation | Strategy and callback exist |
| Refresh/logout | Implemented foundation | Hashed refresh tokens and invalidation exist |
| Database schema | Broad foundation | User, social, activity, and chat models exist |
| API documentation | Available | Swagger is configured |
| Protected routes | Not complete | CRUD endpoints are still public |
| Roles and permissions | Not complete | `USER` and `ADMIN` exist only in the schema |
| Authenticated frontend pages | Not complete | No finished dashboard/session guard is present |
| Automated auth tests | Not complete | Registration, login, refresh, logout, and OAuth need coverage |

The project is therefore ready for the next authentication hardening phase,
but authentication should be completed before exposing social and messaging
features.

## 11. Known issues to resolve

These are important implementation details to fix next:

1. The login request in
   [`frontend/components/login/login_card.tsx`](../frontend/components/login/login_card.tsx)
   currently uses port `3000`, but the backend runs on port `3001`.
2. The login submit handler is attached to the button instead of the form.
   The form should own `onSubmit`, and the button should use
   `type="submit"`.
3. Google user creation in
   [`backend/src/auth/auth.service.ts`](../backend/src/auth/auth.service.ts)
   uses `intrests`, while the Prisma relation is named `interests`.
4. Access-token guards are not yet implemented for user CRUD routes.
5. The frontend uses hard-coded backend URLs instead of a frontend environment
   variable.
6. Tokens are stored in `localStorage`. This is acceptable for an early
   development prototype, but HTTP-only secure cookies are safer for
   production.
7. The OAuth callback places tokens in the URL query string. A production
   implementation should avoid exposing long-lived credentials in URLs.

## 12. Recommended next implementation plan

### Phase 1: Make the current flow reliable

1. Fix the login URL and form submission.
2. Fix the Google `interests` relation name.
3. Add visible login error and success states.
4. Redirect successful login to a real home/dashboard page.
5. Move the API URL to a frontend environment variable.

### Phase 2: Protect the backend

1. Add a JWT strategy for access tokens.
2. Add an access-token guard.
3. Add a request user type/decorator.
4. Protect `/auth/list`, `/auth/:id`, `PATCH`, and `DELETE`.
5. Restrict users to their own records.
6. Add an admin guard for administrator-only operations.

### Phase 3: Complete the frontend session

1. Create an authentication utility for token access.
2. Add automatic access-token refresh on `401` responses.
3. Add logout that clears local session data.
4. Add protected-page handling.
5. Add a user profile/dashboard page.

### Phase 4: Harden production security

1. Move refresh tokens to secure, HTTP-only cookies.
2. Configure strict CORS instead of `origin: '*'`.
3. Validate and rotate secrets through deployment configuration.
4. Avoid passing tokens in OAuth query parameters.
5. Add rate limiting and account lockout considerations.
6. Add audit logging for important authentication events.

### Phase 5: Add tests

The minimum useful authentication test matrix is:

| Test | Expected result |
| --- | --- |
| Valid registration | User is created without returning password |
| Duplicate email | Request is rejected |
| Invalid registration DTO | Validation error is returned |
| Valid login | Access and refresh tokens are returned |
| Wrong password | Authentication fails |
| Invalid refresh token | Refresh fails |
| Successful refresh | Tokens rotate |
| Logout | Stored refresh token is invalidated |
| Google existing email | Account is linked safely |
| Protected route without token | Request is rejected |
| User accessing another user | Request is rejected |
| Admin operation | Only an admin can perform it |

## 13. Short conclusion

The project already contains the important first layer of WeMeet:
architecture, database models, authentication APIs, OAuth integration, and
frontend authentication screens. The next major milestone is not adding more
screens; it is making the existing authentication secure and complete:

> fix the current login/OAuth issues, protect the backend routes, create a
> real authenticated frontend session, and add tests.
