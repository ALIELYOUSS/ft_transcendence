# Authentication Security Audit and TODO

Audit scope: authentication, OAuth, token lifecycle, session storage, 2FA, and
application security controls in the current repository.

## 1. Current Security Posture

**Assessment: 4/10 - authentication foundation present, production security not
ready.**

The project has working Prisma persistence, local password hashing, JWT issue
and refresh logic, Google OAuth wiring, and basic validation. However, the
current implementation should not be exposed beyond development because
refresh tokens are exposed to URLs and `localStorage`, user administration
routes are unauthenticated, OAuth state verification is missing, CORS is
misconfigured, rate limiting and Helmet are absent, and 2FA is not implemented.
Development secrets also exist in `backend/.env` and must be rotated if they
were committed or shared.

## 2. Completed Items

### User entity and persistence

- [x] Email has a unique constraint in
      [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma), model
      `User`.
- [x] Google IDs are unique in the `User` model through `googleId @unique`.
- [x] Refresh tokens are stored as bcrypt hashes in the `refreshedToken` field
      by `AuthService.login()` and `AuthService.googleLogin()` in
      [`backend/src/auth/auth.service.ts`](backend/src/auth/auth.service.ts).

### Local authentication

- [x] Registration validates basic username, email, password, and interests
      types through `CreateAuthDto` in
      [`backend/src/auth/dto/create-auth.dto.ts`](backend/src/auth/dto/create-auth.dto.ts).
- [x] Passwords are hashed and compared with bcrypt in
      `AuthService.register()` and `AuthService.login()` in
      [`backend/src/auth/auth.service.ts`](backend/src/auth/auth.service.ts).
- [x] A global validation pipe uses `whitelist: true` in
      [`backend/src/main.ts`](backend/src/main.ts).

### OAuth and account linking

- [x] Google OAuth is wired through Passport using `GoogleStrategy` in
      [`backend/src/auth/google.strategy.ts`](backend/src/auth/google.strategy.ts).
- [x] The service performs basic find-by-Google-ID, find-by-email, link, or
      create behavior in `AuthService.googleLogin()` in
      [`backend/src/auth/auth.service.ts`](backend/src/auth/auth.service.ts).
- [x] The OAuth flow uses Google's authorization-code Passport strategy rather
      than accepting a client-supplied access token.

### JWT lifecycle

- [x] Access and refresh tokens are issued with separate secrets in
      `AuthService.generateTokens()`.
- [x] The configured lifetimes are short-lived access tokens (15 minutes) and
      longer refresh tokens (7 days) in
      [`backend/src/auth/auth.service.ts`](backend/src/auth/auth.service.ts).
- [x] Refresh tokens are hashed before database storage.
- [x] Successful refresh replaces the stored refresh-token hash in
      `AuthService.refreshTokens()`.
- [x] Logout invalidates the stored refresh-token hash in
      `AuthService.logout()`.

### Infrastructure

- [x] HTTPS termination and HTTP-to-HTTPS redirection are configured in
      [`nginx/default.conf`](nginx/default.conf).
- [x] PostgreSQL, backend, frontend, Nginx, and Adminer are defined in
      [`docker-compose.yml`](docker-compose.yml).

## 3. Missing or Pending Items

### Critical priority

- [ ] **Remove exposed secrets.** Rotate `ACCESS_TOKEN_SECRET`,
      `REFRESH_TOKEN_SECRET`, Google credentials, and database credentials from
      [`backend/.env`](backend/.env) and
      [`docker-compose.yml`](docker-compose.yml). Add safe `.env.example`
      files and verify secrets are not tracked or present in image layers.
- [ ] **Protect user administration routes.** Add JWT guards, ownership checks,
      and admin authorization to `GET /auth/list`, `GET /auth/:id`, `PATCH
    /auth/:id`, and `DELETE /auth/:id` in
      [`backend/src/auth/auth.controller.ts`](backend/src/auth/auth.controller.ts).
- [ ] **Stop returning sensitive fields.** `AuthService.update()` currently
      forwards broad DTO data and can return password and refresh-token data.
      Use explicit response projections and never return password, provider
      secrets, or refresh-token hashes.
- [ ] **Replace URL and `localStorage` token transport.** The OAuth callback in
      [`backend/src/auth/auth.controller.ts`](backend/src/auth/auth.controller.ts)
      sends tokens in query parameters, and
      [`frontend/app/auth/google/callback/page.tsx`](frontend/app/auth/google/callback/page.tsx)
      stores them in `localStorage`. Use secure cookie-based session handling.
- [ ] **Implement OAuth state verification.** Generate a cryptographically
      random state value, bind it to the browser session, verify it on callback,
      and reject missing or mismatched state values. The current
      [`backend/src/auth/google.strategy.ts`](backend/src/auth/google.strategy.ts)
      does not provide application-managed state validation.

### High priority

- [ ] **Use the requested user OAuth schema.** Make `password` nullable and add
      generic `provider` and `providerId` fields, or document and enforce a
      deliberate provider-specific model. Add a migration and update the
      find-or-create service logic.
- [ ] **Complete cookie-only token lifecycle.** Set refresh cookies on local
      login, Google login, and refresh with `HttpOnly`, `Secure`, explicit
      `SameSite`, and `Path=/api/auth`. Read cookies for refresh/logout, clear
      them on logout, and remove `RefreshTokenDto` body-token dependence.
- [ ] **Add refresh-token reuse detection.** Track a token family or session ID,
      detect reuse of a revoked token, revoke the token family/all sessions,
      and record a security event.
