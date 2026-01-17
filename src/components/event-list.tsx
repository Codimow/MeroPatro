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
        <div className={cn("p-4 sm:p-6 flex flex-col h-full bg-card/30 backdrop-blur-sm border-l border-border/30", className)}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <CalendarIcon className="w-4 h-4 text-foreground" />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-foreground">
                        Events & Holidays
                    </h2>
                    <p className="text-[10px] text-muted-foreground font-mono">
                        {currentDate.year} · {currentDate.month}
                    </p>
                </div>
            </div>

            {/* List Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                {events.length > 0 ? (
                    events.map((event, idx) => (
                        <div
                            key={idx}
                            className="group flex gap-3 sm:gap-4 p-3 rounded-xl bg-card/50 backdrop-blur-sm border border-border/30 hover:border-border hover:bg-card hover:shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                        >
                            {/* Date Badge */}
                            <div className="flex flex-col items-center justify-center min-w-[3rem] h-[3rem] bg-primary/10 rounded-lg border border-border/30">
                                <span className="text-lg font-bold text-foreground font-mono">
                                    {event.day}
                                </span>
                            </div>

                            {/* Event Details */}
                            <div className="flex-1 flex flex-col justify-center">
                                <h3 className={cn(
                                    "font-semibold leading-tight text-sm mb-1",
                                    event.isPublic ? "text-destructive" : "text-foreground"
                                )}>
                                    {event.title}
                                </h3>

                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                    {event.tithi && (
                                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                            <Moon className="w-3 h-3" />
                                            <span>{event.tithi}</span>
                                        </div>
                                    )}

                                    {event.isPublic && (
                                        <div className="flex items-center gap-1 px-2 py-0.5 text-[9px] bg-destructive/10 text-destructive font-bold uppercase tracking-wider rounded-md border border-destructive/20">
                                            <Flag className="w-2.5 h-2.5" />
                                            <span>Holiday</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <CalendarIcon className="w-12 h-12 text-muted-foreground/30 mb-3" />
                        <p className="text-sm text-muted-foreground">No events this month</p>
                    </div>
                )}
            </div>

            <div className="pt-4 border-t border-border/30 mt-auto">
                <p className="text-[10px] text-center text-muted-foreground/60 uppercase tracking-widest font-bold">MeroPatro</p>
            </div>
        </div>
    );
}
