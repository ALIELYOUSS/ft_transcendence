"use client";

import type { FormEventHandler } from "react";
import { Trash2, X } from "lucide-react";
import { dateKey, HALF_HOUR_MINUTES, meetingCategories } from "./calendar-utils";
import type { CalendarEvent } from "./calendar-utils";

type SlotDialogProps = {
  draft: CalendarEvent;
  isEditing: boolean;
  onDraftChange: (draft: CalendarEvent) => void;
  onClose: () => void;
  onSave: FormEventHandler<HTMLFormElement>;
  onDelete: () => void;
};

export function SlotDialog({ draft, isEditing, onDraftChange, onClose, onSave, onDelete }: SlotDialogProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <form role="dialog" aria-modal="true" aria-labelledby="slot-dialog-title" onSubmit={onSave} className="w-full max-w-sm rounded-lg bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 id="slot-dialog-title" className="text-base font-semibold">{isEditing ? "Edit slot" : "New slot"}</h2>
            <p className="text-xs text-[#767d8d]">Set the time and details.</p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="text-[#767d8d]"><X size={17} /></button>
        </div>
        <div className="space-y-3">
          <label className="block text-xs font-semibold">Title<input required maxLength={70} value={draft.title} onChange={(event) => onDraftChange({ ...draft, title: event.target.value })} className="mt-1 block h-9 w-full rounded border border-[#dfe3ed] px-2 text-sm font-normal outline-none focus:border-[#efb92d]" /></label>
          <label className="block text-xs font-semibold">Location<input maxLength={80} value={draft.location} onChange={(event) => onDraftChange({ ...draft, location: event.target.value })} className="mt-1 block h-9 w-full rounded border border-[#dfe3ed] px-2 text-sm font-normal outline-none focus:border-[#efb92d]" /></label>
          <label className="block text-xs font-semibold">Meeting purpose<select required value={draft.category} onChange={(event) => onDraftChange({ ...draft, category: event.target.value })} className="mt-1 block h-9 w-full rounded border border-[#dfe3ed] bg-white px-2 text-sm font-normal">{meetingCategories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
          <label className="block text-xs font-semibold">Maximum attendees<input required type="number" min="1" value={draft.capacity} onChange={(event) => onDraftChange({ ...draft, capacity: Math.max(1, Number(event.target.value) || 1) })} className="mt-1 block h-9 w-full rounded border border-[#dfe3ed] px-2 text-sm font-normal outline-none focus:border-[#efb92d]" /></label>
          <label className="block text-xs font-semibold">Date<input required type="date" min={dateKey(new Date())} value={draft.date} onChange={(event) => onDraftChange({ ...draft, date: event.target.value })} className="mt-1 block h-9 w-full rounded border border-[#dfe3ed] px-2 text-sm font-normal outline-none focus:border-[#efb92d]" /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-xs font-semibold">Start<input required type="time" min="01:00" max="23:00" step={HALF_HOUR_MINUTES * 60} value={draft.start} onChange={(event) => onDraftChange({ ...draft, start: event.target.value })} className="mt-1 block h-9 w-full rounded border border-[#dfe3ed] px-2 text-sm font-normal" /></label>
            <label className="block text-xs font-semibold">End<input required type="time" min={draft.start} max="23:00" step={HALF_HOUR_MINUTES * 60} value={draft.end} onChange={(event) => onDraftChange({ ...draft, end: event.target.value })} className="mt-1 block h-9 w-full rounded border border-[#dfe3ed] px-2 text-sm font-normal" /></label>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between">
          {isEditing ? <button type="button" onClick={onDelete} className="flex items-center gap-1 text-xs font-semibold text-rose-600"><Trash2 size={14} /> Delete</button> : <span />}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded border border-[#dfe3ed] px-3 py-2 text-xs">Cancel</button>
            <button type="submit" disabled={draft.end <= draft.start} className="rounded bg-[#efb92d] px-3 py-2 text-xs font-semibold disabled:opacity-50">{isEditing ? "Save" : "Create slot"}</button>
          </div>
        </div>
      </form>
    </div>
  );
}