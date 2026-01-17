import pkg from 'hamro-patro-scraper';

async function main() {
    try {
        console.log('Package exports:', pkg);
    } catch (error) {
        // Try to get today's date info
        const today = await scrapeDate();
        console.log('Today:', JSON.stringify(today, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
