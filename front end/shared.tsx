import { ReactNode } from "react"
import { Circle } from "lucide-react"

export const pageCopy = {
  Profile: "Introduce yourself to the people you'll meet.",
  Account: "Keep your contact details and local preferences up to date.",
  Notifications: "Stay in the loop, without the noise.",
  Privacy: "Meaningful connection starts with feeling comfortable.",
  Security: "A few simple steps to keep your account yours.",
} as const

export type Page = keyof typeof pageCopy

const sectionIcons: Record<Page, string> = {
  Profile: "9202c.svg",
  Account: "e3726.svg",
  Notifications: "5a362.svg",
  Privacy: "48d50.svg",
  Security: "6b06d.svg",
}

export function Icon({ file, alt = "" }: { file: string; alt?: string }) {
  return (
    <Circle
      aria-label={alt || file}
      aria-hidden={alt ? undefined : true}
      className="shrink-0 text-current"
      size={18}
      strokeWidth={1.8}
    />
  )
}

export function Card({
  page,
  children,
  extra,
}: {
  page: Page
  children: ReactNode
  extra?: ReactNode
}) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_2px_5px_rgba(0,0,0,0.03)] sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-[38px] shrink-0 items-center justify-center rounded-[11px] bg-[#f1f3ff]">
          <Icon file={sectionIcons[page]} />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-['Inter:Semi_Bold'] text-lg">{page}</h2>
          <p className="mt-1 font-['Inter:Regular'] text-xs leading-[18px] text-[#5c5e63]">
            {pageCopy[page]}
          </p>
        </div>
        {extra}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}

export function PreferenceList({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

export function Preference({
  title,
  copy,
  divider = false,
  children,
}: {
  title: string
  copy: string
  divider?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={`flex items-center gap-5 py-3 ${
        divider ? "border-b border-[#e9eaf1]" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="font-['Inter:Medium'] text-[13px]">{title}</p>
        <p className="mt-1 font-['Inter:Regular'] text-xs leading-[17px] text-[#5c5e63]">
          {copy}
        </p>
      </div>
      {children}
    </div>
  )
}

export function Switch({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: () => void
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={checked ? "Turn off" : "Turn on"}
      onClick={onChange}
    >
      <Icon file={checked ? "59a59.svg" : "b36bb.svg"} />
    </button>
  )
}

export function ActionButton({
  children,
  onClick,
}: {
  children: ReactNode
  onClick?: () => void
}) {
  return (
    <button
      className="flex h-10 shrink-0 items-center justify-center gap-[7px] rounded-xl border border-[#e9eaf1] bg-white px-4 font-['Inter:Semi_Bold'] text-[13px] text-[#141b2b]"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function Field({
  label,
  wide = false,
  children,
}: {
  label: string
  wide?: boolean
  children: ReactNode
}) {
  return (
    <label
      className={`flex min-w-0 flex-col gap-[7px] ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <span className="font-['Inter:Medium'] text-xs">{label}</span>
      <span className="profile-input">{children}</span>
    </label>
  )
}

export function SelectField({
  label,
  icon,
  children,
}: {
  label: string
  icon: string
  children: ReactNode
}) {
  return (
    <label className="flex min-w-0 flex-col gap-[7px]">
      <span className="font-['Inter:Medium'] text-xs">{label}</span>
      <span className="relative flex min-h-10 items-center rounded-[10px] border border-[#e9eaf1] bg-[#fcfcfe]">
        <select className="w-full appearance-none bg-transparent px-3 py-2.5 pr-10 text-[13px] text-[#5c5e63] outline-none">
          {children}
        </select>
        <span className="pointer-events-none absolute right-3">
          <Icon file={icon} />
        </span>
      </span>
    </label>
  )
}
