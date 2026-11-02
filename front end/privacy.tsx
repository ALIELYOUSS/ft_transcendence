import { useState } from "react"
import { Card, Icon, Preference, PreferenceList, Switch } from "./shared"

export default function PrivacyPage({ notify }: { notify: (message: string) => void }) {
  const [online, setOnline] = useState(true)
  const [discoverable, setDiscoverable] = useState(false)

  return (
    <Card page="Privacy">
      <PreferenceList>
        <Preference title="Profile visibility" copy="Choose who can see your posts and profile details." divider>
          <label className="relative flex h-9 items-center gap-5 rounded-[10px] border border-[#e9eaf1] px-3"><select className="appearance-none bg-transparent pr-5 text-xs outline-none"><option>Everyone on WeMeet</option><option>People I follow</option><option>Only me</option></select><span className="pointer-events-none absolute right-3"><Icon file="f6011.svg" /></span></label>
        </Preference>
        <Preference title="Show my online status" copy="Let people know when you're around for a conversation." divider><Switch checked={online} onChange={() => setOnline(!online)} /></Preference>
        <Preference title="Discoverable by email" copy="Allow people who have your email address to find you."><Switch checked={discoverable} onChange={() => setDiscoverable(!discoverable)} /></Preference>
      </PreferenceList>
      <button className="mt-5 flex w-full items-center justify-between font-['Inter:Medium'] text-xs text-[#7c5800]" onClick={() => notify("No blocked accounts")}>Manage blocked accounts<span className="flex items-center gap-2 font-['Inter:Regular'] text-[#5c5e63]">0 accounts <Icon file="ea8cc.svg" /></span></button>
    </Card>
  )
}
