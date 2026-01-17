import { BSDate } from "./date-service";
import holidays2080 from "../data/holidays/2080.json";
import holidays2081 from "../data/holidays/2081.json";
import holidays2082 from "../data/holidays/2082.json";

// Type definition for the holiday data structure
export interface HolidayData {
    date: string;
    event: string;
    tithi?: string;
    engDay?: string;
    isPublicHoliday: boolean;
    adDate?: string;
}

const HOLIDAYS_BY_YEAR: Record<number, Record<string, HolidayData>> = {
    2080: holidays2080 as unknown as Record<string, HolidayData>,
    2081: holidays2081 as unknown as Record<string, HolidayData>,
    2082: holidays2082 as unknown as Record<string, HolidayData>,
};

/**
 * Retrieves the holiday name for a given BSDate.
 * Supports 2080, 2081, 2082 BS.
 */
export function getHoliday(date: BSDate): string | null {
    const yearData = HOLIDAYS_BY_YEAR[date.year];
    if (yearData) {
        const key = `${date.month}-${date.day}`;
        const entry = yearData[key];
        if (entry) {
            // Some events might be just "--" or empty in the scraped data
            if (entry.event && entry.event !== "--") {
                return entry.event;
            }
        }
    }
    return null;
}

/**
 * Retrieves full holiday details if available
 */
export function getHolidayDetails(date: BSDate): HolidayData | null {
    const yearData = HOLIDAYS_BY_YEAR[date.year];
    if (yearData) {
        const key = `${date.month}-${date.day}`;
        return yearData[key] || null;
    }
    return null;
}

export function isHoliday(date: BSDate): boolean {
    const isSaturday = date.dayOfWeek === 6;
    const holiday = getHoliday(date);
    return isSaturday || !!holiday;
}
