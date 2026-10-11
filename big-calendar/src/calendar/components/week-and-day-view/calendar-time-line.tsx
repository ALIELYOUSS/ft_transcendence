import { format } from "date-fns";
import { useEffect, useState } from "react";

interface IProps {
  firstVisibleHour: number;
  lastVisibleHour: number;
}

export function CalendarTimeline({ firstVisibleHour, lastVisibleHour }: IProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentTimePosition = () => {
    const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    const visibleStartMinutes = firstVisibleHour * 60;
    const visibleEndMinutes = lastVisibleHour * 60;
    const visibleRangeMinutes = visibleEndMinutes - visibleStartMinutes;

    return ((minutes - visibleStartMinutes) / visibleRangeMinutes) * 100;
  };

}
