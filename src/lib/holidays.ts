import { BSDate } from "./date-service";

// A map for fixed holidays [Month, Day] -> Name.
// Note: Many Nepali holidays are lunar (Tithi-based).
// For this version, we are hardcoding the dates for roughly 2081/2082 BS context
// to provide a "fuller" feel, acknowledging that in a real production app
// we would need a Panchanga engine to calculate these dynamically.

const FIXED_HOLIDAYS: Record<string, string> = {
    // Baisakh
    "1-1": "Nepali New Year (Naya Barsha)",
    "1-11": "Loktantra Diwas",
    "1-18": "Majdoor Diwas (International Workers Day)",
    "1-23": "Buddha Jayanti", // Approx for year

    // Jestha
    "2-15": "Ganatantra Diwas (Republic Day)",

    // Asar
    "3-15": "Dhan Diwas (National Paddy Day)",
    "3-29": "Bhanu Jayanti",

    // Shrawan
    "4-1": "Saune Sankranti & Deuda Parva",
    "4-10": "Nag Panchami", // Approx
    "4-30": "Janai Purnima / Raksha Bandhan", // Approx

    // Bhadra
    "5-3": "Gai Jatra", // Approx
    "5-10": "Krishna Janmashtami", // Approx
    "5-12": "Gaura Parva", // Approx
    "5-14": "Teej (Hartalika)", // Approx
    "5-16": "Rishi Panchami", // Approx
    "5-22": "Nijamati Sewa Diwas", // Civil Service Day
    "5-29": "Indra Jatra", // Approx

    // Ashwin
    "6-3": "Constitution Day (Sambidhan Diwas)",
    "6-17": "Ghatasthapana", // Dashain Start (Approx)
    "6-24": "Phulpati", // Dashain
    "6-25": "Maha Asthami", // Dashain
    "6-26": "Maha Nawami", // Dashain
    "6-27": "Vijaya Dashami (Dashain Main Day)", // Dashain
    "6-28": "Ekadashi", // Dashain
    "6-29": "Dwadashi", // Dashain
    "6-30": "Kojagrat Purnima", // Dashain End

    // Kartik
    "7-15": "Laxmi Puja (Tihar)", // Approx
    "7-16": "Govardhan Puja / Mha Puja", // Approx
    "7-17": "Bhai Tika (Kija Puja)", // Approx
    "7-22": "Chhath Parva", // Approx
    "7-29": "Phalgunanda Jayanti",

    // Mangsir
    // Often fewer public holidays in Mangsir

    // Poush
    "9-15": "Tamu Lhosar",
    "9-27": "Prithvi Jayanti / National Unity Day",

    // Magh
    "10-1": "Maghe Sankranti / Maghi",
    "10-16": "Shahid Diwas (Martyrs Day)",
    "10-28": "Sonam Lhosar", // Approx

    // Falgun
    "11-7": "Prajatantra Diwas (Democracy Day)",
    "11-14": "Maha Shivaratri", // Approx
    "11-24": "Gyalpo Lhosar", // Approx
    "11-29": "Fagu Purnima (Holi - Hilly)", // Approx
    "11-30": "Fagu Purnima (Holi - Terai)", // Approx

    // Chaitra
    "12-1": "Chaite Dashain", // Approx
    "12-8": "Ghode Jatra", // Approx
    "12-26": "Ram Navami", // Approx
    "12-30": "New Year Eve"
};

export function getHoliday(date: BSDate): string | null {
    const key = `${date.month}-${date.day}`;
    if (FIXED_HOLIDAYS[key]) {
        return FIXED_HOLIDAYS[key];
    }
    return null;
}

export function isHoliday(date: BSDate): boolean {
    return date.dayOfWeek === 6 || !!getHoliday(date);
}
