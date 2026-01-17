
import { Effect } from "effect";
import { DateService, DateServiceLive } from "../src/lib/date-service";

const run = async () => {
    const program = Effect.gen(function* (_) {
        const service = yield* _(DateService);

        console.log("--- MeroPatro Verification ---");

        // 1. Check Today
        const todayBS = yield* _(service.getCurrentBS);
        console.log(`Today BS: ${todayBS.year}-${todayBS.month}-${todayBS.day}`);

        // 2. Check Conversion (2024-04-13 -> should be 2081-01-01)
        const newYearAD = new Date("2024-04-13T00:00:00.000Z"); // Use UTC or ensure TZ is handled if library is strict. 
        // NOTE: nepali-date-converter uses local time of the date object usually. 
        // Let's create a date object that represents "Approx" midday to avoid timezone edge cases
        const targetDate = new Date(2024, 3, 13, 12, 0, 0); // April 13, 2024
        const convertedBS = yield* _(service.toBS(targetDate));
        console.log(`2024-04-13 AD -> ${convertedBS.year}-${convertedBS.month}-${convertedBS.day} BS`);

        if (convertedBS.year === 2081 && convertedBS.month === 1 && convertedBS.day === 1) {
            console.log("✅ New Year 2081 Verified!");
        } else {
            console.log("❌ New Year Verification Failed - Check library TZ handling.");
        }

        // 3. Days in Month
        const dys = yield* _(service.getDaysInMonth(2081, 1));
        console.log(`Days in 2081/1: ${dys}`);
    }).pipe(Effect.provide(DateServiceLive));

    Effect.runSync(program);
};

run().catch(console.error);
