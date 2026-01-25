import { useState, useEffect } from "react";
import { X, CalendarPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { BSDate } from "@/lib/date-service";

interface EventDialogProps {
    isOpen: boolean;
    onClose: () => void;
    currentDate: BSDate;
    onSave: (event: { title: string; date: string; description: string }) => void;
}

export function EventDialog({ isOpen, onClose, currentDate, onSave }: EventDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        // Format date string as YYYY-M-D
        const dateStr = `${currentDate.year}-${currentDate.month}-${currentDate.day}`;
        onSave({ title, description, date: dateStr });
        setTitle("");
        setDescription("");
        onClose();
    };

    return (
        <div className={cn(
            "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-500",
            isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}>
            {/* Backdrop */}
            <div
                className={cn(
                    "absolute inset-0 bg-black/60 backdrop-blur-[4px] transition-all duration-500",
                    isOpen ? "opacity-100" : "opacity-0"
                )}
                onClick={onClose}
            />

            {/* Modal */}
            <div className={cn(
                "relative w-full max-w-md bg-card/95 backdrop-blur-xl border border-white/10 dark:border-border/50 rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 cubic-bezier(0.32, 0.72, 0, 1)",
                isOpen ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/40 bg-gradient-to-r from-secondary/50 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary ring-1 ring-primary/20">
                            <CalendarPlus size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold tracking-tight text-foreground">Add Event</h2>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5 opacity-80">
                                {currentDate.year}-{currentDate.month}-{currentDate.day}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground group"
                    >
                        <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-[11px] font-bold uppercase text-muted-foreground tracking-widest ml-1">
                            Event Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Team Meeting"
                            className="w-full px-4 py-3.5 bg-muted/40 border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/40 text-sm font-medium"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-[11px] font-bold uppercase text-muted-foreground tracking-widest ml-1">
                            Description <span className="text-muted-foreground/50 font-normal normal-case tracking-normal">(Optional)</span>
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add details..."
                            rows={3}
                            className="w-full px-4 py-3.5 bg-muted/40 border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/40 text-sm font-medium leading-relaxed"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim()}
                            className="px-6 py-3 rounded-xl text-sm font-bold bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
                        >
                            Save Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
