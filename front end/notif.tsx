import { useState } from "react"
import { Card, Icon, Preference, PreferenceList, Switch } from "./shared"

export default function NotificationsPage() {
  const [preferences, setPreferences] = useState([true, true, false])
  const rows = [
    ["Meet Slot updates", "Requests, confirmations, and reminders for your upcoming meetups."],
    ["Messages & circle activity", "New conversations, replies, and updates from your circles."],
    ["Weekly inspiration", "A weekly email with new people, circles, and Meet Slots to explore."],
  ]

  return (
    <Card page="Notifications">
      <PreferenceList>
        {rows.map(([title, copy], index) => (
          <Preference key={title} title={title} copy={copy} divider={index < 2}>
            <Switch checked={preferences[index]} onChange={() => setPreferences((current) => current.map((value, item) => item === index ? !value : value))} />
          </Preference>
        ))}
      </PreferenceList>
      <div className="mt-5 flex items-center gap-[9px] rounded-[10px] bg-[#f1f3ff] p-3 text-xs leading-[18px] text-[#5c5e63]"><Icon file="4fe22.svg" /> We'll always email you important account and security updates.</div>
    </Card>
  )
}
