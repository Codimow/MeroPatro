"use client";

import { useEffect, useState } from "react";
import { Effect } from "effect";
import { CalendarLayout } from "@/components/calendar-layout";
import { CalendarHeader } from "@/components/calendar-header";
import { CalendarGrid } from "@/components/calendar-grid";
import { EventList } from "@/components/event-list";
import { DateService, DateServiceLive, BSDate } from "@/lib/date-service";

export default function Home() {
  const [currentDate, setCurrentDate] = useState<BSDate | null>(null);
  const [daysInMonth, setDaysInMonth] = useState(30);

  // Initialize with current date
  useEffect(() => {
    const program = Effect.gen(function* (_) {
      const service = yield* _(DateService);
      return yield* _(service.getCurrentBS);
    }).pipe(Effect.provide(DateServiceLive));

    const today = Effect.runSync(program);
    setCurrentDate(today);
  }, []);

  // Fetch days in month whenever date changes
  useEffect(() => {
    if (!currentDate) return;

    const program = Effect.gen(function* (_) {
      const service = yield* _(DateService);
      return yield* _(service.getDaysInMonth(currentDate.year, currentDate.month));
    }).pipe(Effect.provide(DateServiceLive));

    const dims = Effect.runSync(program);
    setDaysInMonth(dims);
  }, [currentDate?.year, currentDate?.month]);

  const handlePrevMonth = () => {
    if (!currentDate) return;
    let { year, month } = currentDate;
    if (month === 1) {
      year -= 1;
      month = 12;
    } else {
      month -= 1;
    }
    // Default to day 1 when switching months to avoid overflow issues logic
    setCurrentDate({ ...currentDate, year, month, day: 1 });
  };

  const handleNextMonth = () => {
    if (!currentDate) return;
    let { year, month } = currentDate;
    if (month === 12) {
      year += 1;
      month = 1;
    } else {
      month += 1;
    }
    setCurrentDate({ ...currentDate, year, month, day: 1 });
  };

  const handleToday = () => {
    const program = Effect.gen(function* (_) {
      const service = yield* _(DateService);
      return yield* _(service.getCurrentBS);
    }).pipe(Effect.provide(DateServiceLive));
    setCurrentDate(Effect.runSync(program));
  };

  if (!currentDate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground p-4">Loading MeroPatro...</div>
      </div>
    )
  }

  return (
    <CalendarLayout>
      <div className="flex flex-col lg:flex-row h-full">
        {/* Main Calendar Area */}
        <div className="flex-1 flex flex-col border-r border-border/50">
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />
          <CalendarGrid currentDate={currentDate} className="flex-1" />
        </div>

        {/* Sidebar / Event List */}
        <div className="w-full lg:w-96 bg-secondary/30 lg:h-auto border-t lg:border-t-0 bg-white/40 dark:bg-black/20 backdrop-blur-md">
          <EventList currentDate={currentDate} daysInMonth={daysInMonth} />
        </div>
      </div>
    </CalendarLayout>
  );
}
