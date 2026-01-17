import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { BSDate } from "@/lib/date-service";

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
        <div className={cn("flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 border-b border-white/10 glass sticky top-0 z-20 transition-all", className)}>
            <div className="flex items-center gap-5 mb-6 md:mb-0 w-full md:w-auto">
                <div className="p-3.5 bg-primary text-white shadow-lg shadow-primary/30 ring-1 ring-primary/10">
                    <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-baseline gap-3">
                        {MONTH_NAMES_DEVANAGARI[currentDate.month - 1]}
                        <span className="text-lg text-muted-foreground font-light tracking-normal opacity-60">|</span>
                        <span className="font-mono text-2xl opacity-90">{currentDate.year}</span>
                    </h1>
                    <p className="text-sm text-primary font-bold uppercase tracking-[0.2em] mt-1 ml-0.5">
                        {MONTH_NAMES_NEPALI[currentDate.month - 1]}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <button
                    onClick={onToday}
                    className="group flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-white/50 dark:bg-zinc-900/50 text-foreground hover:bg-primary hover:text-white transition-all duration-300 border border-white/10 hover:border-primary/50 hover:shadow-lg active:scale-95 backdrop-blur-sm"
                >
                    <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-180" />
                    Today
                </button>

                <div className="flex items-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md p-1.5 border border-white/10 shadow-sm gap-1">
                    <button
                        onClick={onPrevMonth}
                        className="p-2.5 hover:bg-white dark:hover:bg-zinc-800 text-foreground transition-all hover:shadow-md active:scale-90 hover:text-primary"
                        aria-label="Previous Month"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="w-px h-5 bg-foreground/10 mx-1" />
                    <button
                        onClick={onNextMonth}
                        className="p-2.5 hover:bg-white dark:hover:bg-zinc-800 text-foreground transition-all hover:shadow-md active:scale-90 hover:text-primary"
                        aria-label="Next Month"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
