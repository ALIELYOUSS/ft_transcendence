"use client"

import { CalendarClock, CircleUser, Compass, Layers, MessagesSquare, Settings } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
  { href: "/feed", label: "Feed", icon: Layers },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/calendar", label: "Calendar", icon: CalendarClock },
  { href: "/messages", label: "Messages", icon: MessagesSquare, unread: true },
  { href: "/profile", label: "Profile", icon: CircleUser },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const logo = <Image src="/logo.jpg" alt="" width={28} height={28} />

  return (
    <aside className="hidden w-19 shrink-0 flex-col items-center justify-between py-6 md:flex">
      <Link href="/" aria-label="WeMeet home" className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-[#171b21]">
        {logo}
      </Link>
      <nav aria-label="Main navigation" className="flex flex-col items-center gap-4">
        {items.map(({ href, label, icon: Icon, unread }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={`relative flex size-11 items-center justify-center rounded-xl ${active ? "bg-brand/20 text-brand" : "text-white/60 hover:text-white"}`}
            >
              <Icon className="size-5" aria-hidden />
              {unread && <span className="absolute top-2 right-2 size-2 rounded-full bg-brand" />}
            </Link>
          )
        })}
      </nav>
      {logo}
    </aside>
  )
}
