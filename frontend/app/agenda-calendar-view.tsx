"use client";

import { format } from "date-fns";
import { dateKey, displayTime, findEventColor } from "./calendar-utils";
import type { CalendarEvent } from "./calendar-utils";

type AgendaCalendarViewProps = {
  days: Date[];
  events: CalendarEvent[];
  currentUserId: string;
  getAttendeeCount: (event: CalendarEvent) => number;
  onCreate: (date: Date) => void;
  onEdit: (event: CalendarEvent) => void;
  onBook: (event: CalendarEvent) => void;
};

export function AgendaCalendarView({ days, events, currentUserId, getAttendeeCount, onCreate, onEdit, onBook }: AgendaCalendarViewProps) {
  return (
    <div className="divide-y divide-[#edf0f5]">
      {days.map((day) => {
        const dayKey = dateKey(day);
        const dayEvents = events.filter((event) => event.date === dayKey).sort((a, b) => a.start.localeCompare(b.start));
        return (
          <div key={dayKey} className="grid gap-2 px-3 py-3 sm:grid-cols-[130px_1fr]">
            <strong className="text-xs">{format(day, "EEEE, MMM d")}</strong>
            <div className="space-y-1">
              {dayEvents.map((event) => {
                const color = findEventColor(event, currentUserId);
                const isMine = event.user.id === currentUserId;
                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => isMine ? onEdit(event) : onBook(event)}
                    className={`flex w-full items-center gap-3 rounded border px-2 py-1.5 text-left ${color.event}`}
                  >
                    <span className="text-[10px]">{displayTime(event.start)} - {displayTime(event.end)}</span>
                    <span className="truncate text-xs font-semibold">{event.title}</span>
                    <span className="text-[10px]">{isMine ? "You" : event.user.name ?? "Friend"} · {event.category} · {getAttendeeCount(event)}/{event.capacity}</span>
                    <span className="ml-auto hidden truncate text-[10px] opacity-70 sm:block">{event.location}</span>
                  </button>
                );
              })}
              {dayEvents.length === 0 && (
                <button type="button" disabled={dayKey < dateKey(new Date())} onClick={() => onCreate(day)} className="text-[11px] text-[#82899a] hover:text-[#b47c00] disabled:cursor-not-allowed disabled:opacity-40">
                  No slots · add one
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}