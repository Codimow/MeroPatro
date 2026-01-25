import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CalendarLayoutProps {
    children: ReactNode;
    className?: string;
}

export function CalendarLayout({ children, className }: CalendarLayoutProps) {
    return (
        <div className="min-h-screen w-full bg-background relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden font-sans selection:bg-primary/20">
            {/* Ambient Background Effects */}
            <div className="fixed inset-0 z-0 bg-noise pointer-events-none opacity-50 mix-blend-soft-light" />

            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-r from-primary/5 to-transparent blur-[120px] animate-pulse duration-[10000ms]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-l from-secondary/40 to-transparent blur-[120px] animate-pulse duration-[15000ms]" />
                <div className="hidden dark:block absolute top-[40%] left-[30%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[90px]" />
            </div>

            <div className={cn(
                "w-full max-w-[1400px] mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/10 ring-1 ring-black/5 dark:ring-white/10 glass dark:glass-dark transition-all duration-700 animate-in fade-in zoom-in-95 relative z-10 flex flex-col h-[88vh] backdrop-blur-[40px]",
                className
            )}>
                {children}
            </div>
        </div>
    );
}
