import { addDays, format, startOfWeek } from "date-fns";

export type CalendarView = "week" | "agenda";
export type MeetingCategory = string;
export type CalendarUser = { id: string; name?: string };

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  start: string;
  end: string;
  location: string;
  category: MeetingCategory;
  capacity: number;
  joinedCount: number;
  user: CalendarUser;
};

export const STORAGE_KEY = "weekmeet-calendar-events";
export const BOOKINGS_STORAGE_KEY = "weekmeet-calendar-bookings";
export const DEMO_CURRENT_USER_ID = "demo-current-user";
export const FIRST_HOUR = 1;
export const LAST_HOUR = 24;
export const HOUR_HEIGHT = 44;
export const HALF_HOUR_MINUTES = 30;
export const meetingCategories: MeetingCategory[] = ["Outdoor", "Fitness", "Culture", "Food & Drink", "Social"];
export const slotColors = {
  mine: { dot: "bg-[#efb92d]", event: "border-amber-300 bg-amber-100 text-amber-950" },
  friend: { dot: "bg-indigo-400", event: "border-indigo-200 bg-indigo-100 text-indigo-950" },
};

export const pad = (value: number) => String(value).padStart(2, "0");
export const dateKey = (date: Date) => format(date, "yyyy-MM-dd");

export function displayTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return `${hours % 12 || 12}:${pad(minutes)} ${hours < 12 ? "AM" : "PM"}`;
}

export function demoEvents(date: Date): CalendarEvent[] {
  const sunday = startOfWeek(date);
  return [
    { id: "sample-2", title: "Sunset Trail Run", date: dateKey(addDays(sunday, 3)), start: "18:00", end: "19:30", location: "Presidio", category: "Fitness", capacity: 1, joinedCount: 2, user: { id: "friend-liam", name: "Liam" } },
    { id: "sample-3", title: "Philosophy Reading", date: dateKey(addDays(sunday, 4)), start: "20:00", end: "21:30", location: "Workshop Cafe", category: "Culture", capacity: 1, joinedCount: 6, user: { id: "friend-priya", name: "Priya" } },
    { id: "sample-4", title: "Dinner Meet", date: dateKey(addDays(sunday, 5)), start: "19:00", end: "21:30", location: "Izakaya Rintaro", category: "Food & Drink", capacity: 1, joinedCount: 0, user: { id: "friend-mel", name: "Mel" } },
    { id: "sample-5", title: "Acoustic Jam & Drinks", date: dateKey(addDays(sunday, 6)), start: "21:00", end: "23:00", location: "Ocean Beach", category: "Social", capacity: 1, joinedCount: 0, user: { id: "friend-devon", name: "Devon" } },
  ];
}

export function isPastSlot(date: string, time: string) {
  const now = new Date();
  const today = dateKey(now);
  if (date < today) return true;
  if (date > today) return false;
  return time <= `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export function defaultStartTime(date: Date) {
  const today = new Date();
  const firstSlot = FIRST_HOUR * 60;
  const lastSlot = (LAST_HOUR * 60) - HALF_HOUR_MINUTES;
  const currentMinutes = today.getHours() * 60 + today.getMinutes();
  const roundedNow = Math.ceil((currentMinutes + 1) / HALF_HOUR_MINUTES) * HALF_HOUR_MINUTES;
  const startMinutes = dateKey(date) === dateKey(today)
    ? Math.max(firstSlot, roundedNow)
    : firstSlot + 60;
  if (startMinutes > lastSlot) return null;
  return `${pad(Math.floor(startMinutes / 60))}:${pad(startMinutes % 60)}`;
}

export function findEventColor(event: Pick<CalendarEvent, "user">, currentUserId: string) {
  return event.user.id === currentUserId ? slotColors.mine : slotColors.friend;
}

export function getAttendeeCount(event: CalendarEvent, bookedEventIds: string[]) {
  return event.joinedCount + (bookedEventIds.includes(event.id) ? 1 : 0);
}

export function normalizeStoredEvents(
  savedEvents: (Partial<CalendarEvent> & { owner?: string; isMine?: boolean })[],
  activeUserId: string,
): CalendarEvent[] {
  const sharedEvents = demoEvents(new Date());
  const sharedById = new Map(sharedEvents.map((event) => [event.id, event]));
  const normalizedEvents = savedEvents.map((event) => {
    const sharedEvent = sharedById.get(event.id ?? "");
    const { owner, isMine, ...storedEvent } = event;
    return {
      ...sharedEvent,
      ...storedEvent,
      category: event.category ?? sharedEvent?.category ?? "Social",
      capacity: event.capacity ?? sharedEvent?.capacity ?? 6,
      joinedCount: event.joinedCount ?? sharedEvent?.joinedCount ?? 1,
      user: event.user ?? sharedEvent?.user ?? {
        id: isMine ? activeUserId : "legacy-unknown-user",
        name: owner ?? "You",
      },
    };
  }) as CalendarEvent[];
  const eventIds = new Set(normalizedEvents.map((event) => event.id));
  return [...normalizedEvents, ...sharedEvents.filter((event) => !eventIds.has(event.id))];
}