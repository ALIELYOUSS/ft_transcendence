"use client"

import { Info } from "lucide-react"
import { useState } from "react"
import { PreferenceRow } from "@/components/settings/PreferenceRow"
import { SettingsCard } from "@/components/settings/SettingsCard"
import { Switch } from "@/components/ui/Switch"

const rows = [
  { key: "slots", title: "Meet Slot updates", description: "Requests, confirmations, and reminders for your upcoming meetups." },
  { key: "messages", title: "Messages & circle activity", description: "New conversations, replies, and updates from your circles." },
  { key: "weekly", title: "Weekly inspiration", description: "A weekly email with new people, circles, and Meet Slots to explore." },
] as const

type Key = (typeof rows)[number]["key"]

export default function NotificationSettings() {
  const [prefs, setPrefs] = useState<Record<Key, boolean>>({ slots: true, messages: true, weekly: false })

  return (
    <SettingsCard section="notifications">
      <div>
        {rows.map(({ key, title, description }) => (
          <PreferenceRow key={key} title={title} description={description}>
            <Switch label={title} checked={prefs[key]} onChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))} />
          </PreferenceRow>
        ))}
      </div>
      <p className="mt-5 flex items-center gap-2 rounded-[10px] bg-tint p-3 text-xs text-muted">
        <Info className="size-4 shrink-0 text-gold" aria-hidden /> We’ll always email you important account and security updates.
      </p>
    </SettingsCard>
  )
}
