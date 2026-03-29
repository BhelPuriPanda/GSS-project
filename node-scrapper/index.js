require('dotenv').config();
const cron = require('node-cron');
const http = require('http');
const scraperService = require('./services/scraperService');

console.log("🕷️ Scraper Node Initialized...");

// Create a dummy HTTP server so Render's free Web Service tier doesn't kill the process
const PORT = process.env.PORT || 10000;
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Scraper is running in the background!');
    res.end();
}).listen(PORT, () => {
    console.log(`Dummy server listening on port ${PORT} to satisfy Render Health Checks`);
});

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
