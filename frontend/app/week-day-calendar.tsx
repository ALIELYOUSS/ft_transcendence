"use client";

import { useEffect, useMemo, useState } from "react";
import { addDays, endOfWeek, format, isSameDay, parseISO, startOfWeek } from "date-fns";
import { z } from "zod";

import { CalendarWeekView } from "@/calendar/components/week-and-day-view/calendar-week-view";
import { DndProviderWrapper } from "@/calendar/components/dnd/dnd-provider";
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

  const visibleEvents = useMemo(() => {
    const rangeStart = startOfWeek(selectedDate);
    const rangeEnd = endOfWeek(selectedDate);

    return events.filter(event => {
      const eventStart = parseISO(event.startDate);
      const eventEnd = parseISO(event.endDate);
      return eventStart <= rangeEnd && eventEnd >= rangeStart;
    });
  }, [events, selectedDate]);

  const singleDayEvents = visibleEvents.filter(event => isSameDay(parseISO(event.startDate), parseISO(event.endDate)));
  const multiDayEvents = visibleEvents.filter(event => !isSameDay(parseISO(event.startDate), parseISO(event.endDate)));

  const periodLabel = `${format(startOfWeek(selectedDate), "MMM d")} – ${format(endOfWeek(selectedDate), "MMM d, yyyy")}`;

  const shiftDate = (amount: number) => {
    setSelectedDate(addDays(selectedDate, amount));
  };

  return (
    <main className="mx-auto flex w-full max-w-screen-2xl flex-col gap-4 px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent"
            onClick={() => setSelectedDate(new Date())}
          >
            Today
          </button>
          <button
            type="button"
            aria-label="Previous date range"
            className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"
            onClick={() => shiftDate(-7)}
          >
            Previous
          </button>
          <button
            type="button"
            aria-label="Next date range"
            className="rounded-md border border-border px-3 py-2 text-sm hover:bg-accent"
            onClick={() => shiftDate(7)}
          >
            Next
          </button>
          <h1 className="ml-1 text-lg font-semibold">{periodLabel}</h1>
        </div>

      </header>

      <section className="overflow-hidden rounded-xl border border-border bg-background">
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
      {storageError && <p role="alert" className="mx-auto w-full max-w-screen-2xl px-4 pt-4 text-sm text-destructive">{storageError}</p>}
      <WeekDayCalendarContent />
    </CalendarProvider>
  );
}
