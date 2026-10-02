type InputProps = {
  id: string;
  label: string;
  type?: "text" | "email";
  placeholder?: string;
  autoComplete?: string;
  icon?: "user" | "mail";
};

export function Input({ id, label, type = "text", placeholder, autoComplete, icon }: InputProps) {
  return (
    <label htmlFor={id} className="flex flex-col gap-2 text-xs text-black/70">
      {label}
      <span className="relative">
        {icon && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/45">{icon === "user" ? "●" : "✉"}</span>}
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`h-11 w-full rounded-lg border border-[#E8E4D8]/70 bg-[#E8E4D8] px-3 text-sm text-black outline-none placeholder:text-black/40 focus:border-[#f8b50e] focus:ring-2 focus:ring-[#f8b50e]/30 ${icon ? "pl-9" : ""}`}
        />
      </span>
    </label>
  );
}
