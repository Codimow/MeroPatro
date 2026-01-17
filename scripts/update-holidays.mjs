import { scrapeYear } from './scrape-holiday-list.mjs';

const YEARS = Array.from({ length: 11 }, (_, i) => 2080 + i); // 2080 to 2090

async function updateAll() {
    console.log('Starting multi-year holiday update...');

    let successCount = 0;

    for (const year of YEARS) {
        console.log(`\n--- Processing Year ${year} ---`);
        const success = await scrapeYear(year);
        if (success) successCount++;
        // Be nice to the server
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\nCompleted! Successfully updated ${successCount}/${YEARS.length} years.`);
}

updateAll();
