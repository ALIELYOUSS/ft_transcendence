"use client";

import { WeekDayCalendar } from "./week-day-calendar";
import { MessageCircle } from "lucide-react";
import { Map, MapPin } from "lucide-react";
import Sidebar from "../component/leftbar";
const time = new Date().toLocaleTimeString("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
})

export default function Home() {
  return (
    <div className="min-h-screen bg-[#e7e1d6]">
      <div className="mx-auto flex min-h-screen w-full overflow-hidden border border-[#e7e0d8] bg-[#f3f3f1] shadow-[0_20px_50px_rgba(18,22,30,0.08)]">
        <Sidebar></Sidebar>
        <main className="min-w-0 flex-1 bg-[#f3f3f1] px-4 pb-20 pt-20 lg:pb-4">
          <div className="rounded-[24px] bg-[#f8f8f6] p-4 shadow-inner">
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