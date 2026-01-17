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
        <div className={cn("flex flex-col gap-4 p-4 sm:p-6 border-b border-border/50 bg-card/50 backdrop-blur-sm", className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2.5 bg-primary/10 dark:bg-primary/5 rounded-xl text-foreground border border-border/30 shadow-sm">
                        <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-foreground flex items-baseline gap-2 sm:gap-3">
                            {MONTH_NAMES_DEVANAGARI[currentDate.month - 1]}
                            <span className="text-sm sm:text-base text-muted-foreground font-light">|</span>
                            <span className="font-mono text-lg sm:text-2xl opacity-90">{currentDate.year}</span>
                        </h1>
                        <p className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-widest mt-0.5">
                            {MONTH_NAMES_NEPALI[currentDate.month - 1]}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-2">
                    <button
                        onClick={onPrevMonth}
                        className="p-2 sm:p-2.5 hover:bg-muted/70 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-transparent hover:border-border/30"
                        aria-label="Previous Month"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onNextMonth}
                        className="p-2 sm:p-2.5 hover:bg-muted/70 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 border border-transparent hover:border-border/30"
                        aria-label="Next Month"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={onToday}
                    className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium bg-primary text-primary-foreground rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                >
                    <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">Today</span>
                    <span className="sm:hidden">Now</span>
                </button>
            </div>
        </div>
    );
}

