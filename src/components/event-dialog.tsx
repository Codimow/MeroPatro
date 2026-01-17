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
            "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={cn(
                "relative w-full max-w-md bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300",
                isOpen ? "translate-y-0 scale-100" : "translate-y-4 scale-95"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/40 bg-secondary/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                            <CalendarPlus size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold tracking-tight">Add Event</h2>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                {currentDate.year}-{currentDate.month}-{currentDate.day}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider ml-1">
                            Event Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Team Meeting"
                            className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50 text-sm"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-xs font-semibold uppercase text-muted-foreground tracking-wider ml-1">
                            Description (Optional)
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add details..."
                            rows={3}
                            className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50 text-sm"
                        />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim()}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Save Event
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
