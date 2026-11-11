"use client"

import { ArrowUpRight, CircleHelp, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { buttonStyles } from "@/components/ui/Button"
import { useToast } from "@/components/ui/Toast"
import { SETTINGS_SECTIONS } from "@/lib/settings"

export function SettingsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const notify = useToast()
  const current = SETTINGS_SECTIONS.find((s) => pathname.startsWith(`/settings/${s.slug}`)) ?? SETTINGS_SECTIONS[0]

  return (
    <>
      <section className="flex items-center justify-between gap-5">
        <div>
          <h1 className="text-[28px] font-semibold">{current.label}</h1>
          <p className="mt-2 text-sm text-muted">{current.description}</p>
        </div>
        <Link href="/profile" className={buttonStyles("outline")}>
          <ArrowUpRight className="size-4" aria-hidden />
          <span className="hidden sm:inline">View profile</span>
        </Link>
      </section>

      <div className="grid items-start gap-7 lg:grid-cols-[216px_minmax(0,1fr)]">
        <aside className="flex flex-col gap-6">
          <nav aria-label="Settings">
            <p className="mb-1.5 text-[10px] font-semibold text-subtle">YOUR PREFERENCES</p>
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
              {SETTINGS_SECTIONS.map(({ slug, label, icon: Icon }) => {
                const active = slug === current.slug
                return (
                  <Link
                    key={slug}
                    href={`/settings/${slug}`}
                    aria-current={active ? "page" : undefined}
                    className={`flex h-11 items-center gap-3 rounded-[10px] px-3 text-[13px] ${active ? "bg-active font-semibold text-ink" : "text-muted hover:bg-white/60"}`}
                  >
                    <Icon className={`size-4.5 ${active ? "text-gold" : ""}`} aria-hidden />
                    <span className="min-w-0 flex-1 truncate">{label}</span>
                    {active && <span className="size-1.5 rounded-full bg-brand" />}
                  </Link>
                )
              })}
            </div>
          </nav>

          <div className="hidden rounded-2xl bg-tint p-4 lg:block">
            <CircleHelp className="size-4.5 text-gold" aria-hidden />
            <h2 className="mt-3 text-[13px] font-semibold">A little help?</h2>
            <p className="mt-3 text-xs leading-5 text-muted">Our team is here to help you feel at home on WeMeet.</p>
            <button type="button" onClick={() => notify("Connecting you with support")} className="mt-3 flex items-center gap-1 text-xs font-semibold text-gold">
              Contact support <ArrowUpRight className="size-3.5" aria-hidden />
            </button>
          </div>

          {/* TODO: call your auth logout endpoint here */}
          <button type="button" onClick={() => notify("Signed out")} className="hidden items-center gap-2.5 px-3 text-[13px] text-muted lg:flex">
            <LogOut className="size-4.5" aria-hidden /> Sign out
          </button>
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </>
  )
}
