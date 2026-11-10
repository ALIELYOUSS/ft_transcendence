import { createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import type { CookieOptions, Response } from 'express';
const Jwt = require('jsonwebtoken');

/*
 * Everything about tokens in one place.
 *
 *  access token  : short-lived JWT (15 min), sent by the frontend as "Authorization: Bearer ..."
 *  refresh token : long-lived JWT (7 days), lives only in an httpOnly cookie; the database
 *                  stores its SHA-256 hash so it can be revoked (logout) and used only once.
 */

// ---- JWTs -------------------------------------------------------------------------------

export function signAccessToken(userId: string): string {
  return Jwt.sign({ sub: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(userId: string): string {
  // jti makes every refresh token unique, even two issued in the same second.
  return Jwt.sign({ sub: userId, jti: randomUUID() }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
  });
}

/** Returns the user id from a valid access token, or null. */
export function verifyAccessToken(token: string): string | null {
  return readUserId(token, process.env.ACCESS_TOKEN_SECRET);
}

/** Returns the user id from a valid refresh token, or null. */
export function verifyRefreshToken(token: string): string | null {
  return readUserId(token, process.env.REFRESH_TOKEN_SECRET);
}

function readUserId(token: string, secret: string | undefined): string | null {
  try {
    const payload = Jwt.verify(token, secret) as { sub?: unknown };
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}

// ---- Refresh-token hashing -------------------------------------------------------------
// SHA-256, not bcrypt: bcrypt only reads the first 72 bytes, and all JWTs of one user share
// those bytes, so with bcrypt any old refresh token would still match.

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function refreshTokenMatches(token: string, storedHash: string): boolean {
  const expected = Buffer.from(storedHash);
  const actual = Buffer.from(hashRefreshToken(token));
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

// ---- Refresh cookie --------------------------------------------------------------------
// The browser sees the API under /api/auth (nginx strips /api before Nest), so the cookie
// is only sent to the auth routes.

export const REFRESH_COOKIE = 'refreshToken';

const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/api/auth',
};

export function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, { ...REFRESH_COOKIE_OPTIONS, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE, REFRESH_COOKIE_OPTIONS);
}
