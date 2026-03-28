require('dotenv').config();
const cron = require('node-cron');
const scraperService = require('./services/scraperService');

console.log("🕷️ Scraper Node Initialized...");

// Run the scraper task
const runScraper = async () => {
    console.log(`[${new Date().toISOString()}] Starting scraping cycle...`);
    try {
        await scraperService.executeCycle();
        console.log(`[${new Date().toISOString()}] Scraping cycle completed.`);
    } catch (error) {
        console.error("Error during scraping cycle:", error.message);
    }
};

// Check if triggered manually
if (process.argv.includes('--run-now')) {
    console.log("Manual trigger detected.");
    runScraper();
} else {
    // Schedule cron job based on .env or default to every hour
    const schedule = process.env.CRON_SCHEDULE || "0 * * * *";
    console.log(`Scheduling scraper to run on cron: ${schedule}`);
    
    cron.schedule(schedule, () => {
        runScraper();
    });
}
