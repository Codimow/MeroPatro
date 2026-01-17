import { Effect, Context, Layer } from "effect";
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

export class DateService extends Context.Tag("DateService")<
    DateService,
    {
        readonly toBS: (date: Date) => Effect.Effect<BSDate>;
        readonly toAD: (bsDate: { year: number; month: number; day: number }) => Effect.Effect<Date>;
        readonly getCurrentBS: Effect.Effect<BSDate>;
        readonly getDaysInMonth: (year: number, month: number) => Effect.Effect<number>;
        readonly getFirstDayOfMonth: (year: number, month: number) => Effect.Effect<number>;
    }
>() { }

export const DateServiceLive = Layer.succeed(
    DateService,
    DateService.of({
        toBS: (date: Date) =>
            Effect.sync(() => {
                const nd = new NepaliDate(date);
                return {
                    year: nd.getYear(),
                    month: nd.getMonth() + 1, // nepali-date-converter is 0-indexed for month? Usually yes.
                    day: nd.getDate(),
                    dayOfWeek: nd.getDay(),
                };
            }),

        toAD: (bsDate) =>
            Effect.sync(() => {
                // NepaliDate constructor can take (year, monthIndex, day)
                // month is 0-indexed in the library usually
                const nd = new NepaliDate(bsDate.year, bsDate.month - 1, bsDate.day);
                return nd.toJsDate();
            }),

        getCurrentBS: Effect.sync(() => {
            const nd = new NepaliDate();
            return {
                year: nd.getYear(),
                month: nd.getMonth() + 1,
                day: nd.getDate(),
                dayOfWeek: nd.getDay(),
            };
        }),

        getDaysInMonth: (year, month) =>
            Effect.sync(() => {
                // A generic way to find days in month is to go to next month day 1 and subtract 1 day, 
                // or rely on library internal helper strictly.
                // nepali-date-converter doesn't expose getDaysInMonth statically easily maybe?
                // Let's check if we can construct year/month/32 and see if it rolls over or if there is a helper.
                // Actually, let's look for a dedicated function if possible, otherwise map distinct implementation.
                // For now, let's iterate or find a better way. 
                // Actually the library should handle invalid dates by rolling over, so we can find the last day.
                // A standard trick: new NepaliDate(year, month, 0).getDate() might work if it supports that JavaScriptism.
                // Let's try constructing the last possible days.

                // Better yet: look at source or usage.
                // Assumption: library has accurate data.
                // Quickest hack without docs:
                // Try creating day 32, if it changes month, then 32 is invalid.
                // Binary search or linear scan downwards from 32? No that's inefficient.
                // Actually, `bs-date` or similar libraries have metadata. `nepali-date-converter` might need a lookup.
                // Let's blindly trust `getDate()` on the last day if we can find it.
                // Wait, standard `Date` trick: new Date(y, m, 0) gives last day of prev month.
                // Let's try: new NepaliDate(year, month, 0) -> if it works like JS Date.
                const d = new NepaliDate(year, month, 0); // month is already +1 of target index? No.
                // If query is for month M (1-12).
                // Next month is M+1. JS Date: new Date(Y, M, 0) -> Last day of month M-1 (0-indexed).
                // So for month M (1-indexed), we want new NepaliDate(year, month, 0).
                return d.getDate();
            }),

        getFirstDayOfMonth: (year, month) =>
            Effect.sync(() => {
                const d = new NepaliDate(year, month - 1, 1);
                return d.getDay();
            })
    })
);
