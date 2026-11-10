# Auth module

The browser calls every route as `/api/auth/...`. nginx strips `/api` before the request reaches Nest.

## Files

| File | What it does |
|---|---|
| `auth.controller.ts` | Routes only: reads the request, calls the service, sets or clears the cookie |
| `auth.service.ts` | Logic: register, login, Google login, refresh, logout, plus user CRUD |
| `tokens.ts` | Signs and verifies JWTs, hashes refresh tokens, sets and clears the refresh cookie |
| `safe-user.ts` | `SAFE_USER_SELECT` (the only user fields sent to clients) and Prisma error → 409/404 |
| `Guards/guards.ts` | `JwtGuard` (needs a Bearer token), `AdminGuard`, `OwnerOrAdminGuard` (return 403) |
| `dto/` | Request body validation (`whitelist: true` drops unknown fields) |
| `google/` | Google OAuth: config, strategy, `state` cookie (CSRF), and a callback guard that never throws |

## Tokens

| | Access token | Refresh token |
|---|---|---|
| Lifetime | 15 min | 7 days |
| Where it lives | Frontend memory (`frontend/lib/auth.ts`) | httpOnly cookie, `Path=/api/auth` |
| Sent as | `Authorization: Bearer <token>` | Automatically by the browser |
| In the database | – | SHA-256 hash in `User.refreshedToken`; a new one replaces the old on each refresh |

## Flows

**Email login:** `POST /login` → `{ user, accessToken }` and sets the refresh cookie → frontend goes to `/profile`.

**Sign-up:** `POST /register` → frontend then calls `POST /login` → `/profile`.

**Google sign-in:**
1. `GET /google`: sets the `oauth_state` cookie and redirects to Google.
2. Google redirects to `GET /google/callback`: checks `state`, then links or creates the user (only with a Google-verified email) and sets the refresh cookie.
3. Redirect to `/profile`. On any error, redirect to `/auth/login?error=google_failed` or `google_email_unverified` instead.

**Opening `/profile` (or any page after a reload):** there's no access token in memory, so the page calls `POST /refresh` (cookie) → new access token → `GET /me`.

**Logout:** `POST /logout` revokes the stored hash and clears the cookie.

## Routes

| Route | Guard | |
|---|---|---|
| `POST /register` · `POST /login` | – | |
| `POST /refresh` · `POST /logout` | refresh cookie | |
| `GET /google` · `GET /google/callback` | Google | |
| `GET /me` | JWT | current user |
| `GET /list` | JWT + admin | |
| `GET`/`PATCH`/`DELETE /:id` · `PATCH /:id/password` | JWT + owner or admin | `:id` must be a UUID |
