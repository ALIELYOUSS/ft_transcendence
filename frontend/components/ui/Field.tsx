import { ChevronDown } from "lucide-react"
import type { ReactNode } from "react"

export const inputClass =
  "w-full rounded-[10px] border border-line bg-field px-3 text-[13px] text-muted outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"

export function Field({ label, wide = false, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <label className={`flex min-w-0 flex-col gap-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-medium">{label}</span>
      {children}
    </label>
  )
}

type SelectProps = { label: string; options: readonly string[]; compact?: boolean }

// Uncontrolled select: the browser keeps the value. Add value/onChange later when you save to the API.
export function SelectField({ label, options, compact = false }: SelectProps) {
  const select = (
    <span className="relative flex items-center">
      <select
        aria-label={compact ? label : undefined}
        defaultValue={options[0]}
        className={`${inputClass} h-10 appearance-none pr-10 ${compact ? "bg-white text-ink" : ""}`}
      >
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-4 text-ink" aria-hidden />
    </span>
  )
  return compact ? select : <Field label={label}>{select}</Field>
}
