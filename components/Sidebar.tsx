import Image from "next/image";
import {
  CalendarDays,
  CircleUserRound,
  Compass,
  MessagesSquare,
  PanelsTopLeft,
  UserRound,
} from "lucide-react";

const navigationItems = [
  { label: "Overview", icon: PanelsTopLeft },
  { label: "Explore", icon: Compass },
  { label: "Meetups", icon: CalendarDays },
  { label: "Messages", icon: MessagesSquare, active: true },
  { label: "Communities", icon: CircleUserRound },
];

const Sidebar = () => {
  return (
    <aside className="flex w-24 shrink-0 flex-col items-center bg-[#111714] py-6 text-[#aab3ac]">
      <a
        className="mb-10 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-[#3b433d] bg-[#1b211e] shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-colors hover:border-[#f6b313]/50"
        href="/chat"
        aria-label="WeMeet home"
      >
        <Image
          className="h-14 w-14 drop-shadow-[0_0_8px_rgba(247,180,24,0.18)]"
          src="/logo.svg"
          alt="WeMeet"
          width={56}
          height={56}
          priority
        />
      </a>

      <nav className="flex w-full flex-1 flex-col items-center justify-center gap-5 pt-10" aria-label="Main navigation">
        {navigationItems.map(({ label, icon: Icon, active }) => (
          <button
            key={label}
            className={`grid h-12 w-12 place-items-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e4ad28] ${
              active
                ? "bg-[#4b3c11] text-[#ffd45a]"
                : "text-[#aab3ac] hover:bg-[#202923] hover:text-white"
            }`}
            type="button"
            aria-label={label}
            aria-current={active ? "page" : undefined}
            title={label}
          >
            <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
          </button>
        ))}
      </nav>

      <div className="mt-8 flex flex-col items-center">
        <button
          className="relative grid h-10 w-10 place-items-center rounded-full border border-[#e6b623] bg-[#2c291d] text-[#f6ca4c] transition-colors hover:bg-[#3a3524] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e4ad28] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111714]"
          type="button"
          aria-label="Your profile"
          title="Your profile"
        >
          <UserRound size={20} strokeWidth={1.9} aria-hidden="true" />
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#111714] bg-[#33bb80]" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;