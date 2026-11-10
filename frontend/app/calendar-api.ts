import type { CalendarEvent } from "./calendar-utils";

type ApiSlot = {
  id: string;
  title: string;
  location: string;
  category: string;
  startAt: string;
  endAt: string;
  capacityTarget: number;
  attendeeCount: number;
  host: {
    id: string;
    name?: string | null;
    username?: string | null;
  };
};

type SlotsResponse = {
  currentUserId: string;
  slots: ApiSlot[];
};

const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001").replace(/\/+$/, "");

async function requestSlots() {
  const response = await fetch(`${apiBaseUrl}/slots`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Backend request failed (${response.status} ${response.statusText})`);
  }

  return response.json() as Promise<SlotsResponse>;
}

function toCalendarEvent(slot: ApiSlot): CalendarEvent {
  const start = new Date(slot.startAt);
  const end = new Date(slot.endAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error(`Slot "${slot.id}" has an invalid start or end date`);
  }

  const toTime = (date: Date) => `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  return {
    id: slot.id,
    title: slot.title,
    date: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`,
    start: toTime(start),
    end: toTime(end),
    location: slot.location,
    category: slot.category,
    capacity: slot.capacityTarget,
    joinedCount: slot.attendeeCount,
    user: {
      id: slot.host.id,
      name: slot.host.name ?? slot.host.username ?? undefined,
    },
  };
}

export async function getCalendarSlots(): Promise<{ currentUserId: string; events: CalendarEvent[] }> {
  const data = await requestSlots();

  if (!data || typeof data.currentUserId !== "string" || !Array.isArray(data.slots)) {
    throw new Error("The slots response must include currentUserId and a slots array");
  }

  return {
    currentUserId: data.currentUserId,
    events: data.slots.map(toCalendarEvent),
  };
}
