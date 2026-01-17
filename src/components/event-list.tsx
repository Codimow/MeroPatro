import { cn } from "@/lib/utils";
import { BSDate } from "@/lib/date-service";
import { getHoliday } from "@/lib/holidays";
import { Calendar as CalendarIcon, MapPin } from "lucide-react";

interface EventListProps {
    currentDate: BSDate;
    daysInMonth: number; // passed from parent or calculated
    className?: string;
}

export function EventList({ currentDate, daysInMonth, className }: EventListProps) {
    // Generate events for the month
    const events = [];
    for (let i = 1; i <= daysInMonth; i++) {
        const date = { ...currentDate, day: i, dayOfWeek: 0 }; // dayOfWeek doesnt matter for getHoliday currently
        const holiday = getHoliday(date);
        if (holiday) {
            events.push({ day: i, title: holiday });
        }
    }

    return (
        <div className={cn("p-6 flex flex-col h-full", className)}>
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Upcoming Events
            </h2>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {events.length > 0 ? (
                    events.map((event, idx) => (
                        <div
                            key={idx}
                            className="group flex gap-4 p-4 rounded-xl bg-card border border-border/50 hover:border-primary/20 hover:bg-accent/50 transition-all duration-300 hover:shadow-md"
                        >
                            <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                                <span className="text-sm font-bold">{event.day}</span>
                                <span className="text-[10px] uppercase font-medium">
                                    {/* We could show AD month shorthand here if we had it, or just 'Mth' */}
                                </span>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                    {event.title}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    Public Holiday
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>No major events this month.</p>
                    </div>
                )}
            </div>

            {/* Decorative premium element */}
            <div className="mt-auto pt-6 border-t border-border/30">
                <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/10">
                    <p className="text-xs text-center text-muted-foreground font-medium">
                        MeroPatro Premium
                        <br />
                        <span className="opacity-70">Accurate . Fast . Beautiful</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
