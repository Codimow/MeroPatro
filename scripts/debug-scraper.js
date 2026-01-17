
const axios = require('axios');
const fs = require('fs');

async function fetchAndDump() {
    try {
        const url = 'https://www.hamropatro.com/calendar/2081/1';
        console.log(`Fetching ${url}...`);
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        fs.writeFileSync('debug_calendar.html', response.data);
        console.log('Saved to debug_calendar.html');
    } catch (error) {
        console.error('Error:', error.message);
    }
}

fetchAndDump();
