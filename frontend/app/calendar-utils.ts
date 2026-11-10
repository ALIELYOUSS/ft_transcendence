import { format } from "date-fns";

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

export function getAttendeeCount(event: CalendarEvent) {
  return event.joinedCount;
}