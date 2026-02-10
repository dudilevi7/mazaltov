"use client";

import MazalTovCalendar from "@/components/Calendar";
import { CalendarProvider } from "@/context/CalendarContext";

const CalendarPage = () => {
  return (
    <CalendarProvider>
      <MazalTovCalendar />
    </CalendarProvider>
  );
};

export default CalendarPage;

