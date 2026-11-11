"use client"

import { Check } from "lucide-react"
import { SettingsCard } from "@/components/settings/SettingsCard"
import { Button } from "@/components/ui/Button"
import { Field, inputClass, SelectField } from "@/components/ui/Field"
import { useToast } from "@/components/ui/Toast"
import { currentUser } from "@/lib/mock-data"
import { useState } from "react"

const languages = ["English (US)", "English (UK)"] as const
const timeZones = ["Casblanca", "Rabat", "Khouribga"] as const

export default function AccountSettings() {
  const notify = useToast()
  const [email, setEmail] = useState(currentUser.email)
  const [phone, setPhone] = useState(currentUser.phone)
  return (
    <SettingsCard section="account">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email address">
          <div className="relative">
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className={`${inputClass} h-10 pr-24`} />
            <span className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 rounded-full bg-success-bg px-2 py-1 text-[10px] font-medium text-success">
              <Check className="size-3" aria-hidden />
              Verified
            </span>
          </div>
        </Field>
        <Field label="Phone number">
          <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+212 6 00 00 00 00" className={`${inputClass} h-10`} />
        </Field>
        <SelectField label="Language" options={languages} />
        <SelectField label="Time zone" options={timeZones} />
      </div>
      <div className=" mt-10 flex gap-2.5">
          <Button type="button" onClick={() => notify("Changes discarded")}>Cancel</Button>
          <Button variant="primary" onClick={() => notify("Profile settings saved")}>Save changes</Button>
      </div>
    </SettingsCard>
  )
}
