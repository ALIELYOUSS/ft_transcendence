export function SignupPrompt() {
  return (
    <p className="text-center text-xs text-black/55">
      Already have an account?{" "}
      <a
        href="/auth/login"
        className="font-medium text-[var(--color-role-amber)] underline underline-offset-2 hover:text-black focus:outline-none focus:ring-2 focus:ring-[#f8b50e]"
      >
        Sign in
      </a>
    </p>
  );
}
