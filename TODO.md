# Next Steps — ft_transcendence (branch `alel-you`)

Updated: 2026-11-09. This is the only todo file; `AUTH_TODO.md` was merged in here.
Team-facing version: `docs/index.html` → Known issues and Roadmap.

---

## 0. Repo cleanup ✅ (done 2026-11-07, not committed yet)

- [x] Stopped tracking `backend/dist/` and `*.tsbuildinfo`, and added them to `.gitignore`
- [x] Deleted `backend/repomix-output.xml`, the create-next-app leftovers (`frontend/README.md`,
      `public/file.svg`, `public/globe.svg`) and `AUTH_TODO.md` (merged here)
- [x] Removed dead code: the unreachable `return true` in `guards.ts`, the commented boilerplate in
      `layout.tsx`, a dead import comment in `app.module.ts`, and the `left_panel` alias export
- [x] Removed the `console.log` that leaked the password hash in `AuthService.reg()`
- [x] Finished the password rule in `CreateAuthDto` (`@MinLength(8)`/`@MaxLength(20)`, with imports added)
- [x] Backend fails at startup with a clear message if a required env variable is missing (`checkEnv()` in `main.ts`)
- [x] `README.md` cut down to a short quick start that points to `docs/index.html`
- [x] `backend/.env.example` now holds placeholders only
- [ ] **You:** create new token secrets in `backend/.env`, and a new Google client secret if the old values
      were real. They are still in git history
- [x] **You:** commit the cleanup (the nginx cert rename is included)
- [ ] Decide on `frontend/public/email.png`: nothing uses it right now

## 1. Bugs and data leaks ✅ (done 2026-11-09, tested end to end through nginx)

- [x] **Login leaks the refresh-token hash.** `AuthService.login()` strips only `password`, so
      `refreshedToken` is still in the response. Return an explicit safe projection → `SAFE_USER_SELECT`
- [x] **`PATCH /auth/:id`**
  - [x] It returns the full user row (`password`, `refreshedToken`). Add a `select`
  - [x] `UpdateAuthDto` extends the full create DTO, so a `password` sent in the body is saved **as plain text**.
        Replace it with an allowlist DTO (`username`, `bio`, `avatarUrl`, `interests`) plus a separate change-password route → `PATCH /auth/:id/password`
  - [x] Decide whether users may change their `email` → **no for now**; revisit with email verification
- [x] `DELETE /auth/:id` returns the deleted row, hashes included. Return `204` or `{ id }`
- [x] Bad credentials return `409`. Return `401 UnauthorizedException` instead
- [x] Guards: return `403 ForbiddenException` (not 401) when a user is logged in but not allowed
- [x] Validate `:id` with `ParseUUIDPipe` (a non-UUID causes a 500)
- [x] Register: a duplicate **username** causes a 500. Check it like the email (409)
- [x] ~~Add `@nestjs/mapped-types` to `backend/package.json`~~ → no longer needed: the new `UpdateAuthDto` doesn't import it
- [x] Frontend: `Login` wraps `LoginCard` in a `<form>`, so there's a form inside a form. Make the outer one a `<div>`
- [x] Frontend: `SignupCard` uses `event.currentTarget` after `await`. Save `const form = event.currentTarget` first

## 2. Hardening `main.ts` (one sitting)

- [x] `LoginDto` (`@IsEmail`, `@IsString`) instead of the inline body type. No `@MinLength`, so the login route won't reveal the password rules
- [ ] `ValidationPipe`: add `forbidNonWhitelisted: true` and `transform: true`
- [x] CORS: replace `origin: '*'` with `process.env.FRONTEND_URL` (not committed yet)
- [ ] `helmet` → `app.use(helmet())`
- [ ] `@nestjs/throttler` on `login`, `register` and `refresh`
- [x] Enable `cookieParser()` (the package is installed but the line is commented out)

## 3. Cookie-based sessions ✅ (done 2026-11-09)

