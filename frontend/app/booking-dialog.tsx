"use client";

import { format } from "date-fns";
import { X } from "lucide-react";
import { displayTime, isPastSlot } from "./calendar-utils";
import type { CalendarEvent } from "./calendar-utils";

type BookingDialogProps = {
  event: CalendarEvent;
  attendeeCount: number;
  isBooked: boolean;
  onClose: () => void;
  onJoin: () => void;
  onLeave: () => void;
};

export function BookingDialog({ event, attendeeCount, isBooked, onClose, onJoin, onLeave }: BookingDialogProps) {
  const isFull = attendeeCount >= event.capacity;
  const isPast = isPastSlot(event.date, event.start);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4" onMouseDown={(mouseEvent) => { if (mouseEvent.target === mouseEvent.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="join-slot-title" className="w-full max-w-lg rounded-lg border border-[#ece5dc] bg-white p-6 text-[#252a37] shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-wide text-[#a87300]">Join a friend&apos;s slot</p>
            <h2 id="join-slot-title" className="text-base font-semibold">{event.title}</h2>
          </div>
          <button type="button" aria-label="Close join details" onClick={onClose} className="grid size-7 place-items-center rounded text-[#767d8d] hover:bg-[#f3f4f6]"><X size={16} /></button>
        </div>

        <dl className="grid grid-cols-[82px_1fr] gap-x-3 gap-y-2 rounded-md bg-[#f8f8f6] p-3 text-xs">
          <dt className="text-[#767d8d]">Host</dt><dd className="font-medium">{event.user.name ?? "Friend"}</dd>
          <dt className="text-[#767d8d]">Purpose</dt><dd className="font-medium">{event.category}</dd>
          <dt className="text-[#767d8d]">Date</dt><dd className="font-medium">{format(new Date(`${event.date}T00:00:00`), "EEE, MMM d, yyyy")}</dd>
          <dt className="text-[#767d8d]">Time</dt><dd className="font-medium">{displayTime(event.start)} – {displayTime(event.end)}</dd>
          <dt className="text-[#767d8d]">Location</dt><dd className="font-medium">{event.location || "Not specified"}</dd>
        </dl>

        <div className="mt-4 flex items-center justify-between rounded-md border border-[#ece5dc] px-3 py-2.5">
          <div>
            <p className="text-xs font-semibold">Attendees</p>
            <p className="mt-0.5 text-[10px] text-[#767d8d]">The host set this slot&apos;s capacity.</p>
          </div>
          <p className="text-sm font-bold">{attendeeCount} / {event.capacity}</p>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md border border-[#dfe3ed] px-3 py-2 text-xs font-medium hover:bg-[#f6f7fb]">Cancel</button>
          {isBooked ? (
            <button type="button" onClick={onLeave} className="rounded-md border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50">Leave slot</button>
          ) : (
            <button type="button" onClick={onJoin} disabled={isPast || isFull} className="rounded-md bg-[#efb92d] px-3 py-2 text-xs font-semibold text-[#282313] hover:bg-[#e7ad1d] disabled:cursor-not-allowed disabled:opacity-50">{isFull ? "Slot full" : "Join slot"}</button>
          )}
        </div>
      </section>
    </div>
  );
}