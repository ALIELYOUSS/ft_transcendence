import { LegalNotice } from "@/components/login/legal_notice";
import { SignupPrompt } from "@/components/login/signup_prompt";    

export function LoginCard() {
  return (
    <div className="flex h-[598px] w-[390px] flex-col items-center rounded-xl border-2 border-[#E8E4D8] px-8 pt-10">
            <img
                src="/logo.png"
                alt="WeMeet logo"
                width={80}
                height={82}
                className="h-[82px] w-[80px] object-contain "/>

            <h2 className="mt-5 text-center text-2xl font-semibold text-black">
                Welcome back to We<span className="text-[var(--color-role-amber)]">Meet</span>
            </h2>

            <p className="mt-2 text-center text-sm text-black/70">
                Please enter your details to sign in to your account.
            </p>

        <div className="mt-7 flex h-11 w-full items-center justify-center rounded-lg border border-[#E8E4D8] bg-white text-sm font-medium text-black hover:bg-[#d8d3c5]">
            <button
                type="button"
                className="flex items-center">
                Continue with Google
                <div className="ml-2 flex h-[20px] w-[20px] items-center justify-center rounded-full">
                    <img
                        src="/google_logo.png"
                        alt="Google logo"
                        width={20}
                        height={20}
                        className="h-[20px] w-[20px] object-contain"/>
                </div>
            </button>
        </div>

        <div className="my-5 flex w-full items-center gap-3 text-xs text-white/60">
            <span className="h-px flex-1 bg-[#E8E4D8]/45" />
            <span className="text-black">or</span>
            <span className="h-px flex-1 bg-[#E8E4D8]/45" />
        </div>

        <div className="flex w-full flex-col gap-4">
            <label className="flex flex-col gap-2 text-xs text-black/70">
                Email
                <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="email@example.com"
                className="h-11 rounded-lg border border-[#E8E4D8]/70 bg-[#E8E4D8] px-3 text-sm outline-none placeholder:text-black/40 focus:border-[#E8E4D8]"/>
            </label>

            <label className="flex flex-col gap-2 text-xs text-black/70">
            Password
            <input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="h-11 rounded-lg border border-[#E8E4D8]/70 bg-[#E8E4D8] px-3 text-sm  outline-none placeholder:text-black/40 focus:border-[#E8E4D8]"
            />
            </label>
            
        </div>


        <button
            type="submit"
            className="mt-6 h-11 w-full rounded-lg border border-[#E8E4D8] bg-white text-sm font-semibold text-black hover:bg-[#d8d3c5]">
            Sign in
        </button>

    </div>
  );
}
