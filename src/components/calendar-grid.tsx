import { useEffect, useState } from "react";
import { Effect } from "effect";
import { cn } from "@/lib/utils";
import { BSDate, DateServiceLive, DateService } from "@/lib/date-service";
import { getHoliday, isHoliday } from "@/lib/holidays";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_OF_WEEK_NEPALI = ["आइत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"];

interface CalendarGridProps {
    currentDate: BSDate;
    className?: string;
}

export function CalendarGrid({ currentDate, className }: CalendarGridProps) {
    const [daysInMonth, setDaysInMonth] = useState<number>(30);
    const [startDayIndex, setStartDayIndex] = useState<number>(0);
    const [days, setDays] = useState<{ day: number; bsDate: BSDate; adDate: Date | null; holiday: string | null }[]>([]);

    useEffect(() => {
        const program = Effect.gen(function* (_) {
            const service = yield* _(DateService);

            const dims = yield* _(service.getDaysInMonth(currentDate.year, currentDate.month));
            const firstDay = yield* _(service.getFirstDayOfMonth(currentDate.year, currentDate.month));

            return { dims, firstDay };
        }).pipe(
            Effect.provide(DateServiceLive)
        );

        const result = Effect.runSync(program);
        setDaysInMonth(result.dims);
        setStartDayIndex(result.firstDay);

        // Generate days data
        const generatedDays = [];
        for (let i = 1; i <= result.dims; i++) {
            const bsDate = { ...currentDate, day: i, dayOfWeek: (result.firstDay + i - 1) % 7 };
            const holiday = getHoliday(bsDate);

            // We need AD date for each day. 
            // This might be expensive to run in loop if synchronous. 
            // But for 30 items it's fine.
            const adDateProgram = Effect.gen(function* (_) {
                const service = yield* _(DateService);
                return yield* _(service.toAD(bsDate));
            }).pipe(Effect.provide(DateServiceLive));

            const adDate = Effect.runSync(adDateProgram);
            generatedDays.push({ day: i, bsDate, adDate, holiday });
        }
        setDays(generatedDays);

    }, [currentDate.year, currentDate.month]); // Re-run when month/year changes

    return (
        <div className={cn("p-6", className)}>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-4">
                {DAYS_OF_WEEK.map((day, i) => (
                    <div key={day} className="text-center">
                        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            {day}
                        </div>
                        <div className="text-xs font-medium text-muted-foreground/50 mt-0.5">
                            {DAYS_OF_WEEK_NEPALI[i]}
                        </div>
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2 sm:gap-4">
                {/* Empty cells for start padding */}
                {Array.from({ length: startDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {days.map(({ day, bsDate, adDate, holiday }) => {
                    const isSat = bsDate.dayOfWeek === 6;
                    const isToday = false; // TODO: Check if matches today

                    return (
                        <div
                            key={day}
                            className={cn(
                                "group relative aspect-square rounded-2xl border border-transparent p-2 flex flex-col justify-between transition-all duration-200 hover:scale-105 cursor-pointer",
                                "hover:bg-accent hover:border-border hover:shadow-lg",
                                isSat || holiday ? "bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20" : "bg-card/50",
                                isToday && "ring-2 ring-primary bg-primary/5"
                            )}
                        >
                            <div className="flex justify-between items-start">
                                <span className={cn(
                                    "text-xl sm:text-2xl font-bold tracking-tight",
                                    (isSat || holiday) ? "text-red-600 dark:text-red-400" : "text-foreground"
                                )}>
                                    {day}
                                </span>
                                {adDate && (
                                    <span className="text-[10px] sm:text-xs font-medium text-muted-foreground font-sans">
                                        {adDate.getDate()}
                                    </span>
                                )}
                            </div>

                            {holiday && (
                                <div className="mt-auto">
                                    <p className="text-[10px] leading-tight text-red-600 dark:text-red-400 font-medium line-clamp-2">
                                        {holiday}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
