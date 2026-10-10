"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays, endOfWeek, format, getISOWeek, isSameDay, parseISO, startOfWeek } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { z } from "zod";

import { AddEventDialog } from "@/calendar/components/dialogs/add-event-dialog";
import { DndProviderWrapper } from "@/calendar/components/dnd/dnd-provider";
import { CalendarWeekView } from "@/calendar/components/week-and-day-view/calendar-week-view";
import { CalendarProvider, useCalendar } from "@/calendar/contexts/calendar-context";

import type { IEvent, IUser } from "@/calendar/interfaces";

const STORAGE_KEY = "frontend.calendar.events.v1";
const storedEventsSchema = z.array(
  z.object({
    id: z.number(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    title: z.string(),
    color: z.enum(["blue", "green", "red", "yellow", "purple", "orange", "gray"]),
    description: z.string(),
    user: z.object({
      id: z.string(),
      name: z.string(),
      picturePath: z.string().nullable(),
    }),
  })
);

function WeekDayCalendarContent() {
  const { selectedDate, setSelectedDate, events } = useCalendar();
  const weekStart = useMemo(() => startOfWeek(selectedDate), [selectedDate]);
  const weekEnd = useMemo(() => endOfWeek(selectedDate), [selectedDate]);

  const visibleEvents = useMemo(
    () =>
      events.filter(event => {
        const eventStart = parseISO(event.startDate);
        const eventEnd = parseISO(event.endDate);
        return eventStart <= weekEnd && eventEnd >= weekStart;
      }),
    [events, weekEnd, weekStart]
  );

  const singleDayEvents = visibleEvents.filter(event => isSameDay(parseISO(event.startDate), parseISO(event.endDate)));
  const multiDayEvents = visibleEvents.filter(event => !isSameDay(parseISO(event.startDate), parseISO(event.endDate)));
  const periodLabel = `${format(weekStart, "MMM d")} – ${format(weekEnd, "MMM d, yyyy")}`;

  const shiftDate = (amount: number) => setSelectedDate(addDays(selectedDate, amount));

  return (
    <main className="mx-auto flex w-full max-w-screen-2xl flex-col gap-3 px-2 py-3 sm:px-3">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-[#eef1f5] text-[#d99d00]">
            <CalendarDays className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-[#252a37]">Weekly Meet Slots</h1>
              <span className="rounded bg-[#eef1f5] px-1.5 py-0.5 text-[9px] font-bold text-[#586071]">W{getISOWeek(selectedDate)}</span>
            </div>
            <p className="text-[10px] text-[#767d8d]">{periodLabel}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button type="button" className="rounded-md border border-[#dfe3ed] px-3 py-2 text-xs font-medium text-[#3a4253] hover:bg-[#f6f7fb]" onClick={() => setSelectedDate(new Date())}>
            Today
          </button>
          <button type="button" aria-label="Previous week" className="rounded-md border border-[#dfe3ed] px-3 py-2 text-[#3a4253] hover:bg-[#f6f7fb]" onClick={() => shiftDate(-7)}>
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" aria-label="Next week" className="rounded-md border border-[#dfe3ed] px-3 py-2 text-[#3a4253] hover:bg-[#f6f7fb]" onClick={() => shiftDate(7)}>
            <ChevronRight className="size-4" />
          </button>
          <AddEventDialog startDate={selectedDate}>
            <button type="button" className="flex items-center gap-1 rounded-md bg-[#efb92d] px-3 py-2 text-xs font-semibold text-[#282313] hover:bg-[#e7ad1d]">
              <Plus className="size-3.5" /> New Slot
            </button>
          </AddEventDialog>
        </div>
      </header>

      <section id="week-calendar" className="overflow-hidden rounded-xl border border-[#ece5dc] bg-white">
        <DndProviderWrapper>
          <CalendarWeekView singleDayEvents={singleDayEvents} multiDayEvents={multiDayEvents} />
        </DndProviderWrapper>
      </section>
    </main>
  );
}

function PersistCalendarEvents({ onError }: { onError: (message: string | null) => void }) {
  const { events } = useCalendar();

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      onError(null);
    } catch (error) {
      onError(`Could not save bookings in this browser: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [events, onError]);

  return null;
}

export function WeekDayCalendar() {
  const [calendarData, setCalendarData] = useState<{ events: IEvent[]; users: IUser[] } | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    import("@/calendar/mocks")
      .then(({ CALENDAR_ITEMS_MOCK, USERS_MOCK }) => {
        const savedEvents = window.localStorage.getItem(STORAGE_KEY);
        const parsedEvents = savedEvents === null ? null : storedEventsSchema.safeParse(JSON.parse(savedEvents));

        if (parsedEvents && !parsedEvents.success) {
          throw new Error("Saved bookings have an invalid format. Clear this site's local storage to reset the calendar.");
        }

        if (isMounted) {
          setCalendarData({
            events: parsedEvents?.success ? parsedEvents.data : CALENDAR_ITEMS_MOCK,
            users: USERS_MOCK,
          });
        }
      })
      .catch(error => {
        if (isMounted) setStorageError(`Could not load saved bookings: ${error instanceof Error ? error.message : String(error)}`);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (!calendarData) {
    if (storageError) return <p className="p-6 text-sm text-destructive">{storageError}</p>;
    return <p className="p-6 text-sm text-muted-foreground">Loading calendar…</p>;
  }

  return (
    <CalendarProvider events={calendarData.events} users={calendarData.users}>
      <PersistCalendarEvents onError={setStorageError} />
      {storageError && <p role="alert" className="px-2 pb-2 text-sm text-destructive">{storageError}</p>}
      <WeekDayCalendarContent />
    </CalendarProvider>
  );
}

