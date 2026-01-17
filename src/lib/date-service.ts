import NepaliDate from "nepali-date-converter";

export interface BSDate {
    year: number;
    month: number;
    day: number;
    dayOfWeek: number; // 0 = Sunday, ...
}

export interface ADDate {
    year: number;
    month: number;
    day: number;
    dayOfWeek: number;
}

export const DateService = {
    toBS: (date: Date): BSDate => {
        const nd = new NepaliDate(date);
        return {
            year: nd.getYear(),
            month: nd.getMonth() + 1,
            day: nd.getDate(),
            dayOfWeek: nd.getDay(),
        };
    },

    toAD: (bsDate: { year: number; month: number; day: number }): Date => {
        const nd = new NepaliDate(bsDate.year, bsDate.month - 1, bsDate.day);
        return nd.toJsDate();
    },

    getCurrentBS: (): BSDate => {
        const nd = new NepaliDate();
        return {
            year: nd.getYear(),
            month: nd.getMonth() + 1,
            day: nd.getDate(),
            dayOfWeek: nd.getDay(),
        };
    },

    getDaysInMonth: (year: number, month: number): number => {
        const d = new NepaliDate(year, month, 0);
        return d.getDate();
    },

    getFirstDayOfMonth: (year: number, month: number): number => {
        const d = new NepaliDate(year, month - 1, 1);
        return d.getDay();
    }
};
