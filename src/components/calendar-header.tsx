import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { BSDate } from "@/lib/date-service";
import { useState, useEffect } from "react";

interface CalendarHeaderProps {
    currentDate: BSDate;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onToday: () => void;
    className?: string;
}

const MONTH_NAMES_NEPALI = [
    "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
    "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
];

const MONTH_NAMES_DEVANAGARI = [
    "बैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज",
    "कार्तिक", "मंसिर", "पुष", "माघ", "फागुन", "चैत"
];

export function CalendarHeader({ currentDate, onPrevMonth, onNextMonth, onToday, className }: CalendarHeaderProps) {
    return (
        <div className={cn("flex flex-col gap-6 p-6 sm:p-8 border-b border-border/40 bg-background/40 backdrop-blur-xl z-20", className)}>
            <div className="flex items-end justify-between">
                {/* Date Display */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary border border-primary/20">
                            {currentDate.year} BS
                        </span>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                            {MONTH_NAMES_NEPALI[currentDate.month - 1]}
                        </span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground flex items-baseline gap-2 leading-none">
                        {MONTH_NAMES_DEVANAGARI[currentDate.month - 1]}
                    </h1>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-end gap-3">
                    <LiveClock />

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center bg-card rounded-2xl border border-border/50 p-1 shadow-sm">
                            <button
                                onClick={onPrevMonth}
                                className="p-2 sm:p-3 hover:bg-muted/80 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-foreground/80 hover:text-foreground"
                                aria-label="Previous Month"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <div className="w-px h-6 bg-border/50 mx-0.5" />
                            <button
                                onClick={onNextMonth}
                                className="p-2 sm:p-3 hover:bg-muted/80 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-foreground/80 hover:text-foreground"
                                aria-label="Next Month"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        <button
                            onClick={onToday}
                            className="hidden sm:flex items-center gap-2 px-5 py-3 text-sm font-semibold bg-primary text-primary-foreground rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Today</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LiveClock() {
    const [time, setTime] = useState<Date | null>(null);

    useEffect(() => {
        setTime(new Date());
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!time) return null;

    return (
        <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-muted-foreground/60 bg-muted/20 px-3 py-1.5 rounded-full border border-border/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
    );
}

