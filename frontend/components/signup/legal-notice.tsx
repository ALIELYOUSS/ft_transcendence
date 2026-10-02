export function LegalNotice() {
  return (
    <p className="text-center text-xs text-black/55">
      By signing up, you agree to our{" "}
      <a
        href="/terms"
        className=" text-[var(--color-role-amber)] underline hover:text-black">
        Terms of Service
      </a>{" "}
      and{" "}
      <a
        href="/privacy"
        className=" text-[var(--color-role-amber)] underline hover:text-black">
        Privacy Policy
      </a>
      .
    </p>
  );
}
