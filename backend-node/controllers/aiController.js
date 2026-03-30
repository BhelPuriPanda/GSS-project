const axios = require('axios');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

// ═══ CASCADING MODEL FALLBACK CHAIN ═══
// If a model returns 429 (rate-limited), the next one in the list is tried.
// All are free-tier models on OpenRouter. Order: fastest → most reliable.
const MODEL_CASCADE = [
    'google/gemma-3n-e4b-it:free',
    'meta-llama/llama-4-maverick:free',
    'qwen/qwen3-14b:free',
    'deepseek/deepseek-r1-0528:free',
];

/**
 * Calls OpenRouter with automatic model fallback.
 * Tries each model in MODEL_CASCADE until one succeeds.
 * @param {string} prompt - The user prompt
 * @param {string} apiKey - OpenRouter API key
 * @returns {Promise<string>} - The generated text
 */
async function callWithFallback(prompt, apiKey) {
    let lastError = null;

    for (const model of MODEL_CASCADE) {
        try {
            logger.info(`Attempting model: ${model}`);

            const response = await axios.post(
                "https://openrouter.ai/api/v1/chat/completions",
                {
                    model,
                    messages: [{ role: "user", content: prompt }]
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        "Content-Type": "application/json",
                        "HTTP-Referer": "http://localhost:4000",
                        "X-Title": "Digital Asset Protection System"
                    },
                    timeout: 30000 // 30 second timeout per model
                }
            );

            const text = response.data.choices?.[0]?.message?.content;
            if (text) {
                logger.info(`Success with model: ${model}`);
                return text;
            }

            // If response was empty, try next model
            logger.warn(`Model ${model} returned empty response, trying next...`);
        } catch (error) {
            const status = error.response?.status;
            const errMsg = error.response?.data?.error?.message || error.message;
            logger.warn(`Model ${model} failed (${status || 'timeout'}): ${errMsg}`);
            lastError = error;

            // Cascade on rate-limit (429), not-found (404), or server errors (5xx)
            // Only stop on auth errors (401/403) since those affect all models
            if (status && status !== 429 && status !== 404 && status < 500) {
                throw error;
            }

            // Otherwise continue to next model
        }
    }

    // All models exhausted
    throw lastError || new Error('All models in the cascade failed.');
}

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
        const text = await callWithFallback(prompt, openRouterApiKey);

        res.status(200).json({
            status: 'success',
            data: {
                strategy: text
            }
        });

    } catch (error) {
        logger.error(`OpenRouter API Error (all models failed): ${error.response ? JSON.stringify(error.response.data) : error.message}`);
        return next(new AppError(`Failed to generate AI strategy from OpenRouter due to error: ${error.response ? JSON.stringify(error.response.data) : error.message}`, 500));
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

    const prompt = `You are a senior digital rights enforcement analyst. Analyze these copyright violations detected by our perceptual-hash scraper and write an executive intelligence brief.

Cover these points in 5-7 flowing sentences:
- How many violations were found and overall threat severity (Low/Medium/High/Critical)
- Which specific assets are being targeted and at what similarity confidence
- Which domains are distributing the pirated content
- Potential impact on the creator's intellectual property
- Recommended enforcement actions (DMCA takedowns, platform reporting, legal steps)

Violations:
${violationList}

CRITICAL FORMATTING RULES: Output ONLY plain text. Do NOT use any markdown. No asterisks, no bold, no headers, no bullet points, no numbered lists. Just clean paragraph sentences. Do NOT start with a title or heading. Jump straight into the analysis.`;

    try {
        const text = await callWithFallback(prompt, openRouterApiKey);

        res.status(200).json({
            status: 'success',
            data: {
                summary: text
            }
        });

    } catch (error) {
        logger.error(`OpenRouter Summary API Error (all models failed): ${error.response ? JSON.stringify(error.response.data) : error.message}`);
        return next(new AppError(`Failed to generate AI summary from OpenRouter due to error: ${error.response ? JSON.stringify(error.response.data) : error.message}`, 500));
    }
};

/**
 * @desc    Draft a formal DMCA takedown notice email for a violation
 * @route   POST /api/ai/draft-takedown
 */
exports.draftTakedown = async (req, res, next) => {
    const { matchedTitle, sourceUrl, similarityScore, ownerName } = req.body;

    if (!matchedTitle || !sourceUrl) {
        return next(new AppError('Please provide the matched asset title and source URL.', 400));
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
        return next(new AppError('OpenRouter API Key is not configured on the server.', 500));
    }

    const similarity = similarityScore ? `${Math.round(similarityScore * 100)}%` : 'high';
    const owner = ownerName || '[YOUR NAME]';

    const prompt = `Draft a professional copyright takedown request email that a content creator can send to a website hosting their pirated content. This should be country-neutral and not reference any specific law like DMCA.

Details:
- Creator/Owner Name: ${owner}
- Original Asset Title: "${matchedTitle}"
- Infringing URL where pirated content was found: ${sourceUrl}
- Perceptual hash similarity confidence: ${similarity}

The email should include:
1. A clear subject line (on its own line, prefixed with "Subject: ")
2. Professional greeting
3. Identification of the copyrighted work owned by the creator
4. Identification of the infringing material with the exact URL
5. Statement that the use is unauthorized and infringes copyright
6. Request for immediate removal of the infringing content
7. Statement that the creator is willing to take further legal action if necessary
8. Professional closing with signature placeholder

CRITICAL FORMATTING RULES: Output ONLY plain text. No markdown, no asterisks, no bold formatting. Use line breaks for structure. The email should be ready to copy-paste and send. Keep it professional, firm, and legally sound.`;

    try {
        const text = await callWithFallback(prompt, openRouterApiKey);

        res.status(200).json({
            status: 'success',
            data: {
                email: text
            }
        });

    } catch (error) {
        logger.error(`OpenRouter Takedown Draft Error (all models failed): ${error.response ? JSON.stringify(error.response.data) : error.message}`);
        return next(new AppError(`Failed to generate takedown draft: ${error.response ? JSON.stringify(error.response.data) : error.message}`, 500));
    }
};
