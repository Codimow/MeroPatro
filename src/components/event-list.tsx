import { cn } from "@/lib/utils";
import { BSDate } from "@/lib/date-service";
import { getHoliday } from "@/lib/holidays";
import { Calendar as CalendarIcon, Flag, Sparkles } from "lucide-react";

interface EventListProps {
    currentDate: BSDate;
    daysInMonth: number;
    className?: string;
}

export function EventList({ currentDate, daysInMonth, className }: EventListProps) {
    const events = [];
    for (let i = 1; i <= daysInMonth; i++) {
        const date = { ...currentDate, day: i, dayOfWeek: 0 };
        const holiday = getHoliday(date);
        if (holiday) {
            events.push({ day: i, title: holiday });
        }
    }

    return (
        <div className={cn("p-6 flex flex-col h-full relative overflow-hidden", className)}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="p-2.5 bg-primary/10 text-primary shadow-sm ring-1 ring-inset ring-primary/20">
                    <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-lg font-bold tracking-tight text-foreground">
                        Events & Holidays
                    </h2>
                    <p className="text-xs text-muted-foreground font-medium">
                        {currentDate.year} - {currentDate.month}
                    </p>
                </div>
            </div>

            {/* Timeline Container */}
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar relative z-10 space-y-6">
                {events.length > 0 ? (
                    <div className="relative border-l-2 border-dashed border-border/60 ml-3.5 space-y-8 pb-4">
                        {events.map((event, idx) => (
                            <div key={idx} className="relative pl-8 group">
                                {/* Timeline Node - Square */}
                                <div className="absolute -left-[9px] top-1 w-4 h-4 bg-background border-2 border-primary ring-4 ring-background transition-colors group-hover:border-red-500 group-hover:scale-110" />

                                {/* Event Card */}
                                <div className="flex flex-col gap-1 transition-all duration-300 group-hover:translate-x-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-bold font-mono text-primary/80">
                                            Day {event.day}
                                        </span>
                                        <span className="h-px flex-1 bg-border/60" />
                                    </div>

                                    <div className="p-3.5 bg-card border border-border/40 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:border-primary/20 group-hover:bg-accent/40">
                                        <h3 className="font-bold text-foreground leading-tight text-sm">
                                            {event.title}
                                        </h3>
                                        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                                            <Flag className="w-3 h-3 text-red-500" />
                                            Public Holiday
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center px-4 border-2 border-dashed border-border/50 bg-secondary/20">
                        <Sparkles className="w-8 h-8 text-muted-foreground/30 mb-3" />
                        <p className="text-sm font-medium text-muted-foreground">No events this month</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">Enjoy a peaceful month!</p>
                    </div>
                )}
            </div>

            {/* Footer / Premium Badge */}
            <div className="mt-auto pt-6 border-t border-border/40 relative z-10">
                <div className="bg-gradient-to-r from-primary/5 via-orange-500/5 to-primary/5 p-4 border border-primary/10 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-primary/70 tracking-widest">
                            MeroPatro
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground opacity-70">
                            v1.0
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
