import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CalendarLayoutProps {
    children: ReactNode;
    className?: string;
}

export function CalendarLayout({ children, className }: CalendarLayoutProps) {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-background via-muted/30 to-secondary/50 dark:from-background dark:via-zinc-900 dark:to-black flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className={cn(
                "w-full max-w-6xl mx-auto rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50 dark:ring-white/5 glass dark:glass-dark transition-all duration-300 animate-fade-in h-[90vh] flex flex-col",
                className
            )}>
                {children}
            </div>
        </div>
    );
}
