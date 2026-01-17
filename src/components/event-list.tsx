import { cn } from "@/lib/utils";
import { BSDate } from "@/lib/date-service";
import { getHolidayDetails } from "@/lib/holidays";
import { Calendar as CalendarIcon, Flag, Moon } from "lucide-react";

interface EventListProps {
    currentDate: BSDate;
    daysInMonth: number;
    className?: string;
}

export function EventList({ currentDate, daysInMonth, className }: EventListProps) {
    const events = [];
    for (let i = 1; i <= daysInMonth; i++) {
        const date = { ...currentDate, day: i, dayOfWeek: 0 };
        const details = getHolidayDetails(date);
        if (details) {
            events.push({
                day: i,
                title: details.event,
                tithi: details.tithi,
                isPublic: details.isPublicHoliday
            });
        }
    }

    return (
        <div className={cn("p-4 flex flex-col h-full bg-muted/5", className)}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">
                    Events · {currentDate.year} · {currentDate.month}
                </h2>
            </div>

            {/* List Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {events.length > 0 ? (
                    events.map((event, idx) => (
                        <div key={idx} className="group flex gap-3 text-sm">
                            {/* Date Badge */}
                            <div className="flex flex-col items-center justify-start pt-1 min-w-[3rem]">
                                <span className="text-xs font-bold text-muted-foreground">
                                    {event.day}
                                </span>
                            </div>

                            {/* Event Details */}
                            <div className="flex-1 pb-3 border-b border-border/40 last:border-0">
                                <h3 className={cn(
                                    "font-medium leading-tight",
                                    event.isPublic ? "text-red-600 dark:text-red-400" : "text-foreground"
                                )}>
                                    {event.title}
                                </h3>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                                    {event.tithi && (
                                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                            <Moon className="w-3 h-3" />
                                            {event.tithi}
                                        </div>
                                    )}

                                    {event.isPublic && (
                                        <div className="flex items-center gap-1 text-[10px] text-red-500 font-medium uppercase tracking-wide">
                                            <Flag className="w-3 h-3" />
                                            Holiday
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <p className="text-sm">No events this month.</p>
                    </div>
                )}
            </div>

            <div className="pt-4 border-t border-border mt-auto">
                <p className="text-[10px] text-center text-muted-foreground/60 uppercase tracking-widest font-medium">MeroPatro</p>
            </div>
        </div>
    );
}

