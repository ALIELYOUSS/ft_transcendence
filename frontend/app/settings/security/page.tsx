"use client"

import { CircleAlert, FolderDown, Lock, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { PreferenceRow } from "@/components/settings/PreferenceRow"
import { SettingsCard } from "@/components/settings/SettingsCard"
import { Button } from "@/components/ui/Button"
import { Switch } from "@/components/ui/Switch"
import { useToast } from "@/components/ui/Toast"
import { inputClass } from "@/components/ui/Field"

const SAVED_TWO_FACTOR = true // later: comes from the API

export default function SecuritySettings() {
  const notify = useToast()
  const [twoFactor, setTwoFactor] = useState(SAVED_TWO_FACTOR)
  const [passwordError, setPasswordError] = useState(false)

  const badge = (
    <span className="flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-1 text-[11px] font-medium text-success">
      <ShieldCheck className="size-3.5" aria-hidden /> Protected
    </span>
  )

  return (
    <div className="flex flex-col gap-5">
      <SettingsCard section="security" badge={badge}>
        <div>
          <div className="border-b border-line py-3">
            <p className="text-[13px] font-medium">Password</p>
            <p className="mt-1 text-xs text-muted">Last updated September 12, 2025</p>
            <form
              noValidate
              className="mt-4 grid gap-4 sm:grid-cols-5"
              onSubmit={(event) => {
                event.preventDefault()
                const values = new FormData(event.currentTarget)
                const current = String(values.get("current") ?? "").trim()
                const next = String(values.get("new") ?? "").trim()
                const confirm = String(values.get("confirm") ?? "").trim()
                const invalid = !current || !next || !confirm || next !== confirm
                setPasswordError(invalid)
                if (invalid) return
                notify("Password changed")
              }}
            >
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium">Current password</span>
                <input name="current" type="password" className={`${inputClass} h-10 ${passwordError ? "border-danger" : ""}`} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium">New password</span>
                <input name="new" type="password" className={`${inputClass} h-10 ${passwordError ? "border-danger" : ""}`} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium">Confirm password</span>
                <input name="confirm" type="password" className={`${inputClass} h-10 ${passwordError ? "border-danger" : ""}`} />
              </label>
              {passwordError && (
                <p className="flex items-center gap-1.5 text-xs text-danger sm:col-span-5" role="alert">
                  <CircleAlert className="size-4" aria-hidden />
                  Complete all fields and make sure the passwords match.
                </p>
              )}
              <div className="sm:col-span-3">
                <Button type="submit" variant="primary">
                  Save password
                </Button>
              </div>
            </form>
          </div>
          <PreferenceRow title="Two-factor authentication" description="An extra layer of protection with your authenticator app.">
            <Switch label="Two-factor authentication" checked={twoFactor} onChange={setTwoFactor} />
          </PreferenceRow>
          <PreferenceRow title="Active sessions" description="MacBook Pro · San Francisco, CA · Active now">
            <Button onClick={() => notify("Device manager opened")}>Manage devices</Button>
          </PreferenceRow>
        </div>
      </SettingsCard>

      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-line p-5">
        <FolderDown className="size-5 text-muted" aria-hidden />
        <div className="min-w-55 flex-1">
          <p className="text-[13px] font-medium">Your account, your choice</p>
          <p className="mt-1 text-xs text-muted">Download a copy of your data or permanently delete your account.</p>
        </div>
        <div className="flex gap-4 text-xs font-medium">
          <button type="button" className="text-gold" onClick={() => notify("Data export requested")}>Export data</button>
          <button type="button" className="text-danger" onClick={() => notify("Delete account opened")}>Delete account</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <p className="flex items-center gap-2 text-xs text-muted">
          <Lock className="size-3.5 text-gold" aria-hidden /> Your preferences are always private to you.
        </p>
      </div>
      <div className="mt-5 flex gap-2.5">
          <Button type="button" onClick={() => notify("Changes discarded")}>Cancel</Button>
          <Button variant="primary" onClick={() => notify("Security settings saved")}>Save changes</Button>
      </div>
    </div>
  )
}
