import { left_panel as LeftPanel } from "@/components/login/left_panel";
import { SignupCard } from "@/components/signup/signup_card";

export function SignupPage() {
    return (
        <main className="flex min-h-screen w-screen flex-col bg-[var(--color-role-base)] text-[var(--color-role-white)] md:flex-row">
            <LeftPanel />
              <div className="relative flex min-h-screen w-full min-w-0 flex-1 flex-col items-center justify-center gap-6 overflow-hidden bg-[#fdfcf9] px-8 text-[var(--color-role-black)] md:min-h-0">
                 <SignupCard />
              </div>
        </main>
    );
}