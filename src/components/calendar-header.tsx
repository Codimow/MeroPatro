import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
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
        <div className={cn("flex flex-col md:flex-row items-center justify-between p-6 border-b border-border/50 bg-white/50 dark:bg-black/20 backdrop-blur-sm sticky top-0 z-10", className)}>
            <div className="flex items-center gap-4 mb-4 md:mb-0">
                <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        {MONTH_NAMES_DEVANAGARI[currentDate.month - 1]} <span className="text-muted-foreground font-light">|</span> {currentDate.year}
                    </h1>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                        {MONTH_NAMES_NEPALI[currentDate.month - 1]}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={onToday}
                    className="px-4 py-2 text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-colors mr-2"
                >
                    Today
                </button>
                <div className="flex items-center bg-secondary rounded-lg p-1">
                    <button
                        onClick={onPrevMonth}
                        className="p-2 hover:bg-background rounded-md text-foreground transition-all hover:shadow-sm active:scale-95"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-border mx-1" />
                    <button
                        onClick={onNextMonth}
                        className="p-2 hover:bg-background rounded-md text-foreground transition-all hover:shadow-sm active:scale-95"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
