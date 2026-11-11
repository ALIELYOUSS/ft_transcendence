import { BadgeCheck, PlusCircle, ShieldCheck, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { buttonStyles } from "@/components/ui/Button"
import { currentUser, profileStats } from "@/lib/mock-data"

const badges = [
  { icon: ShieldCheck, text: "Identity Verified" },
]

export function ProfileHeader() {
  const { firstname, lastname, username, bio, avatarUrl, verified, online } = currentUser
  const stats = [
    { value: profileStats.posts, label: "Posts", gold: false },
    { value: profileStats.followers, label: "Followers", gold: false },
    { value: profileStats.hosted, label: "Meetups Hosted", gold: false },
  ]
  const name = `${firstname} ${lastname}`.trim()
  const initials = name.split(" ").map((w) => w[0]).join("")

  return (
    <section className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] sm:p-8">
      {}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-linear-to-bl from-[#fff6e0] to-transparent" />

      <div className="relative flex flex-wrap items-start gap-6 sm:gap-8">
        <div className="relative shrink-0">
          <div className="size-24 rounded-full bg-brand p-0.75">
            <div className="relative size-full overflow-hidden rounded-full bg-active">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={name} fill sizes="96px" className="object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center text-2xl font-semibold">{initials}</span>
              )}
            </div>
          </div>
          {online && <span className="absolute right-1 bottom-1 size-3.5 rounded-full bg-green-500 ring-2 ring-white" title="Online" />}
        </div>

        <div className="min-w-64 flex-1">
          <h1 className="flex items-center gap-1.5 text-[28px] leading-tight font-semibold">
            {name}
            {verified && <BadgeCheck className="size-5 fill-brand text-white" aria-label="Verified" />}
          </h1>
          <p className="text-xs text-muted">@{username}</p>

          <ul className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1">
            {stats.map(({ value, label, gold }) => (
              <li key={label} className="flex items-baseline gap-1.5">
                <strong className={`text-lg font-semibold ${gold ? "text-gold" : ""}`}>{value.toLocaleString("en-US")}</strong>
                <span className="text-xs text-muted">{label}</span>
              </li>
            ))}
          </ul>

          <p className="mt-3 max-w-md text-sm leading-6 text-muted">{bio}</p>
        </div>

        <div className="flex flex-col gap-3 sm:ml-auto">
          <Link href="/settings/profile" className={buttonStyles("outline")}>
            <SlidersHorizontal className="size-4" aria-hidden /> Edit Profile
          </Link>
          <Link href="/slots/new" className={buttonStyles("primary")}>
            <PlusCircle className="size-4" aria-hidden /> Publish a Meet Slot
          </Link>
        </div>
      </div>

      <div className="relative mt-6 flex flex-wrap items-center gap-3">
        {badges.map(({ icon: Icon, text }) => (
          <span key={text} className="flex items-center gap-1.5 rounded-full bg-tint px-3 py-1.5 text-[11px] font-medium">
            <Icon className="size-3.5 text-gold" aria-hidden /> {text}
          </span>
        ))}
      </div>
    </section>
  )
}
