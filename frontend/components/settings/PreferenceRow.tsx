import type { ReactNode } from "react"

export function PreferenceRow({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-5 border-b border-line py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium">{title}</p>
        <p className="mt-1 text-xs text-muted">{description}</p>
      </div>
      {children}
    </div>
  )
}
