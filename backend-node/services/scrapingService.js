const axios = require('axios');
const logger = require('../utils/logger');

// Background Scraper Service URL
const SCRAPER_SERVICE_URL = process.env.SCRAPER_SERVICE_URL || 'http://localhost:4000';

/**
 * Trigger the background scraper to scan for a specific media target
 * @param {string} mediaId - The ID of the protected media
 */
exports.triggerManualScrape = async (mediaId) => {
    try {
        logger.info(`Triggering manual scrape job for media: ${mediaId}`);
        const response = await axios.post(`${SCRAPER_SERVICE_URL}/api/scrape/trigger`, {
            mediaId
        });
        return response.data;
    } catch (error) {
        logger.error(`Scraping Service Integration Error: ${error.message}`);
        // Instead of breaking the main API, we just log and return false
        return false;
    }
};

/**
 * Fetch the current status and metrics of the Scraper Node
 */
exports.getScraperStatus = async () => {
    try {
        const response = await axios.get(`${SCRAPER_SERVICE_URL}/api/scrape/status`);
        return response.data;
    } catch (error) {
        logger.error(`Could not reach Scraping Service: ${error.message}`);
        return { status: 'offline', lastRun: null };
    }
};
