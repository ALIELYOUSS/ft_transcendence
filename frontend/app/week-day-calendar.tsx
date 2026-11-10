"use client";

import { addDays, addWeeks, format, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";
import { AgendaCalendarView } from "./agenda-calendar-view";
import { CalendarHeader } from "./calendar-header";
import { getAttendeeCount as countAttendees } from "./calendar-utils";
import type { CalendarEvent, CalendarView } from "./calendar-utils";
import { getCalendarSlots } from "./calendar-api";
import { WeekCalendarView } from "./week-calendar-view";

const EMPTY_USER_ID = "";

export function WeekDayCalendar() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentUserId, setCurrentUserId] = useState(EMPTY_USER_ID);
  const [view, setView] = useState<CalendarView>("week");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getCalendarSlots()
      .then((result) => {
        if (!active) return;
        setCurrentUserId(result.currentUserId);
        setEvents(result.events);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load slots");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const weekStart = startOfWeek(selectedDate);
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const periodLabel = `${format(days[0], "MMM d")} – ${format(days[6], "MMM d, yyyy")}`;
  const attendeeCount = (event: CalendarEvent) => countAttendees(event);

  return (
    <>
      {error && <p role="alert" className="mb-3 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}
      {isLoading && <p role="status" className="mb-3 text-xs text-[#767d8d]">Loading slots...</p>}
      <CalendarHeader
        selectedDate={selectedDate}
        periodLabel={periodLabel}
        view={view}
        onToday={() => setSelectedDate(new Date())}
        onShift={(amount) => setSelectedDate((current) => addWeeks(current, amount))}
        onViewChange={setView}
      />
      {view === "week" ? (
        <WeekCalendarView
          days={days}
          events={events}
          currentUserId={currentUserId}
          getAttendeeCount={attendeeCount}
        />
      ) : (
        <AgendaCalendarView
          days={days}
          events={events}
          currentUserId={currentUserId}
          getAttendeeCount={attendeeCount}
        />
      )}
    </>
  );
}