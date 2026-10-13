"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CalendarDays,
  Compass,
  MessagesSquare,
  PanelsTopLeft,
} from "lucide-react";

const navigationItems = [
  { label: "Overview", href: "/overview", icon: PanelsTopLeft },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Meetups", href: "/", icon: CalendarDays },
  { label: "Messages", href: "/chat", icon: MessagesSquare },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);

  return isVisible ? (
    <>
      <aside className="fixed inset-x-0 bottom-0 z-40 flex h-16 w-full flex-row items-center  border border-b-0 border-[#e7e0d8] bg-[#f8f8f6] px-3 py-2 text-[#767d8d] lg:static lg:h-auto lg:w-22 lg:shrink-0 lg:flex-col  lg:border lg:px-0 lg:py-6">
          <button
        className="fixed bottom-4 left-4 z-40 grid h-12 w-12 place-items-center rounded-2xl border border-[#ece5dc] bg-[#f8f8f6] transition-colors hover:border-[#efb92d] hover:bg-[#fff8e6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#efb92d] lg:bottom-auto lg:left-3 lg:top-3 lg:h-16 lg:w-16"
            type="button"
            aria-label="Hide sidebar"
            title="Hide sidebar"
            onClick={() => setIsVisible(false)}
          >
            <Image
              className="h-10 w-10 rounded-xl lg:h-14 lg:w-14"
              src="/logo.png"
              alt="WeMeet"
              width={56}
              height={56}
              priority
            />
          </button>
          <nav
            className="z-30 flex w-full flex-1 flex-row items-center justify-around gap-1 lg:flex-col lg:justify-center lg:gap-8"
            aria-label="Main navigation"
          >
            {navigationItems.map(({ label, href, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);

              return (
                <Link
                  key={label}
                  className={`grid h-18 w-14 place-items-center rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#efb92d] lg:h-9 ${
                    active
                      ? "border border-[#efb92d]/40 bg-[#fff4d6] text-[#a87300]"
                      : "text-[#767d8d] hover:bg-[#f3f0e8] hover:text-[#252a37]"
                  }`}
                  href={href}
                  aria-label={label}
                  aria-current={active ? "page" : undefined}
                  title={label}
                >
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                </Link>
              );
            })}
            <button
              className="grid h-11 w-14 place-items-center rounded-xl transition-colors hover:bg-[#f3f0e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#efb92d] lg:hidden"
              type="button"
              aria-label="Hide sidebar"
              title="Hide sidebar"
              onClick={() => setIsVisible(false)}
            >
              <Image
                className="h-9 w-9 rounded-lg"
                src="/logo.png"
                alt=""
                width={36}
                height={36}
              />
            </button>
          </nav>     
      </aside>
      <aside className="fixed left-0 right-0 top-0 z-20 flex h-16 items-center gap-3 border border-t-0 border-[#e7e0d8] bg-[#f8f8f6] px-3 py-2 text-[#767d8d] sm:px-5 lg:left-22 lg:px-6">
        <div className="min-w-0  max-w-[600px] flex-1 rounded-xl bg-[#E8E4D8] shadow-sm">
          <input
            type="search"
            aria-label="Search people, circles, and topics"
            placeholder="Search people, circles, topics..."
            className="h-10 w-full min-w-0 rounded-xl bg-transparent px-3 text-sm text-black outline-none placeholder:text-[#CDBDA5] sm:h-12 sm:px-4 sm:text-base"
          />
        </div>
               <button
  type="button"
  aria-label="Notifications"
  className="relative flex h-12 w-12 items-center justify-center rounded-full hover:bg-[#E8E4D8]"
>
  <Bell size={22} className="text-[#2B313C]" />

  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
</button>
        <div className="ml-auto h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#7C5800] sm:h-12 sm:w-12">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH37MxCuOqN0ROHlzaycbQacKpH9ObC49BmO2290bH7A&s=10"
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
 
      </aside>
      </>
    ) : (
      <button
        className="fixed bottom-4 left-4 z-40 grid h-12 w-12 place-items-center rounded-2xl border border-[#ece5dc] bg-[#f8f8f6] transition-colors hover:border-[#efb92d] hover:bg-[#fff8e6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#efb92d] lg:bottom-auto lg:left-3 lg:top-3 lg:h-16 lg:w-16"
        type="button"
        aria-label="Show sidebar"
        title="Show sidebar"
        onClick={() => setIsVisible(true)}
      >
        <Image
          className="h-10 w-10 rounded-xl lg:h-14 lg:w-14"
          src="/logo.png"
          alt=""
          width={56}
          height={56}
          priority
        />
      </button>
    );
          
};

export default Sidebar;