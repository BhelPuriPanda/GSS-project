const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

class ScraperService {
    constructor() {
        this.backendUrl = process.env.BACKEND_URL || 'https://daps-backend-fg54.onrender.com';
        this.pythonUrl = process.env.PYTHON_ML_URL || 'https://daps-python.onrender.com';
    }

    async executeCycle() {
        console.log("\n>>> [TRACE] Starting Hybrid Scraper executeCycle...");
        
        // 1. Fetch Protected Media
        const referenceMedia = await this.fetchProtectedMedia();
        console.log(`>>> [TRACE] Reference media found: ${referenceMedia?.length || 0}`);
        if (!referenceMedia || referenceMedia.length === 0) {
            console.log("No reference media found. Skipping cycle.");
            return;
        }

        // 2. Web Scraping URL Extraction
        const scrapedItems = await this.scrapeTargetSites();
        console.log(`\n>>> [TRACE] Extracted total URLs to process: ${scrapedItems?.length || 0}`);
        
        // 3. Isolated Downloading and Python Verification loop (Strict Concurrency limit of 1)
        for (const scraped of scrapedItems) {
            let currentFilePath = scraped.preDownloadedPath;

            if (!currentFilePath) {
                console.log(`>>> [TRACE] Downloading image via Axios: ${scraped.url}`);
                const dl = await this.downloadImageToTemp(scraped.url);
                if (!dl.success) {
                    this.cleanupFile(dl.filePath);
                    continue;
                }
                currentFilePath = dl.filePath;
            }

            console.log(`>>> [TRACE] Processing scraped file: ${currentFilePath}`);
            for (const ref of referenceMedia) {
                console.log(`>>> [TRACE] Attempting Python verification against ref: ${ref._id}`);
                const matchResult = await this.verifyWithPython(currentFilePath, ref);
                console.log(`>>> [TRACE] Python returned match: ${matchResult?.comparison?.match}`);
                
                if (matchResult && matchResult.comparison?.match === true) {
                    console.log(`🚨 Match found for ref ${ref._id} with file ${scraped.url}`);
                    
                    // 4. Report to Backend
                    await this.reportToBackend(scraped.url, ref._id, matchResult.comparison.cosine_similarity);
                    break; 
                }
            }
            
            // Cleanup: Delete local scraped file instantly after comparisons are done
            this.cleanupFile(currentFilePath);
        }
    }

    async fetchProtectedMedia() {
        try {
            console.log(`Fetching reference media from ${this.backendUrl}/api/media/all`);
            const response = await axios.get(`${this.backendUrl}/api/media/all`, {
                headers: { 'x-api-key': process.env.SCRAPER_API_KEY || 'daps-internal-key-2026' }
            });
            return response.data.data.media || [];
        } catch (error) {
            console.error("Failed to fetch protected media:", error.message);
            return [];
        }
    }

    async extractUrlsWithCheerio(url) {
        try {
            console.log(`[Cheerio] Scraping static HTML from ${url}...`);
            const { data } = await axios.get(url, { timeout: 10000 });
            const $ = cheerio.load(data);
            const imageUrls = [];
            $('img').each((i, el) => {
                const src = $(el).attr('src');
                if (src && !src.startsWith('data:')) {
                    try {
                        imageUrls.push(new URL(src, url).href);
                    } catch (e) {
                        imageUrls.push(src);
                    }
                }
            });
            return [...new Set(imageUrls)].slice(0, 4); // Limit to top 4 for demo
        } catch (e) {
            console.error(`[Cheerio] Failed to scrape ${url}:`, e.message);
            return [];
        }
    }

    async extractUrlsWithPuppeteer(url) {
        try {
            console.log(`[Puppeteer] Launching headless engine for ${url}...`);
            const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            
            console.log(`[Puppeteer] Navigating and waiting for lazy loads...`);
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            
            // Scroll down briefly to trigger JS lazy loading
            await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const imageUrls = await page.evaluate(() => {
                const imgs = Array.from(document.querySelectorAll('img'));
                return imgs.map(img => img.src).filter(src => src && !src.startsWith('data:'));
            });
            
            console.log(`[Puppeteer] Extraction complete. Nuking instance to save memory.`);
            await browser.close();
            return [...new Set(imageUrls)].slice(0, 4); // Limit to top 4 for demo
        } catch (e) {
            console.error(`[Puppeteer] Failed to dynamic-scrape ${url}:`, e.message);
            return [];
        }
    }

