import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const YEAR = 2081;
const OUTPUT_FILE = path.join(process.cwd(), `src/data/holidays-${YEAR}.json`);

async function fetchMonth(year, month) {
    const url = `https://www.hamropatro.com/calendar/${year}/${month}`;
    console.log(`Fetching ${url}...`);
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const monthEvents = {};

        // Based on dump analysis:
        // Days are likely in a list or grid. The specific ID format observed was "2081-1-25-usn".
        // We will search for any element with an ID starting with the year-month pattern.

        // HamroPatro usually uses <li> tags for days in the calendar grid
        $('li').each((i, el) => {
            // Find the span that holds the ID
            const idSpan = $(el).find(`span[id*="${year}-"]`);
            if (idSpan.length > 0) {
                const id = idSpan.attr('id'); // e.g. 2081-1-25-usn
                if (!id) return;

                const parts = id.split('-');
                if (parts.length < 3) return;

                const dYear = parts[0];
                const dMonth = parts[1];
                const dDay = parts[2];

                // Ensure we are in the correct month (ignore overlaps)
                if (parseInt(dMonth) !== month) return;

                const eventEl = $(el).find('.event');
                const tithiEl = $(el).find('.tithi');
                const engDateEl = $(el).find('.eng'); // This usually contains the English day number

                let eventText = eventEl.text().trim();
                // Sometimes event text might be inside a link or sub-span, text() gets all descendant text.
                // Clean up any extra whitespace
                eventText = eventText.replace(/\s+/g, ' ');

                const tithi = tithiEl.first().text().trim();
                // get text from .eng but exclude nested elements like notes icon if any
                const engDay = engDateEl.contents().filter((_, node) => node.type === 'text').text().trim();

                if (eventText) {
                    const key = `${dMonth}-${dDay}`;
                    // Split events if multiple are listed with slash? Common in Nepal "EventA/EventB"
                    // But we can keep it as a string for display.

                    monthEvents[key] = {
                        date: `${dYear}-${dMonth}-${dDay}`,
                        event: eventText,
                        tithi: tithi,
                        engDay: engDay,
                        isPublicHoliday: true // For now, treat all scraper events as highlights
                    };
                }
            }
        });

        return monthEvents;
    } catch (e) {
        console.error(`Error fetching month ${month}:`, e.message);
        return {};
    }
}

async function main() {
    console.log(`Starting scraper for Year ${YEAR}...`);
    const allHolidays = {};

    for (let m = 1; m <= 12; m++) {
        const monthData = await fetchMonth(YEAR, m);
        Object.assign(allHolidays, monthData);
        // Be nice to the server
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Ensure data directory exists
    const dir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allHolidays, null, 2));
    console.log(`Successfully saved ${Object.keys(allHolidays).length} holiday entries to ${OUTPUT_FILE}`);
}

main();
