const dotenv = require("dotenv");
dotenv.config();

exports.scraperAuth = (req, res, next) => {
    const apiKey = req.header("x-api-key");

    if (!apiKey) {
        return res.status(401).json({ success: false, message: "Scraper API Key missing" });
    }

    if (apiKey !== process.env.SCRAPER_API_KEY) {
        return res.status(403).json({ success: false, message: "Invalid Scraper API Key" });
    }

    next();
};