    async downloadImageToTemp(imageUrl) {
        const tempFilePath = path.join(__dirname, '..', `temp_dl_${Date.now()}_${Math.floor(Math.random() * 1000)}.jpg`);
        try {
            const response = await axios({ url: imageUrl, method: 'GET', responseType: 'stream', timeout: 10000 });
            const writer = fs.createWriteStream(tempFilePath);
            response.data.pipe(writer);
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
            return { filePath: tempFilePath, success: true };
        } catch (error) {
            console.error(`Axios failed to download image ${imageUrl}`);
            return { filePath: tempFilePath, success: false };
        }
    }

    async getDemoMockUrls(fakeSiteId) {
        const tempFilePath = path.join(__dirname, '..', `temp_mock_${fakeSiteId}.jpg`);
        const uploadsDir = path.join(__dirname, '..', '..', 'backend-node', 'uploads');
        if (fs.existsSync(uploadsDir)) {
            const imageFiles = fs.readdirSync(uploadsDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
            if (imageFiles.length > 0) {
                // Randomly select one of the protected files to simulate an exact dummy 100% piracy hit
                const randomFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];
                fs.copyFileSync(path.join(uploadsDir, randomFile), tempFilePath);
                return [{ url: `http://mock-fake-site${fakeSiteId}.com/${randomFile}`, preDownloadedPath: tempFilePath }];
            }
        }
        return [];
    }

    async scrapeTargetSites() {
        console.log("\n[Routing] Executing Hybrid Routing Protocols...");
        const HEAVY_SITES = process.env.HEAVY_SITES ? process.env.HEAVY_SITES.split(',') : ['https://pinterest.com/home', 'https://youtube.com'];
        const STATIC_SITES = process.env.STATIC_SITES ? process.env.STATIC_SITES.split(',') : ['https://unsplash.com/t/nature', 'https://pixabay.com/images/search/nature/', 'https://commons.wikimedia.org/wiki/Main_Page'];
        const FAKE_SITES = [1, 2, 3, 4];

        let allUrls = [];

        // 1. Heavy Sites (Puppeteer) MAX 2
        for (let i = 0; i < Math.min(HEAVY_SITES.length, 2); i++) {
             const urls = await this.extractUrlsWithPuppeteer(HEAVY_SITES[i]);
             urls.forEach(u => allUrls.push({ url: u, engine: 'puppeteer' }));
        }

        // 2. Static Sites (Cheerio) MAX 3
        for (let i = 0; i < Math.min(STATIC_SITES.length, 3); i++) {
             const urls = await this.extractUrlsWithCheerio(STATIC_SITES[i]);
             urls.forEach(u => allUrls.push({ url: u, engine: 'cheerio' }));
        }

        // 3. Fake Sites MAX 4 (Hooks local storage dummy to guarantee database hit demo)
        for (const fakeSiteId of FAKE_SITES) {
             const mocks = await this.getDemoMockUrls(fakeSiteId);
             mocks.forEach(m => allUrls.push({ url: m.url, engine: 'mock', preDownloadedPath: m.preDownloadedPath }));
        }

        return allUrls;
    }

    async verifyWithPython(filePath, referenceProfile) {
        try {
            const formData = new FormData();
            formData.append('file', fs.createReadStream(filePath));
            
            if (referenceProfile.fingerprint && referenceProfile.fingerprint.pHash) {
                formData.append('target_phash', referenceProfile.fingerprint.pHash);
            }
            if (referenceProfile.fingerprint && referenceProfile.fingerprint.embedding) {
                formData.append('target_embedding', JSON.stringify(referenceProfile.fingerprint.embedding));
            }
            
            const endpoint = filePath.endsWith('.mp4') ? '/compare/video' : '/compare/image';
            const response = await axios.post(`${this.pythonUrl}${endpoint}`, formData, {
                headers: { ...formData.getHeaders() }
            });
            return response.data;
        } catch (error) {
            console.error("Failed to verify with Python API:", error.message);
            return { match: false, similarity: 0 };
        }
    }

    async reportToBackend(sourceUrl, referenceId, similarity) {
        try {
            console.log(`Reporting violation to backend for URL: ${sourceUrl}`);
            await axios.post(`${this.backendUrl}/api/media/report`, {
                sourceUrl: sourceUrl,
                matchedWith: referenceId,
                similarityScore: similarity
            }, {
                headers: { 'x-api-key': process.env.SCRAPER_API_KEY || 'daps-internal-key-2026' }
            });
            console.log("Violation reported successfully.");
        } catch (error) {
            console.error("Failed to report violation:", error.message);
        }
    }

    cleanupFile(filePath) {
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error("Failed to cleanup file:", error.message);
        }
    }
}

module.exports = new ScraperService();
