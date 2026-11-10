/*
 * Every call to the auth API goes through this file (backend: backend/src/auth/README.md).
 *
 * - The access token is kept in memory only, never in localStorage, so injected scripts
 *   can't read it from storage. A page reload loses it; getMe() then gets a new one.
 * - The refresh token is an httpOnly cookie: JavaScript never sees it, the browser sends it
 *   to /api/auth/* by itself.
 */

export type User = {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  interests: { name: string }[];
};

let accessToken: string | null = null;

// fetch wrapper: JSON in and out, and turns API errors into an Error with a readable message.
async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/auth${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = Array.isArray(data.message) ? data.message[0] : data.message;
    throw new Error(message || 'Something went wrong');
  }
  return data as T;
}

export function register(body: {
  username: string;
  email: string;
  password: string;
  interests: string[];
}) {
  return api<User>('/register', { method: 'POST', body: JSON.stringify(body) });
}

export async function login(email: string, password: string) {
  const data = await api<{ user: User; accessToken: string }>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  accessToken = data.accessToken;
  return data.user;
}

/** Uses the refresh cookie to get a new access token. Returns false if not logged in. */
export async function refresh() {
  try {
    accessToken = (await api<{ accessToken: string }>('/refresh', { method: 'POST' })).accessToken;
    return true;
  } catch {
    accessToken = null;
    return false;
  }
}

export async function logout() {
  try {
    await api('/logout', { method: 'POST' });
  } finally {
    accessToken = null;
  }
}

/** The logged-in user, or null. Refreshes the access token when it's missing or expired. */
export async function getMe(): Promise<User | null> {
  if (!accessToken && !(await refresh())) {
    return null;
  }
  const fetchMe = () => api<User>('/me', { headers: { Authorization: `Bearer ${accessToken}` } });
  try {
    return await fetchMe();
  } catch {
    // Most likely the 15-minute access token expired: refresh once and retry.
    return (await refresh()) ? fetchMe().catch(() => null) : null;
  }
}

/** When the current access token expires (read from the JWT), or null. */
export function accessTokenExpiry(): Date | null {
  if (!accessToken) return null;
  try {
    const base64 = accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return new Date(JSON.parse(atob(base64)).exp * 1000);
  } catch {
    return null;
  }
}

// Error codes the backend puts in /auth/login?error=... after a failed Google sign-in.
export const GOOGLE_ERRORS: Record<string, string> = {
  google_failed: 'Google sign-in failed. Please try again.',
  google_email_unverified: 'Your Google email address is not verified.',
};
