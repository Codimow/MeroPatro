import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CalendarLayoutProps {
    children: ReactNode;
    className?: string;
}

export function CalendarLayout({ children, className }: CalendarLayoutProps) {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-background via-gray-50 to-gray-100 dark:from-background dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-4 sm:p-8">
            <div className={cn(
                "w-full max-w-5xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10 glass dark:glass-dark transition-all duration-300",
                className
            )}>
                {children}
            </div>
        </div>
    );
}
