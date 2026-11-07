export function SignupPrompt() {
  return (
    <div className="flex items-center gap-2">
      <p className="text-[10px] text-black">Don&apos;t have an account?</p>
      <a
        href="/auth/signup"
        className="text-[10px] font-medium text-[var(--color-role-amber)] hover:underline"
      >
        Sign up
      </a>
    </div>
  );
}
