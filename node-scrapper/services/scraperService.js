const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
// cheerio could be used here if doing custom HTML parsing
// const cheerio = require('cheerio'); 

class ScraperService {
    constructor() {
        this.backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
        this.pythonUrl = process.env.PYTHON_ML_URL || 'http://localhost:8000';
    }

    async executeCycle() {
        console.log(">>> [TRACE] Starting executeCycle...");
        // 1. Fetch Protected Media
        const referenceMedia = await this.fetchProtectedMedia();
        console.log(`>>> [TRACE] Reference media found: ${referenceMedia?.length || 0}`);
        if (!referenceMedia || referenceMedia.length === 0) {
            console.log("No reference media found. Skipping cycle.");
            return;
        }

           // 2. Web Scraping & Comparison
        const scrapedItems = await this.scrapeTargetSites();
        console.log(`>>> [TRACE] Scraped items found: ${scrapedItems?.length || 0}`);
        
        for (const scraped of scrapedItems) {
            console.log(`>>> [TRACE] Processing scraped file: ${scraped.filePath}`);
            for (const ref of referenceMedia) {
                console.log(`>>> [TRACE] Attempting Python verification against ref: ${ref._id}`);
                // 3. Verify with Python ML Service
                const matchResult = await this.verifyWithPython(scraped.filePath, ref);
                console.log(`>>> [TRACE] Python returned:`, JSON.stringify(matchResult));
                
                if (matchResult && matchResult.comparison?.match === true) {
                    console.log(`🚨 Match found for ref ${ref._id} with file ${scraped.filePath}`);
                    
                    // 4. Report to Backend
                    await this.reportToBackend(scraped.url, ref._id, matchResult.comparison.cosine_similarity);
                    
                    // Break inner loop since it's already flagged
                    break; 
                }
            }
            
            // Cleanup: Delete local scraped file
            this.cleanupFile(scraped.filePath);
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

    async scrapeTargetSites() {
        console.log("Scraping target websites (Mocking by downloading an existing uploaded image)...");
        const tempFilePath = path.join(__dirname, '..', 'temp_scraped.jpg');
        
        try {
            // Find a real image that was uploaded via the Node Backend to ensure a 100% test match!
            const uploadsDir = path.join(__dirname, '..', '..', 'backend-node', 'uploads');
            if (fs.existsSync(uploadsDir)) {
                const files = fs.readdirSync(uploadsDir);
                const imageFiles = files.filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'));
                
                if (imageFiles.length > 0) {
                    const sourceFile = path.join(uploadsDir, imageFiles[0]);
                    fs.copyFileSync(sourceFile, tempFilePath);
                    
                    return [{
                        url: `http://mock-piracy-site.com/${imageFiles[0]}`,
                        filePath: tempFilePath
                    }];
                }
            }
            console.log("No valid source images found to serve as a mock scrape target.");
            return [];
        } catch (error) {
            console.error("Mock scraping failed", error);
            return [];
        }
    }

    async verifyWithPython(filePath, referenceProfile) {
        try {
            console.log(`Verifying image ${filePath} with python ML service...`);
            
            // To properly send multipart/form-data
            const formData = new FormData();
            formData.append('file', fs.createReadStream(filePath));
            
            // The Python service expects target_phash and target_embedding as form fields for comparison mode
            if (referenceProfile.fingerprint && referenceProfile.fingerprint.pHash) {
                formData.append('target_phash', referenceProfile.fingerprint.pHash);
            }
            if (referenceProfile.fingerprint && referenceProfile.fingerprint.embedding) {
                formData.append('target_embedding', JSON.stringify(referenceProfile.fingerprint.embedding));
            }
            
            // Ensure you route to /compare/image or /compare/video based on file type
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
                console.log(`Cleaned up temp file: ${filePath}`);
            }
        } catch (error) {
            console.error("Failed to cleanup file:", error.message);
        }
    }
}

module.exports = new ScraperService();
