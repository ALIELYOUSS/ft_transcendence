"use client";

import { useState } from "react";

type PasswordInputProps = {
  id: string;
  placeholder?: string;
};

export function PasswordInput({ id, placeholder }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <label htmlFor={id} className="flex flex-col gap-2 text-xs text-black/70">
      Password
      <span className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete="new-password"
          className="h-11 w-full rounded-lg border border-[#E8E4D8]/70 bg-[#E8E4D8] px-3 pr-14 text-sm text-black outline-none placeholder:text-black/40 focus:border-[#f8b50e] focus:ring-2 focus:ring-[#f8b50e]/30"
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs text-black/60 focus:outline-none focus:ring-2 focus:ring-[#f8b50e]"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </span>
    </label>
  );
}
