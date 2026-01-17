"use client";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { CalendarLayout } from "@/components/calendar-layout";
import { CalendarHeader } from "@/components/calendar-header";
import { CalendarGrid } from "@/components/calendar-grid";
import { EventList } from "@/components/event-list";
import { EventDialog } from "@/components/event-dialog";
import { DateService, BSDate } from "@/lib/date-service";

export default function Home() {
  const [currentDate, setCurrentDate] = useState<BSDate | null>(null);
  const [daysInMonth, setDaysInMonth] = useState(30);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // Simple event refresh trigger
  const [eventRefreshKey, setEventRefreshKey] = useState(0);

  // Initialize with current date
  useEffect(() => {
    const today = DateService.getCurrentBS();
    setCurrentDate(today);
  }, []);

  // Fetch days in month whenever date changes
  useEffect(() => {
    if (!currentDate) return;
    const dims = DateService.getDaysInMonth(currentDate.year, currentDate.month);
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
    setCurrentDate(DateService.getCurrentBS());
  };

  const handleSaveEvent = (event: { title: string; date: string; description: string }) => {
    const existing = JSON.parse(localStorage.getItem("user_events") || "[]");
    const newEvents = [...existing, { ...event, id: Date.now() }];
    localStorage.setItem("user_events", JSON.stringify(newEvents));
    setEventRefreshKey(k => k + 1); // Trigger re-render if components listen to it
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
        <div className="flex-1 flex flex-col relative">
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
          />
          <CalendarGrid currentDate={currentDate} className="flex-1" key={eventRefreshKey} />

          {/* Floating Action Button */}
          <button
            onClick={() => setIsDialogOpen(true)}
            className="absolute bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md z-30"
            aria-label="Add Event"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar / Event List */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-muted/10">
          <EventList currentDate={currentDate} daysInMonth={daysInMonth} key={`list-${eventRefreshKey}`} />
        </div>
      </div>

      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        currentDate={currentDate}
        onSave={handleSaveEvent}
      />
    </CalendarLayout>
  );
}

