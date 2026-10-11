"use client";

import { WeekDayCalendar } from "./week-day-calendar";
import { MessageCircle } from "lucide-react";
import { Map, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#e7e1d6]">
      <div className="mx-auto flex min-h-screen w-full overflow-hidden border border-[#e7e0d8] bg-[#f3f3f1] shadow-[0_20px_50px_rgba(18,22,30,0.08)]">
        <aside className="w-[72px] shrink-0 bg-[#1f2430] p-4">
          <div className="flex h-full flex-col items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-[#f3f1eb] text-[10px] font-semibold text-[#6a6f7b]">
              logo
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-5">
              
              <div className="h-10 w-10 rounded-xl bg-[#2b313c]" />
              <div className="h-10 w-10 rounded-xl bg-[#2b313c]" />
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2b313c] text-white">
                  <Map className="w-5 h-5" />
                </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2b313c] text-white">
                <MessageCircle className="h-4 w-4" />
              </div>
            </div>

            <div className="h-10 w-10 rounded-xl bg-[#e7b23f]" />
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-[#f3f3f1] p-4">
          <div className="rounded-[24px] bg-[#f8f8f6] p-4 shadow-inner">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="h-12 min-w-0 max-w-300 flex-1 rounded-xl bg-[#E8E4D8] shadow-sm">
                <input
                  type="search"
                  placeholder="Search people, circles, topics..."
                  className="h-full w-full rounded-xl bg-transparent px-4 text-black outline-none placeholder:text-[#CDBDA5]"
                />
              </div>

              {/* <div className="h-12 w-32 shrink-0 rounded-xl bg-[#efb92d]"></div> */}              
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#7C5800]">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH37MxCuOqN0ROHlzaycbQacKpH9ObC49BmO2290bH7A&s=10"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="h-10 w-40 rounded-full bg-[#eef1f5]" />
              <div className="h-10 w-48 rounded-full bg-[#eef1f5]" />
            </div>

            <div className="rounded-[20px] border border-[#ece5dc] bg-white p-3">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="h-12 w-40 rounded-lg bg-[#eef1f5]" />
                <div className="h-10 w-64 rounded-lg bg-[#eef1f5]" />
              </div>
              <div className="min-w-0">
                <WeekDayCalendar />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}