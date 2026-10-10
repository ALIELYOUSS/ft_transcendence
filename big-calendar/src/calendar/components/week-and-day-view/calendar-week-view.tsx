import { startOfWeek, addDays, format, parseISO, isSameDay, areIntervalsOverlapping } from "date-fns";

import { useCalendar } from "@/calendar/contexts/calendar-context";

import { ScrollArea } from "@/components/ui/scroll-area";

import { AddEventDialog } from "@/calendar/components/dialogs/add-event-dialog";
import { EventBlock } from "@/calendar/components/week-and-day-view/event-block";
import { DroppableTimeBlock } from "@/calendar/components/dnd/droppable-time-block";
import { CalendarTimeline } from "@/calendar/components/week-and-day-view/calendar-time-line";
import { WeekViewMultiDayEventsRow } from "@/calendar/components/week-and-day-view/week-view-multi-day-events-row";

import { cn } from "@/lib/utils";
import { groupEvents, getEventBlockStyle, isWorkingHour, getVisibleHours, WEEK_HOUR_HEIGHT } from "@/calendar/helpers";

import type { IEvent } from "@/calendar/interfaces";

interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

export function CalendarWeekView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate, workingHours, visibleHours } = useCalendar();

  const { hours, earliestEventHour, latestEventHour } = getVisibleHours(visibleHours, singleDayEvents);

  const weekStart = startOfWeek(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const today = new Date();
  const quarterHeight = WEEK_HOUR_HEIGHT / 4;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[700px]">
        <div>
          <WeekViewMultiDayEventsRow selectedDate={selectedDate} multiDayEvents={multiDayEvents} />

          {/* Week header */}
          <div className="relative z-20 flex border-b border-[#eef0f5]">
            <div className="w-12 shrink-0"></div>
            <div className="grid flex-1 grid-cols-7 divide-x divide-[#eef0f5] border-l border-[#eef0f5]">
              {weekDays.map(day => (
                <div key={day.toISOString()} className="px-1 text-center">
                  <span className={cn("my-1.5 flex min-h-9 flex-col items-center justify-center rounded-lg text-[9px] font-semibold uppercase text-[#707789]", isSameDay(day, today) ? "bg-[#fff0ce]" : "bg-[#f6f7fb]")}>
                    {format(day, "EEE")}
                    <span className={cn("text-[11px] font-bold", isSameDay(day, today) ? "text-[#946b00]" : "text-[#303646]")}>{format(day, "MM/dd")}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ScrollArea className="h-[320px]" type="auto">
          <div className="flex overflow-hidden">
            {/* Hours column */}
            <div className="relative w-12 shrink-0">
              {hours.map((hour, index) => (
                <div key={hour} className="relative" style={{ height: `${WEEK_HOUR_HEIGHT}px` }}>
                  <div className="absolute -top-2 right-1 flex h-4 items-center">
                    {index !== 0 && <span className="text-[8px] text-[#83899a]">{format(new Date().setHours(hour, 0, 0, 0), "hh:mm a")}</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Week grid */}
            <div className="relative flex-1 border-l border-[#eef0f5]">
              <div className="grid grid-cols-7 divide-x divide-[#eef0f5]">
                {weekDays.map((day, dayIndex) => {
                  const dayEvents = singleDayEvents.filter(event => isSameDay(parseISO(event.startDate), day) || isSameDay(parseISO(event.endDate), day));
                  const groupedEvents = groupEvents(dayEvents);

                  return (
                    <div key={dayIndex} className={cn("relative", isSameDay(day, today) ? "bg-[#fffaf0]" : "bg-[#f8f9fd]")}>
                      {hours.map((hour, index) => {
                        const isDisabled = !isWorkingHour(day, hour, workingHours);

                        return (
                          <div key={hour} className={cn("relative", isDisabled && "bg-calendar-disabled-hour")} style={{ height: `${WEEK_HOUR_HEIGHT}px` }}>
                            {index !== 0 && <div className="pointer-events-none absolute inset-x-0 top-0 border-b border-[#e7eaf1]"></div>}
                            <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed border-[#e2e5ed]"></div>

                            {[0, 1, 2, 3].map(quarter => (
                              <DroppableTimeBlock key={quarter} date={day} hour={hour} minute={quarter * 15}>
                                <AddEventDialog startDate={day} startTime={{ hour, minute: quarter * 15 }}>
                                  <div className="absolute inset-x-0 cursor-pointer transition-colors hover:bg-[#ffe9ad]/70" style={{ top: `${quarter * quarterHeight}px`, height: `${quarterHeight}px` }} />
                                </AddEventDialog>
                              </DroppableTimeBlock>
                            ))}
                          </div>
                        );
                      })}

                      {groupedEvents.map((group, groupIndex) =>
                        group.map(event => {
                          let style = getEventBlockStyle(event, day, groupIndex, groupedEvents.length, { from: earliestEventHour, to: latestEventHour });
                          const hasOverlap = groupedEvents.some(
                            (otherGroup, otherIndex) =>
                              otherIndex !== groupIndex &&
                              otherGroup.some(otherEvent =>
                                areIntervalsOverlapping(
                                  { start: parseISO(event.startDate), end: parseISO(event.endDate) },
                                  { start: parseISO(otherEvent.startDate), end: parseISO(otherEvent.endDate) }
                                )
                              )
                          );

                          if (!hasOverlap) style = { ...style, width: "100%", left: "0%" };

                          return (
                            <div key={event.id} className="absolute p-1" style={style}>
                              <EventBlock event={event} />
                            </div>
                          );
                        })
                      )}
                    </div>
                  );
                })}
              </div>

              <CalendarTimeline firstVisibleHour={earliestEventHour} lastVisibleHour={latestEventHour} />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
