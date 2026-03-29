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

/**
 * @desc    Summarize all violations into an executive brief using OpenRouter AI
 * @route   POST /api/ai/summarize
 */
exports.summarizeViolations = async (req, res, next) => {
    const { violations } = req.body;

    if (!violations || !Array.isArray(violations) || violations.length === 0) {
        return next(new AppError('Please provide an array of violations to summarize.', 400));
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
        return next(new AppError('OpenRouter API Key is not configured on the server.', 500));
    }

    const violationList = violations.map((v, i) => 
        `${i + 1}. Asset: "${v.matchedTitle}" | Similarity: ${Math.round((v.similarityScore || 0) * 100)}% | Found at: ${v.sourceUrl}`
    ).join('\n');

    const prompt = `You are a digital rights analyst. Below are copyright violations detected by our automated scraper. Respond in EXACTLY 3 short lines:
Line 1: Total violations count and severity level (Low/Medium/High/Critical).
Line 2: Which original asset(s) are being pirated the most and from which domains.
Line 3: One clear recommended next step.

Violations:
${violationList}

Keep each line under 20 words. No bullet points, no markdown, no extra text.`;

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
                    "HTTP-Referer": "http://localhost:4000",
                    "X-Title": "Digital Asset Protection System"
                }
            }
        );

        logger.info(`OpenRouter Summary Response Status: ${response.status}`);

        const text = response.data.choices?.[0]?.message?.content || "Summary generation failed or returned empty.";

        res.status(200).json({
            status: 'success',
            data: {
                summary: text
            }
        });

    } catch (error) {
        logger.error(`OpenRouter Summary API Error: ${error.response ? JSON.stringify(error.response.data) : error.message}`);
        return next(new AppError('Failed to generate AI summary from OpenRouter', 500));
    }
};
