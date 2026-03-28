# Node Scraper Architecture

The Scraper service is a completely decoupled background worker running on Node.js using `node-cron`. It simulates a real-world crawler by actively searching targeted domains for pirated versions of the secured media.

## Dual-Engine Extractor
The Scraper implements a strict memory-safe hybrid approach:
1. **Puppeteer (Heavy JS Sites):** When targeting sites like `pinterest.com` or `reddit.com`, the scraper launches a headless Chromium browser (`puppeteer`). It renders the Javascript, scrolls down to execute lazy-loaded image hooks, rips the underlying `src` links out of the DOM, and immediately kills the browser instance to prevent RAM leaks.
2. **Cheerio (Static Sites):** When targeting basic blogs or forums (`unsplash.com`, `commons.wikimedia.org`), it strictly uses `axios` and `cheerio` to natively parse the `<img src="..">` tags, bypassing Chromium entirely for massive performance gains.

## The Cron Pipeline (`services/scraperService.js`)
1. **Fetch:** Pulls all protected fingerprints universally via `GET http://localhost:5000/api/media/all` (Requires `SCRAPER_API_KEY`).
2. **Extract:** Dispatches URLs to their respective engines (Puppeteer/Cheerio) and returns a clean array of image URLs.
3. **Verify:** Streams one image at a time locally and sends via `multipart/form-data` to the Python ML Engine (`http://localhost:8000/compare/image`). 
4. **Report:** If Python returns a Cosine Similarity match representing IP theft, it hits `POST http://localhost:5000/api/media/report` to log the violation. It immediately deletes the physical suspect image locally to save disk space.

## Manual Testing for Frontend UI
If you are designing the Dashboard and need to instantly test Live Violation popups without waiting for the hourly cron job:
Open a terminal in the `node-scrapper` folder and run:
```bash
node index.js --run-now
```
This forces the cycle instantly and allows you to watch the logs sequentially hit the Python math processor.
