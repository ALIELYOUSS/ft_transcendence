import { ChangeEvent, useRef, useState } from "react"
import { ActionButton, Card, Field } from "./shared"

export default function ProfilePage({ notify }: { notify: (message: string) => void }) {
  const [profile, setProfile] = useState({
    name: "Maya Lin",
    username: "@mayalin",
    bio: "Urban sketcher, coffee enthusiast, and weekend trail explorer. Curating genuine creative gatherings across the Bay Area.",
    location: "San Francisco, CA",
    website: "mayalin.design",
  })
  const [avatar, setAvatar] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const update =
    (key: keyof typeof profile) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setProfile((current) => ({ ...current, [key]: event.target.value }))

  return (
    <Card page="Profile">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex size-[68px] shrink-0 rounded-full bg-[#f8b50e] p-[3px]">
          <div className="size-[62px] overflow-hidden rounded-full">
            {avatar ? (
              <img className="h-full w-full object-cover object-[center_22%]" src={avatar} alt="Maya Lin" />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-[#e9edff] font-['Inter:Semi_Bold'] text-lg text-[#141b2b]">ML</span>
            )}
          </div>
        </div>
        <div className="min-w-[190px] flex-1">
          <p className="font-['Inter:Semi_Bold'] text-[15px]">{profile.name}</p>
          <p className="mt-1.5 text-xs text-[#5c5e63]">A familiar face makes the first hello easier.</p>
          <p className="mt-1.5 text-[11px] text-[#929399]">JPG or PNG · Up to 5 MB</p>
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) {
              setAvatar(URL.createObjectURL(file))
              notify("Profile photo updated")
            }
          }}
        />
        <ActionButton onClick={() => fileInput.current?.click()}>Change photo</ActionButton>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Full name"><input value={profile.name} onChange={update("name")} /></Field>
        <Field label="Username"><input value={profile.username} onChange={update("username")} /></Field>
        <Field label="Bio" wide><textarea value={profile.bio} onChange={update("bio")} rows={2} /></Field>
        <Field label="Location"><input value={profile.location} onChange={update("location")} /></Field>
        <Field label="Website"><input value={profile.website} onChange={update("website")} /></Field>
      </div>
    </Card>
  )
}
