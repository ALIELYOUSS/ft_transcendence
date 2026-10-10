import { cva } from "class-variance-authority";
import { format, differenceInMinutes, parseISO } from "date-fns";

import { useCalendar } from "@/calendar/contexts/calendar-context";

import { DraggableEvent } from "@/calendar/components/dnd/draggable-event";
import { EventDetailsDialog } from "@/calendar/components/dialogs/event-details-dialog";

import { cn } from "@/lib/utils";
import { WEEK_HOUR_HEIGHT } from "@/calendar/helpers";

import type { HTMLAttributes } from "react";
import type { IEvent } from "@/calendar/interfaces";
import type { VariantProps } from "class-variance-authority";

const calendarWeekEventCardVariants = cva(
  "flex select-none flex-col gap-0.5 truncate whitespace-nowrap rounded-md border px-1.5 py-1 text-[10px] leading-tight focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
  {
    variants: {
      color: {
        // Colored and mixed variants
        blue: "border-[#242c3d] bg-[#252d3d] text-white [&_.event-dot]:fill-[#ffbd2e]",
        green: "border-[#cfd8f5] bg-[#e1e7ff] text-[#35405f] [&_.event-dot]:fill-[#6076ca]",
        red: "border-[#f3daa0] bg-[#ffbd2e] text-[#302816] [&_.event-dot]:fill-[#8c6100]",
        yellow: "border-[#f3daa0] bg-[#ffbd2e] text-[#302816] [&_.event-dot]:fill-[#8c6100]",
        purple: "border-[#d8def3] bg-[#e5e9fa] text-[#39415b] [&_.event-dot]:fill-[#6979bb]",
        orange: "border-[#f3daa0] bg-[#ffbd2e] text-[#302816] [&_.event-dot]:fill-[#8c6100]",
        gray: "border-[#343c4d] bg-[#30394b] text-white [&_.event-dot]:fill-[#c5ccdc]",

        // Dot variants
        "blue-dot": "bg-[#252d3d] text-white [&_.event-dot]:fill-[#ffbd2e]",
        "green-dot": "bg-[#e1e7ff] text-[#35405f] [&_.event-dot]:fill-[#6076ca]",
        "red-dot": "bg-[#ffbd2e] text-[#302816] [&_.event-dot]:fill-[#8c6100]",
        "orange-dot": "bg-[#ffbd2e] text-[#302816] [&_.event-dot]:fill-[#8c6100]",
        "purple-dot": "bg-[#e5e9fa] text-[#39415b] [&_.event-dot]:fill-[#6979bb]",
        "yellow-dot": "bg-[#ffbd2e] text-[#302816] [&_.event-dot]:fill-[#8c6100]",
        "gray-dot": "bg-[#30394b] text-white [&_.event-dot]:fill-[#c5ccdc]",
      },
    },
    defaultVariants: {
      color: "blue-dot",
    },
  }
);

interface IProps extends HTMLAttributes<HTMLDivElement>, Omit<VariantProps<typeof calendarWeekEventCardVariants>, "color"> {
  event: IEvent;
}

export function EventBlock({ event, className }: IProps) {
  const { badgeVariant } = useCalendar();

  const start = parseISO(event.startDate);
  const end = parseISO(event.endDate);
  const durationInMinutes = differenceInMinutes(end, start);
  const heightInPixels = Math.max((durationInMinutes / 60) * WEEK_HOUR_HEIGHT - 4, 18);

  const color = (badgeVariant === "dot" ? `${event.color}-dot` : event.color) as VariantProps<typeof calendarWeekEventCardVariants>["color"];

  const calendarWeekEventCardClasses = cn(calendarWeekEventCardVariants({ color, className }), durationInMinutes < 35 && "py-0 justify-center");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (e.currentTarget instanceof HTMLElement) e.currentTarget.click();
    }
  };

  return (
    <DraggableEvent event={event}>
      <EventDetailsDialog event={event}>
        <div role="button" tabIndex={0} className={calendarWeekEventCardClasses} style={{ height: `${heightInPixels}px` }} onKeyDown={handleKeyDown}>
          <div className="flex items-center gap-1.5 truncate">
            {["mixed", "dot"].includes(badgeVariant) && (
              <svg width="8" height="8" viewBox="0 0 8 8" className="event-dot shrink-0">
                <circle cx="4" cy="4" r="4" />
              </svg>
            )}

            <p className="truncate font-semibold">{event.title}</p>
          </div>

          {durationInMinutes > 25 && (
            <p>
              {format(start, "h:mm a")} - {format(end, "h:mm a")}
            </p>
          )}
        </div>
      </EventDetailsDialog>
    </DraggableEvent>
  );
}
