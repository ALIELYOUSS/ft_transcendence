"use client"

import { Bell, Plus, Search,} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useToast } from "@/components/ui/Toast"
import { useState } from "react"
import { AccountMenu } from "./AccMenu"

export function TopBar() {
  const notify = useToast()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-5 px-6 pt-4">
      <form
        role="search"
        className="flex h-11 w-full max-w-170 items-center gap-3 rounded-xl border border-[#e8e4d8] bg-[#f8f7f4] px-3.5 focus-within:ring-2 focus-within:ring-brand/30"
        onSubmit={(e) => {
          e.preventDefault()
          const q = String(new FormData(e.currentTarget).get("query") ?? "").trim()
          notify(q ? `Searching for “${q}”` : "Type something to search")
        }}
      >
        <Search className="size-4.5 text-[#837560]" aria-hidden />
        <input name="query" aria-label="Search" placeholder="Search people, circles, topics..." className="min-w-0 flex-1 bg-transparent text-sm text-[#504533] outline-none placeholder:text-[#837560]" />
      </form>
      <div className="flex shrink-0 items-center gap-4">
        <button type="button" aria-label="Notifications" className="relative" onClick={() => notify("One new notification")}>
          <Bell className="size-5" aria-hidden />
          <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-brand" />
        </button>
        <Button variant="primary" onClick={() => notify("Slot proposal opened")}>
          <Plus className="size-4" aria-hidden />
          <span className="hidden sm:inline">Propose Slot</span>
        </Button>
        <AccountMenu />
      </div>
    </header>
  )
}