- [ ] **Add rate limiting.** Install and configure `@nestjs/throttler` or an
      equivalent control for login, registration, refresh, logout, and OAuth
      initiation/callback endpoints.
- [ ] **Enable strict CORS.** Replace `origin: '*'` with the configured HTTPS
      frontend origin while keeping `credentials: true` in
      [`backend/src/main.ts`](backend/src/main.ts).
- [ ] **Enable Helmet.** Install `helmet` and call `app.use(helmet())` during
      bootstrap in [`backend/src/main.ts`](backend/src/main.ts). Add any
      complementary security headers at the Nginx boundary.
- [ ] **Reject unknown DTO properties.** Set
      `forbidNonWhitelisted: true` on the global `ValidationPipe` in
      [`backend/src/main.ts`](backend/src/main.ts).
- [ ] **Add strict authentication DTOs.** Create a login DTO and add explicit
      type, length, format, and password constraints. Replace the broad
      `UpdateAuthDto` inheritance in
      [`backend/src/auth/dto/update-auth.dto.ts`](backend/src/auth/dto/update-auth.dto.ts)
      with an allowlist of editable fields.
- [ ] **Verify Google identity.** Require a verified provider email before
      linking by email in `GoogleStrategy` and `AuthService.googleLogin()`.
- [ ] **Add JWT strategy and guards.** Implement an access-token strategy,
      `AccessTokenGuard`, current-user decorator, ownership checks, and role
      guard before adding social or messaging endpoints.

### Medium priority

- [ ] **Increase and configure bcrypt work factor.** Replace hard-coded cost
      `10` in `AuthService` with a centrally configured value appropriate for
      deployment, or migrate to Argon2id with documented parameters.
- [ ] **Implement 2FA/TOTP.** Add `isTwoFactorEnabled` and `twoFactorSecret`
      fields, setup and secret generation, QR-code enrollment, first-code
      activation, recovery handling, and disable flow.
- [ ] **Add 2FA login interception.** When enabled, issue only a short-lived
      temporary challenge token after password verification; issue normal
      session tokens only after the six-digit TOTP code is verified.
- [ ] **Add authentication tests.** Cover registration, duplicate accounts,
      login, invalid passwords, OAuth state, verified account linking, refresh
      rotation and reuse, cookie flags, logout, 2FA, guards, ownership, and
      admin access.
- [ ] **Add frontend session handling.** Process email-login responses, show
      errors, refresh expired access tokens, support logout, and protect
      authenticated pages.
- [ ] **Add operational controls.** Add structured security logging, account
      lockout or progressive delays, session revocation visibility, and a
      documented migration/rollback procedure.

## 4. Requirement Matrix

| Requirement               | Status | Evidence or gap                                          |
| ------------------------- | ------ | -------------------------------------------------------- |
| Unique email              | `[x]`  | `User.email @unique` in `schema.prisma`                  |
| Nullable password         | `[ ]`  | Password is currently required                           |
| `provider` / `providerId` | `[ ]`  | Only `googleId` exists                                   |
| Hashed refresh token      | `[x]`  | bcrypt hash stored by `AuthService`                      |
| 2FA fields                | `[ ]`  | No TOTP fields exist                                     |
| Strict DTO validation     | `[ ]`  | Basic validation only; login is inline; no forbid flag   |
| Password work factor      | `[ ]`  | bcrypt exists, but cost `10` is hard-coded               |
| Login/register throttling | `[ ]`  | No throttler or equivalent found                         |
| Authorization Code OAuth  | `[x]`  | Passport Google authorization-code flow                  |
| OAuth state verification  | `[ ]`  | No application-managed state validation                  |
| Find-or-create linking    | `[x]`  | `AuthService.googleLogin()`                              |
| Short access token        | `[x]`  | 15-minute expiry                                         |
| Long refresh token        | `[x]`  | 7-day expiry                                             |
| Refresh rotation          | `[x]`  | Hash replaced on successful refresh                      |
| Reuse detection           | `[ ]`  | Old token rejection exists, family invalidation does not |
| Secure cookie storage     | `[ ]`  | Cookie is partial; URL and `localStorage` remain         |
| 2FA setup and activation  | `[ ]`  | Not implemented                                          |
| 2FA login interception    | `[ ]`  | Not implemented                                          |
| Logout DB invalidation    | `[x]`  | Stored hash is nulled                                    |
| Logout cookie clearing    | `[ ]`  | No cookie clear response                                 |
| Helmet                    | `[ ]`  | Not installed or enabled                                 |
| Strict CORS               | `[ ]`  | Wildcard origin with credentials                         |
| `whitelist` validation    | `[x]`  | Enabled in `main.ts`                                     |
| `forbidNonWhitelisted`    | `[ ]`  | Not enabled                                              |

## 5. Immediate Next Steps

1. Rotate all secrets and remove them from tracked files and Compose defaults.
2. Add a strict login DTO, safe update DTO, `forbidNonWhitelisted`, Helmet,
   explicit CORS, and throttling.
3. Add JWT authentication and authorization guards before touching frontend
   session behavior.
4. Change local and Google login to issue refresh cookies with `Path=/api/auth`,
   and remove tokens from callback URLs and `localStorage`.
5. Implement OAuth state generation and verification, then require verified
   Google email identities for linking.
6. Add refresh-token families and reuse detection, including global/session
   revocation on reuse.
7. Add the nullable-password/provider schema migration and update the service.
8. Implement TOTP setup, first-code activation, temporary login challenges,
   recovery, and logout/disable behavior.
9. Add backend and frontend tests for every completed security control.
10. Only after these checks pass, expose protected profile, social, activity,
    chat, and administrative features.
