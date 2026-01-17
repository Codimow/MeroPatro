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
        <div className={cn("flex flex-col gap-4 p-4 border-b border-border bg-background sticky top-0 z-30", className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/5 rounded-md text-primary">
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-baseline gap-2">
                            {MONTH_NAMES_DEVANAGARI[currentDate.month - 1]}
                            <span className="text-sm text-muted-foreground font-light decoration-0">|</span>
                            <span className="font-mono text-lg opacity-80">{currentDate.year}</span>
                        </h1>
                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider ml-0.5">
                            {MONTH_NAMES_NEPALI[currentDate.month - 1]}
                        </p>
                    </div>
                </div>

                {/* Desktop/Tablet Controls (Hidden on very small screens if needed, but flex-row keeps them accessible) */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={onPrevMonth}
                        className="p-2 hover:bg-muted rounded-md transition-colors"
                        aria-label="Previous Month"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={onNextMonth}
                        className="p-2 hover:bg-muted rounded-md transition-colors"
                        aria-label="Next Month"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={onToday}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-muted/50 hover:bg-muted text-foreground rounded-md transition-colors"
                >
                    <RotateCcw className="w-3 h-3" />
                    Today
                </button>
            </div>
        </div>
    );
}

