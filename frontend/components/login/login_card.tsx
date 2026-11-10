'use client';

import { GoogleButton } from '@/components/auth/google-button';
import { GOOGLE_ERRORS, login } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { LegalNotice } from './legal_notice';
import { SignupPrompt } from './signup_prompt';
import Image from 'next/image';

export function LoginCard() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // After a failed Google sign-in the backend sends us to /auth/login?error=<code>.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('error');
    if (code) setError(GOOGLE_ERRORS[code] ?? 'Sign-in failed. Please try again.');
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login(email, password);
      router.push('/feed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className="flex h-[620px] w-[390px] flex-col items-center rounded-xl border-2 border-[#E8E4D8] px-8 pt-10">
      <Image
        src="/logo.png"
        alt="WeMeet logo"
        width={80}
        height={82}
        className="h-[82px] w-[80px] object-contain "
      />

      <h2 className="mt-5 text-center text-2xl font-semibold text-black">
        Welcome back to We<span className="text-[var(--color-role-amber)]">Meet</span>
      </h2>

      <p className="mt-2 text-center text-sm text-black/70">
        Please enter your details to sign in to your account.
      </p>

      <div className="mt-7 w-full">
        <GoogleButton label="Continue with Google" />
      </div>

      <div className="my-5 flex w-full items-center gap-3 text-xs text-white/60">
        <span className="h-px flex-1 bg-[#E8E4D8]/45" />
        <span className="text-black">or</span>
        <span className="h-px flex-1 bg-[#E8E4D8]/45" />
      </div>

      <form onSubmit={handleLogin} className="flex w-full flex-col gap-4">
        <label className="flex flex-col gap-2 text-xs text-black/70">
          Email
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="email@example.com"
            className="h-11 rounded-lg border border-[#E8E4D8]/70 bg-[#E8E4D8] px-3 text-sm outline-none placeholder:text-black/40 focus:border-[#E8E4D8]"
          />
        </label>

        <label className="flex flex-col gap-2 text-xs text-black/70">
          Password
          <input
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Enter your password"
            className="h-11 rounded-lg border border-[#E8E4D8]/70 bg-[#E8E4D8] px-3 text-sm  outline-none placeholder:text-black/40 focus:border-[#E8E4D8]"
          />
        </label>
        <button
          type="submit"
          className="mt-6 h-11 w-full rounded-lg border border-[#f8b50e] bg-linear-to-r from-[#f8b50e] to-[#ffd66b] text-sm font-semibold text-black transition hover:brightness-105 focus:outline-none focus:ring-2 focus:ring-[#f8b50e] focus:ring-offset-2"
        >
          Sign in
        </button>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </form>

      <div className="mt-2">
        <SignupPrompt />
      </div>
      <LegalNotice />
    </div>
  );
}
