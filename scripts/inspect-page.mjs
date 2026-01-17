import axios from 'axios';
import * as cheerio from 'cheerio';

async function main() {
    try {
        const response = await axios.get('https://www.hamropatro.com/calendar/2081/1');
        const $ = cheerio.load(response.data);

        // Find the first event and print its context
        const firstEvent = $('.event').first();
        console.log('--- EVENT ---');
        console.log('Event Text:', firstEvent.text());
        console.log('Event Parent HTML:', firstEvent.parent().html());
        console.log('Event Parent Class:', firstEvent.parent().attr('class'));

        console.log('\n--- DAY ---');
        // Find a day cell (usually has .nep class for Nepali date)
        const firstDay = $('.nep').first();
        console.log('Day Text:', firstDay.text());
        console.log('Day Parent HTML:', firstDay.parent().html());
        console.log('Day Parent Class:', firstDay.parent().attr('class'));
        console.log('Day Parent ID:', firstDay.parent().attr('id'));

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
