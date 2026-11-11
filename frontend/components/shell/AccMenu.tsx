"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { LogOut } from "lucide-react"
import { useToast } from "@/components/ui/Toast"
import { currentUser } from "@/lib/mock-data"

export function AccountMenu() {
  const notify = useToast()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function closeOnOutsideClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", closeOnOutsideClick)
    return () => document.removeEventListener("mousedown", closeOnOutsideClick)
  }, [])

  const closeMenu = () => setOpen(false)

  return (
    <div ref={menuRef} className="relative">
      <button type="button" aria-label="Account menu" aria-expanded={open} onClick={() => setOpen((value) => !value)} className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-gold text-white" >
        <Image src={currentUser.avatarUrl} alt={currentUser.firstname} width={40} height={40} className="size-full object-cover" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-line bg-white shadow-xl">
          <div className="border-b border-line p-5">
            <div className="flex items-center gap-3">
              <Image src={currentUser.avatarUrl} alt={currentUser.firstname} width={48} height={48} className="size-12 rounded-full object-cover"
              />
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">
                  {currentUser.firstname}
                </p>
                <p className="truncate text-xs text-muted">
                  {currentUser.email}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted">
              @{currentUser.username}
            </p>
          </div>

          <nav className="grid gap-1 p-2">
            <Link href="/profile" onClick={closeMenu} className="rounded-xl px-3 py-3 text-sm hover:bg-[#fff3b0]">
              Profile
            </Link>
            <Link href="/profile" onClick={closeMenu} className="rounded-xl px-3 py-3 text-sm hover:bg-[#fff3b0]">
              Slots
            </Link>
            <Link href="/settings/notifications" onClick={closeMenu} className="rounded-xl px-3 py-3 text-sm hover:bg-[#fff3b0]">
              Notifications
            </Link>
            <Link href="/settings/profile" onClick={closeMenu} className="rounded-xl px-3 py-3 text-sm hover:bg-[#fff3b0]">
              Settings
            </Link>
          </nav>
          <div className="border-t border-line p-2">
            <button
              type="button"
              onClick={() => {
                closeMenu()
                notify("Logged out")
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-sm text-danger hover:bg-red-50"
            >
              <LogOut className="size-4" />
              Log Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}