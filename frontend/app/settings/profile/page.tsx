"use client"

import { useRef, useState, type ChangeEvent } from "react"
import { SettingsCard } from "@/components/settings/SettingsCard"
import { Button } from "@/components/ui/Button"
import { Field, inputClass } from "@/components/ui/Field"
import { useToast } from "@/components/ui/Toast"
import { currentUser } from "@/lib/mock-data"

const MAX_AVATAR_BYTES = 5 * 1024 * 1024

export default function ProfileSettings() {
  const notify = useToast()
  const fileInput = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    firstname: currentUser.firstname,
    lastname: currentUser.lastname,
    username: currentUser.username,
    bio: currentUser.bio,
    location: currentUser.location,
    website: currentUser.website,
  })
  const [avatar, setAvatar] = useState<string | null>(currentUser.avatarUrl)


  const update = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  function onPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    ///the backend must validate type and size 
    if (!["image/jpeg", "image/png"].includes(file.type)) return notify("Choose a JPG or PNG image.")
    if (file.size > MAX_AVATAR_BYTES) return notify("That photo is over 5 MB.")
    if (avatar?.startsWith("blob:")) URL.revokeObjectURL(avatar)
    setAvatar(URL.createObjectURL(file))
    notify("Profile photo updated")
  }

  const initials = form.firstname.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()

  return (
    <SettingsCard section="profile">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex size-17 shrink-0 rounded-full bg-brand p-0.75">
          <div className="size-full overflow-hidden rounded-full">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={form.username} className="size-full object-cover" />
            ) : (
              <span className="flex size-full items-center justify-center bg-active text-lg font-semibold">{initials}</span>
            )}
          </div>
        </div>
        <div className="min-w-47 flex-1">
          <p className="text-[15px] font-semibold">{form.username}</p>
          <p className="mt-1.5 text-xs text-muted">A familiar face makes the first hello easier.</p>
          <p className="mt-1.5 text-[11px] text-subtle">JPG or PNG · Up to 5 MB</p>
        </div>
        <input ref={fileInput} type="file" accept="image/png,image/jpeg" className="sr-only" onChange={onPhoto} aria-label="Upload profile photo" />
        <Button onClick={() => fileInput.current?.click()}>Change photo</Button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="First Name"><input value={form.firstname} onChange={update("firstname")} maxLength={30} className={`${inputClass} h-10`} /></Field>
         <Field label="Last Name"><input value={form.lastname} onChange={update("lastname")} maxLength={30} className={`${inputClass} h-10`} /></Field>
        <Field label="Username">
          <span className="relative flex items-center">
            <span className="pointer-events-none absolute left-3 text-[13px] text-muted">@</span>
            <input value={form.username} onChange={update("username")} minLength={3} maxLength={20} pattern="[a-zA-Z0-9_]+" className={`${inputClass} h-10 pl-6.5`} />
          </span>
        </Field>
        <Field label="Bio" wide><textarea value={form.bio} onChange={update("bio")} rows={2} maxLength={200} className={`${inputClass} resize-y py-2.5`} /></Field>
        <Field label="Location"><input value={form.location} onChange={update("location")} className={`${inputClass} h-10`} /></Field>
        <Field label="Website"><input value={form.website} onChange={update("website")} className={`${inputClass} h-10`} /></Field>
      </div>
      <div className="mt-5 flex gap-2.5">
          <Button type="button" onClick={() => notify("Changes discarded")}>Cancel</Button>
          <Button variant="primary" onClick={() => notify("Profile settings saved")}>Save changes</Button>
      </div>
    </SettingsCard>
  )
}
