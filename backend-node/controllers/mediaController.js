const fs = require('fs');
const Media = require('../models/mediaModel');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');
const pythonService = require('../services/pythonService');
const scrapingService = require('../services/scrapingService');

/**
 * @desc    Upload a new media asset, send it to Python for ML, store in MongoDB
 * @route   POST /api/media/upload
 */
exports.uploadMedia = async (req, res, next) => {
    if (!req.file) {
        return next(new AppError('Please provide a file!', 400));
    }

    const { title, type } = req.body;
    
    if (!title || !type) {
        // Cleanup the file if invalid payload
        fs.unlinkSync(req.file.path);
        return next(new AppError('Please provide title and type field', 400));
    }

    let fingerprintData = { pHash: null, dHash: null, embedding: [] };

    try {
        fingerprintData = await pythonService.extractFingerprint(req.file.path, type);

        // Optional: Trigger a scraper check specifically for this new media immediately
        // scrapingService.triggerManualScrape(newMedia._id);

    } catch (error) {
        logger.error(`Python ML Service Error: ${error.message}`);
        // Optionally: We can still insert the file without the fingerprint, or fail and delete the file.
        // As per the architecture, the backend saves the fingerprint profile, so we fail if python is down.
        fs.unlinkSync(req.file.path);
        return next(new AppError('Failed to extract media fingerprint from Python ML Service', 500));
    }

    // Clean File URL path to store in DB
    const relativeFilePath = `/uploads/${req.file.filename}`;

    // Create DB Document
    const newMedia = await Media.create({
        title,
        type,
        fileUrl: relativeFilePath,
        fingerprint: fingerprintData,
        isViolation: false,
        owner: req.user ? (req.user.id || req.user._id) : undefined
    });

    res.status(201).json({
        status: 'success',
        data: {
            media: newMedia
        }
    });
};

/**
 * @desc    Get all protected original media assets for the LOGGED IN USER
 * @route   GET /api/media/me
 * @note    Used by Frontend Dashboard
 */
exports.getMyMedia = async (req, res, next) => {
    const userId = req.user ? (req.user.id || req.user._id) : null;
    const mediaAssets = await Media.find({ isViolation: false, owner: userId }).sort({ createdAt: -1 });

    res.status(200).json({
        status: 'success',
        results: mediaAssets.length,
        data: {
            media: mediaAssets
        }
    });
};

/**
 * @desc    Get ALL protected original media across the entire system
 * @route   GET /api/media/all
 * @note    Used securely by the Background Scraper via API Key
 */
exports.getAllProtectedMedia = async (req, res, next) => {
    const mediaAssets = await Media.find({ isViolation: false }).sort({ createdAt: -1 });

    res.status(200).json({
        status: 'success',
        results: mediaAssets.length,
        data: {
            media: mediaAssets
        }
    });
};

/**
 * @desc    Report a newly found infringement/violation (Fired by Scraper Node)
 * @route   POST /api/media/report
 */
exports.reportViolation = async (req, res, next) => {
    const { title, type, sourceUrl, matchedWith, similarityScore } = req.body;

    if (!sourceUrl || !matchedWith || !similarityScore) {
        return next(new AppError('Violation report must include sourceUrl, matchedWith (ID), and similarityScore', 400));
    }

    // Verify the original asset exists
    const originalMedia = await Media.findById(matchedWith);
    if (!originalMedia) {
        return next(new AppError('The reference original media ID does not exist', 404));
    }

    const violation = await Media.create({
        title: title || `Violation of ${originalMedia.title}`,
        type: type || originalMedia.type,
        isViolation: true,
        sourceUrl,
        matchedWith,
        similarityScore,
        owner: originalMedia.owner // Inherit the actual owner of the stolen file!
    });

    res.status(201).json({
        status: 'success',
        data: {
            violation
        }
    });
};

/**
 * @desc    Get all violations specific to the Logged in user
 * @route   GET /api/media/violations/me
 */
exports.getMyViolations = async (req, res, next) => {
    const userId = req.user ? (req.user.id || req.user._id) : null;

    // Populate the 'matchedWith' field so frontend knows WHAT asset was stolen
    const violations = await Media.find({ isViolation: true, owner: userId })
        .populate('matchedWith', 'title fileUrl type')
        .sort({ createdAt: -1 });

    res.status(200).json({
        status: 'success',
        results: violations.length,
        data: {
            violations
        }
    });
};
