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
        // 1. Fetch Protected Media
        const referenceMedia = await this.fetchProtectedMedia();
        if (!referenceMedia || referenceMedia.length === 0) {
            console.log("No reference media found. Skipping cycle.");
            return;
        }

        // 2. Web Scraping & Comparison
        const scrapedItems = await this.scrapeTargetSites();
        
        for (const scraped of scrapedItems) {
            for (const ref of referenceMedia) {
                // 3. Verify with Python ML Service
                const matchResult = await this.verifyWithPython(scraped.filePath, ref);
                
                if (matchResult && matchResult.comparison?.match === true) {
                    console.log(`🚨 Match found for ref ${ref._id} with file ${scraped.filePath}`);
                    
                    // 4. Report to Backend
                    await this.reportToBackend(scraped.url, ref._id, matchResult.comparison.similarity);
                    
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
            console.log(`Fetching reference media from ${this.backendUrl}/api/media`);
            const response = await axios.get(`${this.backendUrl}/api/media`);
            return response.data.data;
        } catch (error) {
            console.error("Failed to fetch protected media:", error.message);
            return [];
        }
    }

    async scrapeTargetSites() {
        // MOCK SCRAPING LOGIC
        // Here you would use axios/cheerio or puppeteer to download images from target sites.
        console.log("Scraping target websites...");
        
        // Simulating the creation of a temporary downloaded image
        const tempFilePath = path.join(__dirname, '..', 'temp_scraped.jpg');
        fs.writeFileSync(tempFilePath, "dummy binary data");

        return [
            {
                url: "http://mock-piracy-site.com/suspicious_image.jpg",
                filePath: tempFilePath
            }
        ];
    }

    async verifyWithPython(filePath, referenceProfile) {
        try {
            console.log(`Verifying image ${filePath} with python ML service...`);
            
            // To properly send multipart/form-data
            /*
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
            */
            
            // MOCK PYTHON RESPONSE
            return {
                match: true,
                similarity: 0.96
            };
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
