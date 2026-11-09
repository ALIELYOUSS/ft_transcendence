"use client";

import { format } from "date-fns";
import {
  dateKey,
  displayTime,
  FIRST_HOUR,
  findEventColor,
  HALF_HOUR_MINUTES,
  HOUR_HEIGHT,
  isPastSlot,
  LAST_HOUR,
  pad,
} from "./calendar-utils";
import type { CalendarEvent } from "./calendar-utils";

type WeekCalendarViewProps = {
  days: Date[];
  events: CalendarEvent[];
  currentUserId: string;
  getAttendeeCount: (event: CalendarEvent) => number;
  onCreate: (date: Date, start?: string) => void;
  onEdit: (event: CalendarEvent) => void;
  onBook: (event: CalendarEvent) => void;
};

export function WeekCalendarView({ days, events, currentUserId, getAttendeeCount, onCreate, onEdit, onBook }: WeekCalendarViewProps) {
  const hours = Array.from({ length: LAST_HOUR - FIRST_HOUR }, (_, index) => FIRST_HOUR + index);
  const halfHourSlots = Array.from({ length: hours.length * 2 }, (_, index) => {
    const minutes = FIRST_HOUR * 60 + index * HALF_HOUR_MINUTES;
    return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
  });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-[58px_repeat(7,minmax(0,1fr))] border-b border-[#edf0f5]">
          <div />
          {days.map((day) => {
            const isToday = dateKey(day) === dateKey(new Date());
            return (
              <div key={dateKey(day)} className={`border-l border-[#edf0f5] py-2 text-center ${isToday ? "bg-[#fff4d5]" : ""}`}>
                <div className="text-[9px] font-bold uppercase text-[#82899a]">{format(day, "EEE")}</div>
                <div className={`mx-auto mt-1 grid size-7 place-items-center rounded-full text-xs font-semibold ${isToday ? "bg-[#efb92d] text-[#282313]" : "text-[#343b4b]"}`}>{format(day, "dd")}</div>
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-[58px_repeat(7,minmax(0,1fr))]">
          <div>
            {hours.map((hour) => (
              <div key={hour} style={{ height: HOUR_HEIGHT }} className="relative border-b border-[#edf0f5] pr-2 text-right text-[9px] text-[#82899a]">
                <span className="absolute -top-1.5 right-2">{displayTime(`${pad(hour)}:00`)}</span>
              </div>
            ))}
          </div>
          {days.map((day) => {
            const dayKey = dateKey(day);
            return (
              <div key={dayKey} style={{ height: hours.length * HOUR_HEIGHT }} className={`relative border-l border-[#edf0f5] ${dayKey === dateKey(new Date()) ? "bg-[#fffdf7]" : ""}`}>
                {halfHourSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    disabled={isPastSlot(dayKey, time)}
                    aria-label={`Add slot ${format(day, "EEE, MMM d")} at ${displayTime(time)}`}
                    onClick={() => onCreate(day, time)}
                    style={{ height: HOUR_HEIGHT / 2 }}
                    className={`block w-full border-b hover:bg-[#fff9e9] disabled:cursor-not-allowed disabled:bg-[#f8f8f8] ${time.endsWith(":00") ? "border-[#e5e8ef]" : "border-[#f1f2f5]"}`}
                  />
                ))}
                {events.filter((event) => event.date === dayKey).map((event) => {
                  const [startHour, startMinute] = event.start.split(":").map(Number);
                  const [endHour, endMinute] = event.end.split(":").map(Number);
                  const top = ((startHour + startMinute / 60) - FIRST_HOUR) * HOUR_HEIGHT;
                  const height = Math.max(34, ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * HOUR_HEIGHT - 3);
                  const color = findEventColor(event, currentUserId);
                  const isMine = event.user.id === currentUserId;
                  const details = (
                    <>
                      <span className="block truncate text-[10px] font-bold">{event.title}</span>
                      <span className="block truncate text-[9px]">{displayTime(event.start)} - {displayTime(event.end)}</span>
                      <span className="block truncate text-[8px]">{isMine ? "You" : event.user.name ?? "Friend"} · {event.category} · {getAttendeeCount(event)}/{event.capacity}</span>
                      {event.location && <span className="block truncate text-[9px] opacity-70">{event.location}</span>}
                    </>
                  );
                  return (
                    <button
                      key={event.id}
                      type="button"
                      aria-label={isMine ? undefined : `View ${event.title} hosted by ${event.user.name ?? "friend"}`}
                      onClick={() => isMine ? onEdit(event) : onBook(event)}
                      style={{ top, height }}
                      className={`absolute left-1 right-1 z-10 overflow-hidden rounded-md border p-1.5 text-left ${color.event}`}
                    >
                      {details}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}