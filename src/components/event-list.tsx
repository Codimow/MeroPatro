import { cn } from "@/lib/utils";
import { BSDate } from "@/lib/date-service";
import { getHolidayDetails } from "@/lib/holidays";
import { Calendar as CalendarIcon, Flag, Moon } from "lucide-react";

const MONTH_NAMES_NEPALI = [
    "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
    "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

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
        <div className={cn("flex flex-col h-full bg-white/5 backdrop-blur-2xl border-l border-white/10 dark:border-white/5", className)}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/5 rounded-2xl ring-1 ring-primary/10">
                        <CalendarIcon className="w-4 h-4 text-foreground/80" />
                    </div>
                    <div>
                        <h2 className="text-sm font-bold text-foreground tracking-tight">
                            Agenda
                        </h2>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5 opacity-70">
                            {currentDate.year} · {MONTH_NAMES_NEPALI[currentDate.month - 1]}
                        </p>
                    </div>
                </div>
            </div>

            {/* List Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
                {events.length > 0 ? (
                    events.map((event, idx) => (
                        <div
                            key={idx}
                            style={{ animationDelay: `${idx * 50}ms` }}
                            className="group relative flex gap-5 p-4 rounded-[1.25rem] bg-card/40 hover:bg-card/80 border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
                        >
                            {/* Timeline Line */}
                            <div className="absolute left-[31px] top-[3.5rem] bottom-[-20px] w-px bg-border/50 group-last:hidden" />

                            {/* Date Badge */}
                            <div className={cn(
                                "flex flex-col items-center justify-center min-w-[3.5rem] h-[3.5rem] rounded-2xl border transition-colors relative z-10",
                                event.isPublic
                                    ? "bg-destructive/5 border-destructive/10 text-destructive"
                                    : "bg-surface border-white/10 text-foreground"
                            )}>
                                <span className={cn(
                                    "text-xl font-bold font-mono tracking-tighter",
                                )}>
                                    {event.day}
                                </span>
                            </div>

                            {/* Event Details */}
                            <div className="flex-1 flex flex-col justify-center py-1">
                                <h3 className="font-bold text-sm leading-snug text-foreground/90 mb-2 group-hover:text-foreground transition-colors">
                                    {event.title}
                                </h3>

                                <div className="flex flex-wrap items-center gap-2">
                                    {event.tithi && (
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] font-medium text-muted-foreground">
                                            <Moon className="w-3 h-3 opacity-70" />
                                            <span>{event.tithi}</span>
                                        </div>
                                    )}

                                    {event.isPublic && (
                                        <div className="flex items-center gap-1 px-2 py-1 text-[9px] bg-destructive/10 text-destructive font-bold uppercase tracking-widest rounded-md border border-destructive/10">
                                            <Flag className="w-2.5 h-2.5" />
                                            <span>Holiday</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-center px-8 animate-in fade-in zoom-in-95 duration-500">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-muted/20 to-transparent flex items-center justify-center mb-6 ring-1 ring-white/10">
                            <CalendarIcon className="w-10 h-10 text-muted-foreground/20" />
                        </div>
                        <h3 className="text-base font-bold text-foreground mb-2">Quiet Month</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px] text-balance">
                            No upcoming holidays or events scheduled for this month.
                        </p>
                    </div>
                )}
            </div>

            <div className="p-6 border-t border-white/5 bg-white/5 backdrop-blur-xl">
                <div className="flex justify-between items-center text-[10px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                    <span>MeroPatro</span>
                    <span>v0.1.0</span>
                </div>
            </div>
        </div>
    );
}
