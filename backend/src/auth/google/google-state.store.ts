import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { CookieOptions, Request } from 'express';
import type { StateStore } from 'passport-oauth2';

/*
 * CSRF protection for Google sign-in, without a server session.
 *
 *  store():  /api/auth/google          -> random `state` saved in a cookie and sent to Google
 *  verify(): /api/auth/google/callback -> the `state` Google sends back must match the cookie
 *
 * SameSite must be 'lax': Google returns the browser with a cross-site GET, and a 'strict'
 * cookie would not be sent on it. Each method takes exactly 3 parameters on purpose:
 * passport-oauth2 picks how to call it from the number of parameters.
 */

const STATE_COOKIE = 'oauth_state';
const STATE_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/api/auth/google',
};

const googleStateStore = {
  store(req: Request, _meta: unknown, done: (err: Error | null, state?: string) => void) {
    const state = randomBytes(32).toString('hex');
    req.res!.cookie(STATE_COOKIE, state, { ...STATE_COOKIE_OPTIONS, maxAge: 10 * 60 * 1000 });
    done(null, state);
  },

  verify(req: Request, state: string, done: (err: Error | null, ok: boolean, info?: unknown) => void) {
    const expected: string | undefined = req.cookies?.[STATE_COOKIE];
    req.res!.clearCookie(STATE_COOKIE, STATE_COOKIE_OPTIONS); // one-time use

    const ok =
      typeof expected === 'string' &&
      typeof state === 'string' &&
      expected.length === state.length &&
      timingSafeEqual(Buffer.from(expected), Buffer.from(state));

    done(null, ok, ok ? state : { message: 'Invalid OAuth state' });
  },
};

// The library's type lists several call signatures; ours is the 3-parameter one.
export const cookieStateStore = googleStateStore as unknown as StateStore;
