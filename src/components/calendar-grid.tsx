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
        <div className={cn("p-4 sm:p-6 lg:p-8 overflow-y-auto custom-scrollbar", className)}>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-6">
                {DAYS_OF_WEEK.map((day, i) => (
                    <div key={day} className="text-center pb-3 border-b border-border/10">
                        <div className="text-[11px] sm:text-xs font-bold text-muted-foreground tracking-widest uppercase opacity-70">
                            {day}
                        </div>
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 auto-rows-fr gap-2 sm:gap-3 lg:gap-4">
                {Array.from({ length: startDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[100px] sm:min-h-[120px] rounded-3xl" />
                ))}

                {days.map(({ day, bsDate, adDate, holiday, eventCount, isToday }, idx) => {
                    const isSat = bsDate.dayOfWeek === 6;
                    const hasEvent = !!holiday;
                    const hasUserEvent = eventCount > 0;

                    // Stagger animation based on index
                    const animationDelay = `${idx * 15}ms`;

                    return (
                        <div
                            key={day}
                            style={{ animationDelay }}
                            className={cn(
                                "group relative min-h-[110px] sm:min-h-[130px] p-3 sm:p-4 flex flex-col justify-between transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards",
                                "rounded-[1.5rem] border border-transparent",
                                "hover:bg-muted/40 hover:border-border/30 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1 hover:z-10",
                                isToday
                                    ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20 ring-1 ring-primary/50 relative overflow-hidden"
                                    : "bg-card/40 backdrop-blur-sm border-border/20",
                                isSat && !isToday && "bg-destructive/5 border-destructive/10 hover:bg-destructive/10"
                            )}
                        >
                            {/* Today Glow Background */}
                            {isToday && (
                                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-white/20 via-transparent to-black/10 animate-spin-slow pointer-events-none opacity-50" />
                            )}

                            {/* Top Row: Date & AD Date */}
                            <div className="flex justify-between items-start relative z-10">
                                <span className={cn(
                                    "text-2xl sm:text-3xl font-bold tabular-nums tracking-tight transition-transform duration-300 group-hover:scale-110 origin-top-left",
                                    isSat && !isToday && "text-destructive"
                                )}>
                                    {day}
                                </span>
                                {adDate && (
                                    <div className="flex flex-col items-end">
                                        <span className={cn(
                                            "text-[10px] font-medium font-mono tabular-nums opacity-60 group-hover:opacity-100 transition-opacity",
                                            isToday ? "text-primary-foreground/80" : "text-muted-foreground",
                                            isSat && !isToday && "text-destructive/60"
                                        )}>
                                            {adDate.getDate()}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Center/Bottom: Events */}
                            <div className="flex flex-col gap-1.5 mt-2 relative z-10">
                                {/* Holiday Indicator */}
                                {hasEvent && (
                                    <div className={cn(
                                        "px-2.5 py-1 rounded-full text-[10px] w-fit max-w-full truncate font-semibold border transition-all duration-300",
                                        isToday
                                            ? "bg-white/20 text-white border-white/20 backdrop-blur-md"
                                            : isSat
                                                ? "bg-destructive/10 text-destructive border-destructive/20 group-hover:bg-destructive/20"
                                                : "bg-secondary text-secondary-foreground border-border/50 group-hover:bg-background group-hover:shadow-sm"
                                    )}>
                                        {holiday}
                                    </div>
                                )}

                                {/* User Events Pulse */}
                                {hasUserEvent && (
                                    <div className="flex items-center gap-1.5 mt-auto">
                                        <div className="flex -space-x-1.5">
                                            {Array.from({ length: Math.min(eventCount, 3) }).map((_, idx) => (
                                                <div
                                                    key={idx}
                                                    className={cn(
                                                        "w-2 h-2 rounded-full ring-2 transition-transform duration-300 group-hover:scale-110",
                                                        isToday ? "bg-white ring-primary" : "bg-blue-500 ring-card"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        {eventCount > 3 && (
                                            <span className={cn("text-[8px] font-bold uppercase", isToday ? "text-white/80" : "text-muted-foreground")}>+{eventCount - 3}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
