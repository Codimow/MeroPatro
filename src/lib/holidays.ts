import { BSDate } from "./date-service";

// A simple map for fixed holidays [Month, Day] -> Name
const FIXED_HOLIDAYS: Record<string, string> = {
    "1-1": "Nepali New Year",
    "1-11": "Loktantra Diwas",
    "3-15": "Dhan Diwas (Asar 15)",
    "4-1": "Saune Sankranti",
    "6-3": "Constitution Day",
    "10-1": "Maghe Sankranti",
    "11-7": "Prajatantra Diwas",
    "12-1": "Chaite Dashain (Approx)",
};

// For variable holidays (Dashain/Tihar), we would typically need a Lunar calendar engine.
// For this MVP, we will simulate/hardcode for 2081 BS (current-ish context) or just return null for now.
// Users can extend this list.

export function getHoliday(date: BSDate): string | null {
    const key = `${date.month}-${date.day}`;
    if (FIXED_HOLIDAYS[key]) {
        return FIXED_HOLIDAYS[key];
    }

    // Example of saturday logic if needed, but usually valid calendar just shows red color.
    // We can return "Weekend" if we want, but usually 'Holiday' implies specialized event.

    return null;
}

export function isHoliday(date: BSDate): boolean {
    return date.dayOfWeek === 6 || !!getHoliday(date); // 6 is Saturday in nepali-date-converter usually? 
    // Wait, let's double check dayOfWeek in DateService. 
    // JS Date.getDay() -> 0=Sun, 6=Sat. 
    // Nepali Date usually treats Sun=0, Sat=6 or 1=Sun, 7=Sat?
    // nepali-date-converter .getDay() returns 0 for Sunday, 6 for Saturday.
    // So Saturday is 6.
}
