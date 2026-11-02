import { useEffect, useState } from "react"
import {
  ActionButton,
  Icon,
  Page,
  pageCopy,
} from "./front end/shared"
import AccountPage from "./front end/account"
import NotificationsPage from "./front end/notif"
import PrivacyPage from "./front end/privacy"
import ProfilePage from "./front end/profile"
import SecurityPage from "./front end/securty"

const pages: Page[] = [
  "Profile",
  "Account",
  "Notifications",
  "Privacy",
  "Security",
]

const navIcons: Record<Page, { active: string; idle: string }> = {
  Profile: { active: "f79b8.svg", idle: "aaef8.svg" },
  Account: { active: "2dfb1.svg", idle: "a2345.svg" },
  Notifications: { active: "fe36b.svg", idle: "ffe43.svg" },
  Privacy: { active: "25227.svg", idle: "4940c.svg" },
  Security: { active: "e172e.svg", idle: "d454e.svg" },
}

export default function App() {
  const [page, setPage] = useState<Page>(() => pageFromPath())
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    const onPopState = () => setPage(pageFromPath())
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [])

  const navigate = (next: Page) => {
    const path = next === "Profile" ? "/" : `/${next.toLowerCase()}`
    window.history.pushState({}, "", path)
    setPage(next)
  }

  const notify = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(null), 2400)
  }

  return (
    <div className="flex min-h-dvh gap-6 bg-[#0b0e12] p-2">
      <AppNavigation notify={notify} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[20px] bg-[#f9f9ff]">
        <Header notify={notify} />
        <main className="flex flex-1 flex-col gap-7 px-5 py-8 sm:px-8 lg:px-12">
          <PageIntroduction page={page} notify={notify} />
          <div className="grid items-start gap-7 lg:grid-cols-[216px_minmax(0,1fr)]">
            <SettingsNavigation page={page} navigate={navigate} notify={notify} />
            <div className="min-w-0">
              {page === "Profile" && <ProfilePage notify={notify} />}
              {page === "Account" && <AccountPage notify={notify} />}
              {page === "Notifications" && <NotificationsPage />}
              {page === "Privacy" && <PrivacyPage notify={notify} />}
              {page === "Security" && <SecurityPage notify={notify} />}
            </div>
          </div>
          <Footer />
        </main>
      </div>
      {notice && (
        <div role="status" className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#141b2b] px-4 py-3 font-['Inter:Medium'] text-[13px] text-white shadow-xl">
          {notice}
        </div>
      )}
    </div>
  )
}

function pageFromPath(): Page {
  const match = pages.find((item) => `/${item.toLowerCase()}` === window.location.pathname)
  return match ?? "Profile"
}

function AppNavigation({ notify }: { notify: (message: string) => void }) {
  const items = [
    ["Feed", "59510.svg"],
    ["Explore", "7924a.svg"],
    ["Calendar", "1c1a3.svg"],
    ["Messages", "f5834.svg"],
    ["Profile", "92075.svg"],
  ]

  return (
    <aside className="hidden w-[76px] shrink-0 flex-col items-center justify-between py-6 md:flex">
      <button className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-[#171b21]" aria-label="WeMeet home" onClick={() => notify("Welcome to WeMeet")}><span className="overflow-hidden rounded-lg"><Icon file="f2b8e.png" /></span></button>
      <nav className="flex flex-col items-center gap-4" aria-label="Main navigation">
        {items.map(([label, icon]) => <button key={label} aria-label={label} onClick={() => notify(`${label} selected`)}><Icon file={icon} /></button>)}
        <button className="flex size-11 items-center justify-center rounded-xl bg-[rgba(248,181,14,0.2)]" aria-label="Settings"><Icon file="d0959.svg" /></button>
      </nav>
      <span className="overflow-hidden rounded-lg"><Icon file="f2b8e.png" /></span>
    </aside>
  )
}

function Header({ notify }: { notify: (message: string) => void }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-5 px-6">
      <form className="flex h-11 w-full max-w-[680px] items-center gap-3 rounded-xl border border-[#e8e4d8] bg-[#f8f7f4] px-3.5 focus-within:ring-2 focus-within:ring-[#f8b50e]/30" onSubmit={(event) => { event.preventDefault(); const query = new FormData(event.currentTarget).get("query"); notify(query ? `Searching for “${query}”` : "Type something to search") }}>
        <Icon file="4cbfa.svg" /><input name="query" aria-label="Search" className="min-w-0 flex-1 bg-transparent font-['Inter:Regular'] text-sm text-[#504533] outline-none placeholder:text-[#837560]" placeholder="Search people, circles, topics..." />
      </form>
      <div className="flex shrink-0 items-center gap-4"><button aria-label="Notifications" onClick={() => notify("One new notification")}><Icon file="df6a5.svg" /></button><button className="flex h-10 items-center gap-[7px] rounded-xl border border-[#f5aa18] bg-gradient-to-r from-[#f9b233] to-[#f59e0b] px-4 font-['Inter:Semi_Bold'] text-[13px] text-[#1a1200]" onClick={() => notify("Slot proposal opened")}><Icon file="fe0cf.svg" /><span className="hidden sm:inline">Propose Slot</span></button><button aria-label="Account menu" onClick={() => notify("Account menu opened")}><Icon file="18216.svg" /></button></div>
    </header>
  )
}

