export function SignupPrompt() {
  return (
    <div className="flex items-center gap-3">
      <p className="text-sm text-black">Don&apos;t have an account?</p>
      <a
        href="/auth/signup"
        className="text-sm font-medium text-[var(--color-role-amber)] hover:underline"
      >
        Sign up
      </a>
    </div>
  );
}