- [x] `setRefreshCookie(res, token)`: `httpOnly`, `secure`, `sameSite: 'strict'`, `path: '/api/auth'`, 7d
- [x] Set it on **local login** too (`@Res({ passthrough: true })`)
- [x] `refresh` and `logout` read `req.cookies.refreshToken`. Delete `RefreshTokenDto`
- [x] Logout calls `res.clearCookie('refreshToken', { path: '/api/auth' })`
- [x] Google callback: no tokens in the URL. Set the cookie and redirect, and the frontend then calls `/refresh`
- [x] Frontend callback page: remove `localStorage` and keep the access token in memory
- [x] `GET /auth/me` (JwtGuard) returns the current user
- [x] Found while testing: old refresh tokens still worked after rotation (bcrypt reads only 72 bytes,
      and every JWT for one user shares them). Now stored as SHA-256 plus a `jti` per token

## 4. OAuth correctness ✅ (done 2026-11-09)

- [x] Check the OAuth `state` value → own `oauth_state` cookie (`CookieStateStore`, SameSite=Lax, 10 min, one-time use)
- [x] Link by email only when Google marks the email as verified (`profile._json.email_verified`).
      Unverified emails can't link or create accounts (403); an already-linked Google id still works
- [x] Save `avatarUrl` from Google (on create, and on link only if the user has no avatar yet)
- [x] Callback errors redirect to `/auth/login?error=google_failed|google_email_unverified` instead of a JSON page
- [ ] **You:** Google says the client secret in `backend/.env` is invalid. Put a valid one there, then test a real Google sign-in

## 5. Frontend auth flow

- [ ] `AuthProvider` context: `user`, `accessToken`, `login()`, `logout()`, `refresh()`
- [~] Fetch wrapper: `frontend/lib/auth.ts` has it for auth calls (`getMe()` refreshes once on a 401 and retries).
      Make it generic when other modules need the API
- [x] Login card: shows errors (including the Google `?error=` codes) and redirects to `/feed` (was `/profile`)
- [x] Sign-up: registers, logs in and redirects to `/feed`. Google callback also redirects to `/feed`
- [x] `/profile` page to check auth end to end (user data, token expiry, refresh and logout buttons)
- [ ] Protected-route wrapper for pages that need a login (`/profile` does it by hand: no user → `/auth/login`)
- [ ] `next.config.ts` `rewrites()` for `/api/*`, so `npm run dev` works without nginx

## 6. Tests

- [ ] e2e (supertest): register → login → `/me` → refresh → logout → refresh fails
- [ ] Guards: a user can't touch another user; an admin can
- [ ] Neither `password` nor `refreshedToken` appears in **any** response

## 7. Security, part 2

- [ ] Refresh-token reuse detection (one-time use works now; still missing: revoking everything when an old token is replayed): token family or session table; replaying an old token revokes the family
- [ ] 2FA / TOTP: `isTwoFactorEnabled` and `twoFactorSecret` fields, QR enrollment, activation on the first
      code, recovery codes, a disable flow
