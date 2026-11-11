"use client"

import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { PreferenceRow } from "@/components/settings/PreferenceRow"
import { SettingsCard } from "@/components/settings/SettingsCard"
import { SelectField } from "@/components/ui/Field"
import { Switch } from "@/components/ui/Switch"
import { useToast } from "@/components/ui/Toast"

const visibility = ["Everyone on WeMeet", "People I follow", "Only me"] as const

export default function PrivacySettings() {
  const notify = useToast()
  const [online, setOnline] = useState(true)
  const [discoverable, setDiscoverable] = useState(false)

  return (
    <SettingsCard section="privacy">
      <div>
        <PreferenceRow title="Profile visibility" description="Choose who can see your posts and profile details.">
          <SelectField compact label="Profile visibility" options={visibility} />
        </PreferenceRow>
        <PreferenceRow title="Show my online status" description="Let people know when you’re around for a conversation.">
          <Switch label="Show my online status" checked={online} onChange={setOnline} />
        </PreferenceRow>
        <PreferenceRow title="Discoverable by email" description="Allow people who have your email address to find you.">
          <Switch label="Discoverable by email" checked={discoverable} onChange={setDiscoverable} />
        </PreferenceRow>
      </div>
      <button type="button" onClick={() => notify("No blocked accounts")} className="mt-5 flex w-full items-center justify-between text-xs font-medium text-gold">
        Manage blocked accounts
        <span className="flex items-center gap-2 font-normal text-muted">0 accounts <ChevronRight className="size-4" aria-hidden /></span>
      </button>
    </SettingsCard>
  )
}
