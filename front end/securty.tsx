import { useState } from "react"
import { ActionButton, Card, Icon, Preference, PreferenceList, Switch } from "./shared"

export default function SecurityPage({ notify }: { notify: (message: string) => void }) {
  const [twoFactor, setTwoFactor] = useState(true)

  return (
    <div className="flex flex-col gap-5">
      <Card page="Security" extra={<span className="flex items-center gap-[5px] rounded-full bg-[#eaf7f1] px-2.5 py-[5px] font-['Inter:Medium'] text-[11px] text-[#168565]"><Icon file="9cd0a.svg" /> Protected</span>}>
        <PreferenceList>
          <Preference title="Password" copy="Last updated September 12, 2025" divider><ActionButton onClick={() => notify("Change password opened")}>Change password</ActionButton></Preference>
          <Preference title="Two-factor authentication" copy="An extra layer of protection with your authenticator app." divider><Switch checked={twoFactor} onChange={() => setTwoFactor(!twoFactor)} /></Preference>
          <Preference title="Active sessions" copy="MacBook Pro · San Francisco, CA · Active now"><ActionButton onClick={() => notify("Device manager opened")}>Manage devices</ActionButton></Preference>
        </PreferenceList>
      </Card>
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#e9eaf1] p-5"><Icon file="27dfa.svg" /><div className="min-w-[220px] flex-1"><p className="font-['Inter:Medium'] text-[13px]">Your account, your choice</p><p className="mt-[5px] text-xs text-[#5c5e63]">Download a copy of your data or permanently delete your account.</p></div><div className="flex gap-4 font-['Inter:Medium'] text-xs"><button className="text-[#7c5800]" onClick={() => notify("Data export requested")}>Export data</button><button className="text-[#b44343]" onClick={() => notify("Delete account opened")}>Delete account</button></div></div>
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1"><p className="flex items-center gap-[7px] text-xs text-[#5c5e63]"><Icon file="e118c.svg" /> Your preferences are always private to you.</p><div className="flex gap-2.5"><ActionButton onClick={() => setTwoFactor(true)}>Cancel</ActionButton><button className="h-10 rounded-xl border border-[#f5aa18] bg-gradient-to-r from-[#f9b233] to-[#f59e0b] px-4 font-['Inter:Semi_Bold'] text-[13px] text-[#1a1200]" onClick={() => notify("Security settings saved")}>Save changes</button></div></div>
    </div>
  )
}
