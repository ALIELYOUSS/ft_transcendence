'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { type User, accessTokenExpiry, getMe, logout, refresh } from '@/lib/auth';

// Simple page to check that auth works end to end: if you can see your data here, login,
// the refresh cookie and the protected /me route all work.
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);

  useEffect(() => {
    getMe().then(me => {
      if (!me) {
        router.replace('/auth/login');
        return;
      }
      setUser(me);
      setExpiresAt(accessTokenExpiry());
    });
  }, [router]);

  async function handleRefresh() {
    if (await refresh()) {
      setExpiresAt(accessTokenExpiry());
      setRefreshedAt(new Date());
    } else {
      router.replace('/auth/login');
    }
  }

  async function handleLogout() {
    await logout();
    router.replace('/auth/login');
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fdfcf9] text-sm text-black/60">
        Loading your profile...
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fdfcf9] px-4 py-10 text-black">
      <div className="w-full max-w-md rounded-xl border-2 border-[#E8E4D8] bg-white p-8 shadow-sm">
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f8b50e] text-2xl font-semibold">
              {user.username[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="truncate text-xl font-semibold">{user.username}</h1>
            <p className="truncate text-sm text-black/60">{user.email}</p>
          </div>
          {user.role === 'ADMIN' && (
            <span className="ml-auto rounded-full bg-[#f8b50e]/20 px-2 py-1 text-xs font-medium">
              Admin
            </span>
          )}
        </div>

        <dl className="mt-6 space-y-3 text-sm">
          <Row label="Bio">{user.bio || <span className="text-black/40">No bio yet</span>}</Row>
          <Row label="Interests">
            {user.interests.length ? (
              <div className="flex flex-wrap justify-end gap-1">
                {user.interests.map(i => (
                  <span key={i.name} className="rounded-full bg-[#E8E4D8] px-2 py-0.5 text-xs">
                    {i.name}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-black/40">None</span>
            )}
          </Row>
          <Row label="Member since">{new Date(user.createdAt).toLocaleDateString()}</Row>
        </dl>

        {/* Session details: handy to see the token refresh working. */}
        <div className="mt-6 rounded-lg bg-[#fdfcf9] p-4 text-xs text-black/70">
          <p className="font-medium text-green-700">● Signed in</p>
          <p className="mt-1">Access token expires at {expiresAt?.toLocaleTimeString() ?? '?'}</p>
          {refreshedAt && <p>Refreshed at {refreshedAt.toLocaleTimeString()}</p>}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleRefresh}
            className="h-11 flex-1 rounded-lg border border-[#E8E4D8] text-sm font-medium transition hover:bg-[#f3f0e8]"
          >
            Refresh session
          </button>
          <button
            onClick={handleLogout}
            className="h-11 flex-1 rounded-lg border border-[#f8b50e] bg-linear-to-r from-[#f8b50e] to-[#ffd66b] text-sm font-semibold transition hover:brightness-105"
          >
            Log out
          </button>
        </div>
      </div>
    </main>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#E8E4D8] pb-3">
      <dt className="text-black/60">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}
