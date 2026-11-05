export function LegalNotice() {
  return (
    <div className="absolute bottom-4 flex w-full flex-col items-center gap-1 text-center">
      <p className="text-[10px] text-black">
        By signing in, you agree to our{" "}
        <a
          href="/terms"
          className="text-[var(--color-role-amber)] hover:underline"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="/privacy"
          className="text-[var(--color-role-amber)] hover:underline"
        >
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
