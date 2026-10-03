import { Bell, Plus, Search, UserRound } from "lucide-react";

const Header = () => {
    return (
        <header className="flex h-[72px] items-center justify-between gap-3 border-b border-[#e8e7e2] bg-white px-3 sm:px-6">
            <div className="flex h-11 w-full min-w-0 max-w-[420px] flex-1 items-center gap-2.5 rounded-xl border border-[#e8e4da] bg-[#fbfaf7] px-3.5 transition-colors focus-within:border-[#d6cda9] focus-within:ring-2 focus-within:ring-[#f6b313]/15">
                <Search className="shrink-0 text-[#8d897f]" size={20} strokeWidth={1.8} aria-hidden="true" />
                <input
                    className="w-full min-w-0 border-0 outline-none bg-transparent text-sm text-[#262820] placeholder:text-[#918e84]"
                    type="search"
                    aria-label="Search people, circles, and topics"
                    placeholder="Search people, circles, topics..."
                />
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
                <button
                    className="relative grid h-10 w-10 place-items-center rounded-xl text-[#625e53] transition-colors hover:bg-[#f4f2eb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e4ad28]"
                    type="button"
                    aria-label="Notifications"
                    title="Notifications"
                >
                    <Bell size={20} strokeWidth={1.8} aria-hidden="true" />
                    <span className="absolute right-[10px] top-[9px] h-2 w-2 rounded-full bg-[#e8a20b] ring-2 ring-white" />
                </button>
                <button
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#f6b313] px-3 sm:px-4 text-sm font-semibold text-[#29220f] shadow-sm transition-colors hover:bg-[#ffc331] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d99b05] focus-visible:ring-offset-2 active:translate-y-px"
                    type="button"
                    aria-label="Propose a slot"
                >
                    <Plus size={18} strokeWidth={2.2} aria-hidden="true" />
                    <span className="hidden sm:inline">Propose slot</span>
                </button>
                <button
                    className="grid h-9 w-9 place-items-center rounded-full border border-[#e6b623] bg-[#2c291d] text-[#f6ca4c] transition-colors hover:bg-[#3a3524] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e4ad28] focus-visible:ring-offset-2"
                    type="button"
                    aria-label="Your profile"
                    title="Your profile"
                >
                    <UserRound size={18} strokeWidth={1.9} aria-hidden="true" />
                </button>
            </div>
        </header>
    );
}

export default Header;