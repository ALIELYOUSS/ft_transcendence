import type { ButtonHTMLAttributes } from "react"

type Variant = "outline" | "primary"

export function buttonStyles(variant: Variant = "outline", extra = "") {
  const look =
    variant === "primary"
      ? "border-[#f5aa18] bg-linear-to-r from-[#f9b233] to-[#f59e0b] text-brand-ink"
      : "border-line bg-white text-ink hover:bg-canvas"
  return `flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border px-4 text-[13px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${look} ${extra}`
}

export function Button({
  variant = "outline",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={buttonStyles(variant, className)} {...props} />
}
