const axios = require('axios');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

/**
 * @desc    Analyze a violation and generate a legal strategy using OpenRouter AI
 * @route   POST /api/ai/analyze
 */
exports.analyzeViolation = async (req, res, next) => {
    const { violationTitle, sourceUrl, matchedTitle } = req.body;

    if (!violationTitle || !sourceUrl || !matchedTitle) {
        return next(new AppError('Please provide violation details to analyze.', 400));
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
        return next(new AppError('OpenRouter API Key is not configured on the server.', 500));
    }

    const prompt = `As a digital piracy and legal expert, provide a very concise, actionable 2-3 sentence strategy on how I should handle the following copyright violation. 
My original protected asset is titled: "${matchedTitle}".
It was pirated and found at this URL: "${sourceUrl}".
The scraper flagged it as: "${violationTitle}".
What should my immediate next steps be to issue a takedown or protect my asset? Be professional and direct.`;

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "google/gemma-3n-e4b-it:free",
                messages: [{ role: "user", content: prompt }]
            },
            {
                headers: {
                    Authorization: `Bearer ${openRouterApiKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:4000", // Default react port if applicable
                    "X-Title": "Digital Asset Protection System"
                }
            }
        );

        logger.info(`OpenRouter Response Status: ${response.status}`);
        
        const text = response.data.choices?.[0]?.message?.content || "Generation failed or returned empty.";

        res.status(200).json({
            status: 'success',
            data: {
                strategy: text
            }
        });

    } catch (error) {
        logger.error(`OpenRouter API Error: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
        return next(new AppError('Failed to generate AI strategy from OpenRouter', 500));
    }
};
