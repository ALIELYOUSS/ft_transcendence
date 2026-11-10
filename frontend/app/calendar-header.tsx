"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CalendarView } from "./calendar-utils";

type CalendarHeaderProps = {
  selectedDate: Date;
  periodLabel: string;
  view: CalendarView;
  onToday: () => void;
  onShift: (amount: number) => void;
  onViewChange: (view: CalendarView) => void;
};

export function CalendarHeader({
  selectedDate,
  periodLabel,
  view,
  onToday,
  onShift,
  onViewChange,
}: CalendarHeaderProps) {
  return (
    <header className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold">Weekly Meet Slots</h1>
          <span className="rounded bg-[#eef1f5] px-1.5 py-0.5 text-[9px] font-bold text-[#586071]">W{format(selectedDate, "II")}</span>
        </div>
        <p className="text-[10px] text-[#767d8d]">{periodLabel}</p>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <button type="button" onClick={onToday} className="rounded-md border border-[#dfe3ed] px-3 py-2 text-xs font-medium hover:bg-[#f6f7fb]">Today</button>
        <button type="button" aria-label="Previous period" onClick={() => onShift(-1)} className="grid size-8 place-items-center rounded-md border border-[#dfe3ed] hover:bg-[#f6f7fb]"><ChevronLeft size={16} /></button>
        <button type="button" aria-label="Next period" onClick={() => onShift(1)} className="grid size-8 place-items-center rounded-md border border-[#dfe3ed] hover:bg-[#f6f7fb]"><ChevronRight size={16} /></button>
        <div role="group" aria-label="Calendar view" className="flex rounded-md bg-[#eef1f5] p-1">
          {(["week", "agenda"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={view === option}
              onClick={() => onViewChange(option)}
              className={`rounded px-2 py-1 text-[10px] font-semibold capitalize ${view === option ? "bg-white text-[#252a37] shadow-sm" : "text-[#767d8d]"}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}