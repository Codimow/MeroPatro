import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.hamropatro.com/nepali-public-holidays';

async function fetchHolidays(year) {
    const url = `${BASE_URL}/${year}`;
    console.log(`Fetching public holidays from ${url}...`);
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
            }
        });
        const $ = cheerio.load(data);
        const holidays = {};

        // Iterate over all tables in the holidays wrapper
        $('.holidays-table-wrapper table tr').each((i, row) => {
            // Skip header rows
            if ($(row).find('th').length > 0) return;

            const linkEl = $(row).find('a');
            if (linkEl.length === 0) return;

            const url = linkEl.attr('href'); // e.g., /date/2081-1-1
            if (!url) return;

            // Extract date from URL
            const urlParts = url.split('/');
            const dateStr = urlParts[urlParts.length - 1]; // 2081-1-1
            const dateParts = dateStr.split('-');

            if (dateParts.length !== 3) return;
            const month = parseInt(dateParts[1]);
            const day = parseInt(dateParts[2]);
            const key = `${month}-${day}`;

            // Extract Name
            const nepaliNameEl = $(row).find('.holidayText');
            const englishNameEl = $(row).find('span.holidays-event-name').not('.holidayText');

            let nepaliName = nepaliNameEl.text().trim();
            let englishName = englishNameEl.text().trim();

            if (englishName.startsWith('(') && englishName.endsWith(')')) {
                englishName = englishName.substring(1, englishName.length - 1);
            }

            if (!nepaliName) {
                nepaliName = linkEl.text().trim();
            }

            // Fallback for English name formatting issues (sometimes it's inside the same span or different structure)
            // But from inspection, the separation seemed consistent. 
            // If English name is empty, we might want to try to parse it from Nepali string if it has parens?
            // For now, let's keep it simple.

            const fullName = englishName ? `${nepaliName} / ${englishName}` : nepaliName;

            // Extract Gregorian Date
            const adDateEl = $(row).find('td:nth-child(3)');
            const adDate = adDateEl.text().trim();

            // Create entry
            holidays[key] = {
                date: dateStr,
                event: fullName,
                isPublicHoliday: true,
                adDate: adDate
            };
        });

        return holidays;

    } catch (e) {
        console.error(`Error fetching holidays for ${year}:`, e.message);
        return {};
    }
}

async function scrapeYear(year) {
    const holidays = await fetchHolidays(year);
    const count = Object.keys(holidays).length;

    if (count > 0) {
        // Output file path: src/data/holidays/{year}.json
        // Ensure src/data/holidays exists
        const outputDir = path.join(process.cwd(), 'src/data/holidays');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputFile = path.join(outputDir, `${year}.json`);
        fs.writeFileSync(outputFile, JSON.stringify(holidays, null, 2));
        console.log(`Successfully saved ${count} public holidays for ${year} to ${outputFile}`);
        return true;
    } else {
        console.error(`No holidays found for ${year}!`);
        return false;
    }
}

// Check if running directly or imported
import { fileURLToPath } from 'url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const yearArg = process.argv[2];
    const currentYear = 2082; // Default to current Nepali year
    const year = yearArg ? parseInt(yearArg) : currentYear;

    if (isNaN(year)) {
        console.error('Invalid year provided.');
        process.exit(1);
    }

    scrapeYear(year);
}

export { scrapeYear };
