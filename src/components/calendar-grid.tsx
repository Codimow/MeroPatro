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

        const userEventsRaw = localStorage.getItem("user_events");
        const userEvents = userEventsRaw ? JSON.parse(userEventsRaw) : [];

        const generatedDays = [];
        for (let i = 1; i <= dims; i++) {
            const bsDate = { ...currentDate, day: i, dayOfWeek: (firstDay + i - 1) % 7 };
            const holiday = getHoliday(bsDate);

            const dateKey = `${bsDate.year}-${bsDate.month}-${bsDate.day}`;
            const todaysEvents = userEvents.filter((e: any) => e.date === dateKey);

            const isToday = todayBS.year === bsDate.year &&
                todayBS.month === bsDate.month &&
                todayBS.day === bsDate.day;

            const adDate = DateService.toAD(bsDate);
            generatedDays.push({ day: i, bsDate, adDate, holiday, eventCount: todaysEvents.length, isToday });
        }
        setDays(generatedDays);

    }, [currentDate.year, currentDate.month]);

    return (
        <div className={cn("p-3 sm:p-4 lg:p-6 overflow-y-auto custom-scrollbar", className)}>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-3 sticky top-0 bg-card/80 backdrop-blur-sm z-20 pb-3 border-b border-border/30">
                {DAYS_OF_WEEK.map((day, i) => (
                    <div key={day} className="text-center">
                        <div className="text-[10px] sm:text-xs font-bold text-foreground/80 uppercase tracking-wider">
                            {day}
                        </div>
                        <div className="text-[9px] sm:text-[10px] text-muted-foreground/70 hidden sm:block mt-0.5">
                            {DAYS_OF_WEEK_NEPALI[i]}
                        </div>
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 lg:gap-3 auto-rows-fr">
                {Array.from({ length: startDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[70px] sm:min-h-[90px] lg:min-h-[100px]" />
                ))}

                {days.map(({ day, bsDate, adDate, holiday, eventCount, isToday }) => {
                    const isSat = bsDate.dayOfWeek === 6;
                    const hasEvent = !!holiday;
                    const hasUserEvent = eventCount > 0;

                    return (
                        <div
                            key={day}
                            className={cn(
                                "relative min-h-[70px] sm:min-h-[90px] lg:min-h-[100px] p-2 sm:p-3 flex flex-col justify-between transition-all duration-200 border rounded-xl group cursor-pointer",
                                "hover:shadow-lg hover:scale-[1.02] hover:z-10",
                                isToday
                                    ? "bg-primary text-primary-foreground border-primary shadow-md ring-2 ring-primary/50"
                                    : (isSat || hasEvent)
                                        ? "text-destructive dark:text-destructive bg-destructive/5 dark:bg-destructive/10 border-destructive/20 hover:border-destructive/40"
                                        : "bg-card/50 backdrop-blur-sm text-card-foreground border-border/40 hover:bg-card hover:border-border"
                            )}
                        >
                            {/* Top Row: Date & AD Date */}
                            <div className="flex justify-between items-start">
                                <span className={cn(
                                    "text-lg sm:text-2xl lg:text-3xl font-bold tabular-nums transition-transform group-hover:scale-110",
                                )}>
                                    {day}
                                </span>
                                {adDate && (
                                    <span className={cn(
                                        "text-[9px] sm:text-[10px] font-mono opacity-50 group-hover:opacity-70 transition-opacity tabular-nums",
                                        isToday ? "text-primary-foreground" : "text-muted-foreground"
                                    )}>
                                        {adDate.getDate()}
                                    </span>
                                )}
                            </div>

                            {/* Bottom Row: Event Indicator */}
                            {(hasEvent || hasUserEvent) && (
                                <div className="mt-1 flex flex-col gap-1">
                                    {hasUserEvent && (
                                        <div className="flex gap-1 items-center">
                                            <div className={cn("w-1.5 h-1.5 rounded-full bg-blue-500", isToday && "bg-blue-300")} />
                                            <span className="text-[8px] text-muted-foreground">{eventCount}</span>
                                        </div>
                                    )}

                                    {hasEvent && (
                                        <p className={cn(
                                            "text-[9px] sm:text-[10px] leading-tight line-clamp-2 font-medium",
                                            isToday ? "text-primary-foreground/90" : "text-muted-foreground group-hover:text-foreground"
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
