import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { BSDate, DateService } from "@/lib/date-service";
import { getHoliday } from "@/lib/holidays";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_OF_WEEK_NEPALI = ["आइत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"];

interface CalendarGridProps {
    currentDate: BSDate;
    className?: string;
}

export function CalendarGrid({ currentDate, className }: CalendarGridProps) {
    const [startDayIndex, setStartDayIndex] = useState<number>(0);
    const [days, setDays] = useState<{ day: number; bsDate: BSDate; adDate: Date | null; holiday: string | null; eventCount: number; isToday: boolean }[]>([]);

    useEffect(() => {
        const dims = DateService.getDaysInMonth(currentDate.year, currentDate.month);
        const firstDay = DateService.getFirstDayOfMonth(currentDate.year, currentDate.month);
        const todayBS = DateService.getCurrentBS();

        setStartDayIndex(firstDay);

        // Fetch User Events
        const userEventsRaw = localStorage.getItem("user_events");
        const userEvents = userEventsRaw ? JSON.parse(userEventsRaw) : [];

        // Generate days data
        const generatedDays = [];
        for (let i = 1; i <= dims; i++) {
            const bsDate = { ...currentDate, day: i, dayOfWeek: (firstDay + i - 1) % 7 };
            const holiday = getHoliday(bsDate);

            // Check for user events
            const dateKey = `${bsDate.year}-${bsDate.month}-${bsDate.day}`;
            const todaysEvents = userEvents.filter((e: any) => e.date === dateKey);

            // Check if today
            const isToday = todayBS.year === bsDate.year &&
                todayBS.month === bsDate.month &&
                todayBS.day === bsDate.day;

            const adDate = DateService.toAD(bsDate);
            generatedDays.push({ day: i, bsDate, adDate, holiday, eventCount: todaysEvents.length, isToday });
        }
        setDays(generatedDays);

    }, [currentDate.year, currentDate.month]);

    return (
        <div className={cn("p-2 sm:p-4 overflow-y-auto scrollbar-hide", className)}>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-2 sticky top-0 bg-background z-20 pb-2 border-b border-border">
                {DAYS_OF_WEEK.map((day, i) => (
                    <div key={day} className="text-center">
                        <div className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            {day}
                        </div>
                        <div className="text-[10px] text-muted-foreground/60 hidden sm:block">
                            {DAYS_OF_WEEK_NEPALI[i]}
                        </div>
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 auto-rows-fr">
                {/* Empty cells */}
                {Array.from({ length: startDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[60px] sm:min-h-[80px]" />
                ))}

                {days.map(({ day, bsDate, adDate, holiday, eventCount, isToday }) => {
                    const isSat = bsDate.dayOfWeek === 6;
                    const hasEvent = !!holiday;
                    const hasUserEvent = eventCount > 0;

                    return (
                        <div
                            key={day}
                            className={cn(
                                "relative min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 flex flex-col justify-between transition-colors border rounded-md",
                                "border-transparent hover:bg-muted/50 hover:border-border",
                                isToday
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : (isSat || hasEvent)
                                        ? "text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20"
                                        : "bg-card text-card-foreground"
                            )}
                        >
                            {/* Top Row: Date & AD Date */}
                            <div className="flex justify-between items-start">
                                <span className={cn(
                                    "text-sm sm:text-lg font-bold font-sans",
                                )}>
                                    {day}
                                </span>
                                {adDate && (
                                    <span className={cn(
                                        "text-[9px] sm:text-[10px] font-mono opacity-70",
                                        isToday ? "text-primary-foreground" : "text-muted-foreground"
                                    )}>
                                        {adDate.getDate()}
                                    </span>
                                )}
                            </div>


                            {/* Bottom Row: Event Indicator */}
                            {(hasEvent || hasUserEvent) && (
                                <div className="mt-1 flex flex-col gap-0.5">
                                    {hasUserEvent && (
                                        <div className="flex gap-1 items-center">
                                            <div className={cn("w-1 h-1 rounded-full bg-blue-500", isToday && "bg-blue-300")} />
                                        </div>
                                    )}

                                    {hasEvent && (
                                        <p className={cn(
                                            "text-[8px] sm:text-[9px] leading-tight line-clamp-1 truncate font-medium",
                                            isToday ? "text-primary-foreground/90" : "text-muted-foreground"
                                        )}>
                                            {holiday}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
