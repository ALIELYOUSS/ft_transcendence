import { LegalNotice } from "./legal_notice";
import { LeftPanel } from "./left_panel";
import { LoginCard } from "./login_card";
import { SignupPrompt } from "./signup_prompt";

export function Login() {
  return (
    <main className="flex min-h-screen w-screen flex-col bg-[var(--color-role-base)] text-[var(--color-role-white)] md:flex-row">
      <LeftPanel />
      <form className="relative flex min-h-screen w-full min-w-0 flex-1 flex-col items-center justify-center gap-6 overflow-hidden bg-[#fdfcf9] px-8 text-[var(--color-role-black)] md:min-h-0">
        {/* <div className="relative z-10 flex w-full flex-col items-center gap-6"> */}
        <LoginCard />
      </form>
    </main>
  );
}