import { useEffect, useState } from "react";
import { Effect } from "effect";
import { cn } from "@/lib/utils";
import { BSDate, DateServiceLive, DateService } from "@/lib/date-service";
import { getHoliday } from "@/lib/holidays";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAYS_OF_WEEK_NEPALI = ["आइत", "सोम", "मंगल", "बुध", "बिही", "शुक्र", "शनि"];

interface CalendarGridProps {
    currentDate: BSDate;
    className?: string;
}

export function CalendarGrid({ currentDate, className }: CalendarGridProps) {
    // const [daysInMonth, setDaysInMonth] = useState<number>(30); // Derived from `days` length effectively
    const [startDayIndex, setStartDayIndex] = useState<number>(0);
    const [days, setDays] = useState<{ day: number; bsDate: BSDate; adDate: Date | null; holiday: string | null; isToday: boolean }[]>([]);

    useEffect(() => {
        const program = Effect.gen(function* (_) {
            const service = yield* _(DateService);

            const dims = yield* _(service.getDaysInMonth(currentDate.year, currentDate.month));
            const firstDay = yield* _(service.getFirstDayOfMonth(currentDate.year, currentDate.month));
            const todayBS = yield* _(service.getCurrentBS);

            return { dims, firstDay, todayBS };
        }).pipe(
            Effect.provide(DateServiceLive)
        );

        const result = Effect.runSync(program);
        setStartDayIndex(result.firstDay);

        // Generate days data
        const generatedDays = [];
        for (let i = 1; i <= result.dims; i++) {
            const bsDate = { ...currentDate, day: i, dayOfWeek: (result.firstDay + i - 1) % 7 };
            const holiday = getHoliday(bsDate);

            // Check if today
            const isToday = result.todayBS.year === bsDate.year &&
                result.todayBS.month === bsDate.month &&
                result.todayBS.day === bsDate.day;

            const adDateProgram = Effect.gen(function* (_) {
                const service = yield* _(DateService);
                return yield* _(service.toAD(bsDate));
            }).pipe(Effect.provide(DateServiceLive));

            const adDate = Effect.runSync(adDateProgram);
            generatedDays.push({ day: i, bsDate, adDate, holiday, isToday });
        }
        setDays(generatedDays);

    }, [currentDate.year, currentDate.month]);

    return (
        <div className={cn("p-6 sm:p-8", className)}>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-6">
                {DAYS_OF_WEEK.map((day, i) => (
                    <div key={day} className="text-center group cursor-default">
                        <div className="text-sm font-bold text-muted-foreground/60 uppercase tracking-widest group-hover:text-primary transition-colors duration-300">
                            {day}
                        </div>
                        <div className="text-[10px] font-medium text-muted-foreground/40 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-y-1 group-hover:translate-y-0">
                            {DAYS_OF_WEEK_NEPALI[i]}
                        </div>
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-3 sm:gap-4">
                {/* Empty cells */}
                {Array.from({ length: startDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {days.map(({ day, bsDate, adDate, holiday, isToday }) => {
                    const isSat = bsDate.dayOfWeek === 6;
                    const hasEvent = !!holiday;

                    return (
                        <div
                            key={day}
                            className={cn(
                                "group relative aspect-square p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-sm",
                                "border border-white/10 dark:border-white/5",
                                "hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 hover:z-10",

                                isToday
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 ring-1 ring-primary ring-offset-1 ring-offset-background"
                                    : (isSat || hasEvent)
                                        ? "bg-red-50/80 dark:bg-red-950/20 text-red-700 dark:text-red-400"
                                        : "bg-white/60 dark:bg-zinc-900/40 text-foreground"
                            )}
                        >
                            {/* Top Row: Date & AD Date */}
                            <div className="flex justify-between items-start z-10">
                                <span className={cn(
                                    "text-xl sm:text-2xl font-bold tracking-tight font-sans transition-transform group-hover:scale-110 origin-top-left",
                                )}>
                                    {day}
                                </span>
                                {adDate && (
                                    <span className={cn(
                                        "text-[10px] font-medium opacity-60 font-mono tracking-tighter",
                                        isToday ? "text-primary-foreground" : "text-muted-foreground"
                                    )}>
                                        {adDate.getDate()}
                                    </span>
                                )}
                            </div>

                            {/* Bottom Row: Event Indicator */}
                            {hasEvent && (
                                <div className="mt-auto z-10">
                                    <p className={cn(
                                        "text-[10px] leading-[1.1] font-semibold line-clamp-2",
                                        isToday ? "text-primary-foreground/90" : "text-red-600 dark:text-red-400"
                                    )}>
                                        {holiday}
                                    </p>
                                </div>
                            )}

                            {/* Hover Glow Effect */}
                            <div className={cn(
                                "absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                                isToday && "from-white/10"
                            )} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