- [ ] 2FA login: after the password check, issue only a short-lived challenge token; issue real tokens after the TOTP code
- [ ] Make the bcrypt cost configurable (it's hard-coded `10` today) or switch to Argon2id
- [ ] Move DB credentials out of `docker-compose.yml` and the backend `Dockerfile` into a root `.env`

## 8. Features

- [ ] Split `users` into a `UsersModule` so `/auth` only handles auth
- [ ] Profile: view/edit, avatar upload, interests
- [ ] Friends: request, accept or decline, block, list (`Friend` model)
- [ ] Slots/meetups: create, join, capacity, expiry (`Slot`, `SlotParticipant`)
- [ ] Group chat: WebSocket gateway with JWT on the handshake (`GroupChat`, `Message`)

## 9. Backend merge with `oumaima` (2026-11-10)

What was merged and why: [`MERGE_README.md`](MERGE_README.md). Already done and tested through nginx:
her posts/comments/likes/uploads modules, schema + 3 migrations, `/uploads` nginx route, 5 MB body limit,
`./data/uploads` volume.

### Ali (`alel-you`): auth, infra, glue

- [ ] **Commit the merge** (and the uncommitted auth work). Nothing is committed yet
- [ ] Tell Oumaima to branch from `origin/alel-you`, not her old `oumaima` branch (or her old auth comes back)
- [ ] Export an `apiFetch(path, init)` from `frontend/lib/auth.ts`: adds `Bearer <accessToken>`, on `401` calls
      `refresh()` once and retries, works with `FormData` (no forced `Content-Type`). The feed needs it (see her F2)
- [ ] `next.config.ts` `rewrites()`: `/api/*` and `/uploads/*` → `http://localhost:3001`, so `npm run dev` works
      with the relative URLs (same as section 5)
- [ ] Protect `/feed`: no session (`getMe()` returns `null`) → `/auth/login`
- [ ] Decide whether `/profile` (the auth test page) stays or goes now that login lands on `/feed`
- [ ] `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })`, which also gives her DTOs real types (section 2)
- [ ] `@nestjs/throttler` on `POST /uploads/*` as well as login/register/refresh (section 2)
- [ ] Admin moderation: allow `ADMIN` to delete any post/comment (reuse `AdminGuard` / role check in her services)
- [ ] Back up `./data/uploads` together with the database (it is root-owned and gitignored)
- [ ] `docs/index.html` was deleted in `1f6431f`: bring it back with a posts/uploads section, or drop the rule below

### Oumaima: posts, comments, likes, uploads, feed UI

**Frontend: the feed can't reach the backend right now**
- [ ] **F1** `NEXT_PUBLIC_API_URL` is not set anywhere, so ``fetch(`${API_URL}/posts`)`` → `undefined/posts` → 404.
      Use relative URLs: `fetch('/api/posts')`, and `<img src={imageUrl}>` (the backend already returns `/uploads/...`)
- [ ] **F2** `localStorage.getItem('accessToken')` is always `null`: auth keeps the token in memory on purpose.
      Use Ali's `apiFetch()` from `@/lib/auth` for every authenticated call (likes, comments, create post, upload)
- [ ] **F3** `discover_people.tsx` still uses `fake_people`

**Backend bugs**
- [ ] **B1** Non-UUID ids crash with **500** (verified: `GET /api/posts/abc/comments`). Add `ParseUUIDPipe` to
      `:id` and `:postId` in posts, comments and likes
- [ ] **B2** Comments read `@Body('content')` with no DTO: no max length, and `{"content": 123}` → `.trim()` crashes (500).
      Add a `CreateCommentDto` (`@IsString() @IsNotEmpty() @MaxLength(…)`)
- [ ] **B3** `imageUrl` on a post accepts any string (another user's file, an external URL). Send the `fileId` from the
      upload instead, check `ownerId === user` and `purpose === 'POST'`, and build the URL on the server
- [ ] **B4** Deleting a post leaves the image on disk and its `UploadedFile` row. Delete both
      (and decide what happens to files uploaded but never used in a post)
- [ ] **B5** `UpdatePostDto` uses `@nestjs/mapped-types`, which isn't in `package.json` (it only works because
      `@nestjs/swagger` pulls it in). Use `PartialType` from `@nestjs/swagger` or add the package
- [ ] **B6** Each controller redefines `AuthenticatedRequest`. Import it from `auth/Guards/guards.ts` instead

**Backend: missing pieces**
- [ ] `GET /posts`: pagination (`?cursor=&limit=`) and `likedByMe` per post, so the feed doesn't make one
      `GET /likes` request per post
- [ ] Edit / delete your own comment
- [ ] Endpoints for the tables you already created: hide, save, report a post (`HiddenPost`, `SavedPost`, `PostReport`)
      and filter hidden posts out of `GET /posts`
- [ ] Avatar upload: also set `user.avatarUrl` (or document that the frontend calls `PATCH /api/auth/:id` after it)
- [ ] Chat attachments: a guarded download route (members of the chat only). Today they're saved but unreachable
- [ ] e2e tests: post CRUD + ownership (403), like twice = one like, comment on a missing post (404), upload with a fake extension (400)

> After each feature: update `docs/index.html` (section + Known issues + Roadmap + Changelog).
