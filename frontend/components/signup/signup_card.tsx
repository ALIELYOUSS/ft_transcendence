"use client";

import { FormEvent, useState } from "react";
import { GoogleButton } from "@/components/auth/google-button";
import { PrimaryButton } from "@/components/auth/primary-button";
import { InterestPicker } from "./interest-picker";
import { LegalNotice } from "./legal-notice";
import { SignupFields } from "./signup-fields";
import { SignupPrompt } from "./signup-prompt";

export function SignupCard() {
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const body = {
            username: formData.get("username"),
            email: formData.get("email"),
            password: formData.get("password"),
            interests: selectedInterests,
        };

        try {
            const response = await fetch("http://localhost:3001/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            setSuccess("Account created successfully");
            setError("");
            event.currentTarget.reset();
            setSelectedInterests([]);
        } catch (error) {
            setSuccess("");
            setError(error instanceof Error ? error.message : "Something went wrong");
        }
    }

    return (
        <div className="flex w-[590px] max-w-full flex-col items-center rounded-xl border-2 border-[#E8E4D8] bg-white/75 px-8 py-8 shadow-sm backdrop-blur-sm">
            <img src="/logo.png" alt="WeMeet logo" width={72} height={72} className="h-[72px] w-[72px] rounded-2xl object-contain" />
            <h2 className="mt-5 text-center text-2xl font-semibold text-black">
                Create your <span className="text-[var(--color-role-amber)]">WeMeet</span> account
            </h2>
            <p className="mt-2 text-center text-sm text-black/65">Start making meaningful connections.</p>

            <form onSubmit={handleSubmit} className="mt-7 flex w-full flex-col gap-4">
                <GoogleButton label="Sign up with Google" />
                <div className="flex items-center gap-3 text-xs text-black/50">
                    <span className="h-px flex-1 bg-[#E8E4D8]" />
                    <span>or sign up with</span>
                    <span className="h-px flex-1 bg-[#E8E4D8]" />
                </div>
                <SignupFields />
                <InterestPicker value={selectedInterests} onChange={setSelectedInterests} />
                <PrimaryButton>Create account <span aria-hidden="true">→</span></PrimaryButton>
                {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
                {success && <p className="text-sm text-green-700" role="status">{success}</p>}
        </form>

            <div className="mt-6 space-y-2">
                <SignupPrompt />
                <LegalNotice />
            </div>
        </div>
    );
}