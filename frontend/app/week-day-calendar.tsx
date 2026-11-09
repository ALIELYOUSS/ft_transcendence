"use client";

import { addDays, addWeeks, format, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";
import { AgendaCalendarView } from "./agenda-calendar-view";
import { BookingDialog } from "./booking-dialog";
import { CalendarHeader } from "./calendar-header";
import {
  BOOKINGS_STORAGE_KEY,
  dateKey,
  defaultStartTime,
  DEMO_CURRENT_USER_ID,
  demoEvents,
  getAttendeeCount as countAttendees,
  normalizeStoredEvents,
  STORAGE_KEY,
} from "./calendar-utils";
import type { CalendarEvent, CalendarView } from "./calendar-utils";
import { SlotDialog } from "./slot-dialog";
import { WeekCalendarView } from "./week-calendar-view";

const emptyDraft = (date: Date, start: string): CalendarEvent => {
  const [hours, minutes] = start.split(":").map(Number);
  const endMinutes = hours * 60 + minutes + 60;
  const end = `${String(Math.floor(endMinutes / 60)).padStart(2, "0")}:${String(endMinutes % 60).padStart(2, "0")}`;

  return {
    id: "",
    title: "",
    date: dateKey(date),
    start,
    end,
    location: "",
    category: "Social",
    capacity: 6,
    joinedCount: 1,
    user: { id: DEMO_CURRENT_USER_ID, name: "You" },
  };
};

export function WeekDayCalendar() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [events, setEvents] = useState(() => demoEvents(new Date()));
  const [bookedEventIds, setBookedEventIds] = useState<string[]>([]);
  const [view, setView] = useState<CalendarView>("week");
  const [draft, setDraft] = useState<CalendarEvent | null>(null);
  const [bookingEvent, setBookingEvent] = useState<CalendarEvent | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem(STORAGE_KEY);
      const savedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (savedEvents) {
        setEvents(normalizeStoredEvents(JSON.parse(savedEvents), DEMO_CURRENT_USER_ID));
      }
      if (savedBookings) {
        setBookedEventIds(JSON.parse(savedBookings));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(BOOKINGS_STORAGE_KEY);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookedEventIds));
  }, [bookedEventIds, events, isHydrated]);

  const weekStart = startOfWeek(selectedDate);
  const days = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const periodLabel = `${format(days[0], "MMM d")} – ${format(days[6], "MMM d, yyyy")}`;
  const attendeeCount = (event: CalendarEvent) => countAttendees(event, bookedEventIds);

  const openNewSlot = (date: Date, start?: string) => {
    const startTime = start ?? defaultStartTime(date);
    if (startTime) setDraft(emptyDraft(date, startTime));
  };

  const saveSlot = (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    if (!draft || draft.end <= draft.start) return;

    if (draft.id) {
      setEvents((current) => current.map((event) => event.id === draft.id ? draft : event));
    } else {
      setEvents((current) => [...current, { ...draft, id: crypto.randomUUID() }]);
    }
    setDraft(null);
  };

  const deleteSlot = () => {
    if (!draft) return;
    setEvents((current) => current.filter((event) => event.id !== draft.id));
    setDraft(null);
  };

  const joinSlot = () => {
    if (!bookingEvent || attendeeCount(bookingEvent) >= bookingEvent.capacity) return;
    setBookedEventIds((current) => current.includes(bookingEvent.id) ? current : [...current, bookingEvent.id]);
    setBookingEvent(null);
  };

  const leaveSlot = () => {
    if (!bookingEvent) return;
    setBookedEventIds((current) => current.filter((id) => id !== bookingEvent.id));
    setBookingEvent(null);
  };

  const canCreate = days.some((day) => defaultStartTime(day) !== null);

  return (
    <>
      <CalendarHeader
        selectedDate={selectedDate}
        periodLabel={periodLabel}
        view={view}
        canCreate={canCreate}
        onToday={() => setSelectedDate(new Date())}
        onShift={(amount) => setSelectedDate((current) => addWeeks(current, amount))}
        onViewChange={setView}
        onCreate={() => openNewSlot(selectedDate)}
      />
      {view === "week" ? (
        <WeekCalendarView
          days={days}
          events={events}
          currentUserId={DEMO_CURRENT_USER_ID}
          getAttendeeCount={attendeeCount}
          onCreate={openNewSlot}
          onEdit={setDraft}
          onBook={setBookingEvent}
        />
      ) : (
        <AgendaCalendarView
          days={days}
          events={events}
          currentUserId={DEMO_CURRENT_USER_ID}
          getAttendeeCount={attendeeCount}
          onCreate={(date) => openNewSlot(date)}
          onEdit={setDraft}
          onBook={setBookingEvent}
        />
      )}
      {draft && (
        <SlotDialog
          draft={draft}
          isEditing={Boolean(draft.id)}
          onDraftChange={setDraft}
          onClose={() => setDraft(null)}
          onSave={saveSlot}
          onDelete={deleteSlot}
        />
      )}
      {bookingEvent && (
        <BookingDialog
          event={bookingEvent}
          attendeeCount={attendeeCount(bookingEvent)}
          isBooked={bookedEventIds.includes(bookingEvent.id)}
          onClose={() => setBookingEvent(null)}
          onJoin={joinSlot}
          onLeave={leaveSlot}
        />
      )}
    </>
  );
}