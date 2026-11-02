# Authentication and Infrastructure TODO

This checklist tracks the work required to complete authentication, authorization,
and deployment infrastructure.

## 1. Finish Authentication

- [ ] Fix and verify the complete email login flow through `https://localhost`.
- [ ] Store the access token after login and Google OAuth callback.
- [ ] Add automatic access-token refresh when the API returns `401`.
- [ ] Add a frontend session utility for the current user and logout.
- [ ] Protect authenticated frontend pages with a session guard.
- [ ] Move refresh tokens from URL parameters and `localStorage` to secure,
      HTTP-only, `Secure`, `SameSite` cookies.
- [ ] Keep access tokens short-lived and rotate refresh tokens on every refresh.
- [ ] Return consistent authentication errors without exposing sensitive details.
- [ ] Verify Google Cloud uses the exact redirect URI:
      `https://localhost/api/auth/google/callback`.
- [ ] Fix and test Google account linking and new-user creation.

## 2. Implement Authorization

- [ ] Add a JWT Passport strategy for access tokens.
- [ ] Add an `AccessTokenGuard`.
- [ ] Add a `CurrentUser` decorator for the authenticated request user.
- [ ] Protect all user CRUD routes in `AuthController`.
- [ ] Allow users to read and update only their own account.
- [ ] Prevent users from changing protected fields such as `role`, `password`,
      `googleId`, and `refreshedToken` through general update endpoints.
- [ ] Add a roles decorator and `RolesGuard`.
- [ ] Restrict administrator-only operations to the `ADMIN` role.
- [ ] Add authorization checks to every future post, friend, activity, and chat
      endpoint before exposing those features.

## 3. Add Authentication Tests

- [ ] Test valid and invalid registration.
- [ ] Test duplicate email and duplicate username handling.
- [ ] Test valid login and wrong-password rejection.
- [ ] Test access-token expiration and refresh-token rotation.
- [ ] Test logout invalidates the refresh token.
- [ ] Test Google existing-user linking and new-user creation.
- [ ] Test protected routes without a token.
- [ ] Test users cannot access or modify another user's data.
- [ ] Test admin-only routes for both `USER` and `ADMIN` roles.
- [ ] Add frontend tests for login, logout, callback, and protected-page flow.

## 4. Harden Infrastructure

- [x] Containerize the frontend and backend.
- [x] Run PostgreSQL, Adminer, frontend, backend, and Nginx with Compose.
- [x] Add HTTPS termination and HTTP-to-HTTPS redirection in Nginx.
- [x] Route `/api/auth/*` through Nginx to the NestJS auth controller.
- [x] Route `/` to the frontend login page.
- [ ] Add Docker healthchecks for backend and frontend.
- [ ] Make Nginx wait for healthy frontend and backend services.
- [ ] Remove direct public ports for backend and frontend in production; expose
      only Nginx publicly.
- [ ] Move database credentials and application secrets out of Compose YAML.
- [ ] Use strong production secrets and rotate any credentials used during
      development before deployment.
- [ ] Use a trusted certificate and real domain in production instead of the
      self-signed local certificate.
- [ ] Add persistent, tested database backup and restore procedures.
- [ ] Pin image versions and document the supported Node, PostgreSQL, and Nginx
      versions.
- [ ] Add resource limits and restart policies suitable for deployment.
- [ ] Add structured logs and basic service monitoring.

## 5. Deployment Checklist

- [ ] Create separate development and production Compose configurations.
- [ ] Add a production `.env.example` with all required variables and no secrets.
- [ ] Document first-time setup, migrations, rollback, and shutdown commands.
- [ ] Run Prisma migrations as an explicit deployment step.
- [ ] Add a CI pipeline for linting, typechecking, tests, Docker builds, and
      Compose configuration validation.
- [ ] Add a deployment health check for HTTPS, frontend, backend, and database.
- [ ] Configure the production domain, DNS, TLS renewal, and Google OAuth URLs.
- [ ] Verify that no secrets, certificates, database files, or generated build
      output are committed.

## Recommended Order

1. Finish email and Google authentication end to end.
2. Add JWT guards and ownership checks.
3. Add role-based authorization.
4. Add backend and frontend authentication tests.
5. Harden cookies, secrets, CORS, and OAuth callback handling.
6. Harden Compose and Nginx for production.
7. Add CI, backups, monitoring, and deployment documentation.

The project should not expose social, messaging, or administrative features
until the authorization and ownership checks are implemented.
