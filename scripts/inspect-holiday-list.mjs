import axios from 'axios';
import fs from 'fs';

const url = 'https://www.hamropatro.com/nepali-public-holidays/2081';

async function run() {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
            }
        });
        fs.writeFileSync('debug_holidays.html', data);
        console.log('Saved debug_holidays.html');
    } catch (e) {
        console.error(e);
    }
}

run();