function PageIntroduction({ page, notify }: { page: Page; notify: (message: string) => void }) {
  return <section className="flex items-center justify-between gap-5"><div><h1 className="font-['Inter:Semi_Bold'] text-[28px] leading-normal">{page}</h1><p className="mt-2 font-['Inter:Regular'] text-sm text-[#5c5e63]">{pageCopy[page]}</p></div><ActionButton onClick={() => notify("Public profile opened")}><Icon file="7c4cc.svg" /><span className="hidden sm:inline">View profile</span></ActionButton></section>
}

function SettingsNavigation({ page, navigate, notify }: { page: Page; navigate: (page: Page) => void; notify: (message: string) => void }) {
  return (
    <aside className="flex flex-col gap-6">
      <nav aria-label="Settings navigation"><p className="mb-1.5 font-['Inter:Semi_Bold'] text-[10px] text-[#929399]">YOUR PREFERENCES</p><div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">{pages.map((item) => { const active = item === page; return <button key={item} className={`flex h-11 items-center gap-3 rounded-[10px] px-3 text-left text-[13px] ${active ? "bg-[#e9edff] font-['Inter:Semi_Bold'] text-[#141b2b]" : "font-['Inter:Regular'] text-[#5c5e63] hover:bg-white/60"}`} onClick={() => navigate(item)}><Icon file={active ? navIcons[item].active : navIcons[item].idle} /><span className="min-w-0 flex-1 truncate">{item}</span>{active && <span className="size-[5px] rounded-full bg-[#f8b50e]" />}</button> })}</div></nav>
      <div className="hidden rounded-2xl bg-[#f1f3ff] p-4 lg:block"><Icon file="c1a32.svg" /><h2 className="mt-3 font-['Inter:Semi_Bold'] text-[13px]">A little help?</h2><p className="mt-3 font-['Inter:Regular'] text-xs leading-[19px] text-[#5c5e63]">Our team is here to help you feel at home on WeMeet.</p><button className="mt-3 flex items-center gap-[5px] font-['Inter:Semi_Bold'] text-xs text-[#7c5800]" onClick={() => notify("Connecting you with support")}>Contact support <Icon file="6620a.svg" /></button></div>
      <button className="hidden items-center gap-2.5 px-3 font-['Inter:Regular'] text-[13px] text-[#5c5e63] lg:flex" onClick={() => notify("Signed out")}><Icon file="340e9.svg" /> Sign out</button>
    </aside>
  )
}

function Footer() {
  return <footer className="mt-auto flex min-h-12 flex-col items-center justify-between gap-3 px-6 font-['Inter:Regular'] text-xs text-[#5c5e63] sm:flex-row"><p>© 2025 WeMeet. Built for meaningful connection.</p><div className="flex items-center gap-4">{["Privacy", "Terms", "Guidelines", "Support"].map((link, index) => <span className="contents" key={link}>{index > 0 && <span className="text-[#d5c4ac]">·</span>}<button>{link}</button></span>)}</div></footer>
}
