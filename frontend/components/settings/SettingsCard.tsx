import type { ReactNode } from "react"
import { getSection, type SectionSlug } from "@/lib/settings"

export function SettingsCard({ section, badge, children }: { section: SectionSlug; badge?: ReactNode; children: ReactNode }) {
  const { label, description, icon: Icon } = getSection(section)
  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_2px_5px_rgba(0,0,0,0.03)] sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-[11px] bg-tint text-gold">
          <Icon className="size-4.5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold">{label}</h2>
          <p className="mt-1 text-xs text-muted">{description}</p>
        </div>
        {badge}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  )
}
