const express = require('express');
const mediaController = require('../controllers/mediaController');
const upload = require('../services/storageService');
const { auth } = require('../middleware/authMiddleware');
const { scraperAuth } = require('../middleware/scraperMiddleware');

const router = express.Router();

// --- FRONTEND DASHBOARD (USER) ROUTES ---
// Must be logged in via Auth JWT

// Get only the media that belongs to the currently logged in User
router.route('/me')
    .get(auth, mediaController.getMyMedia);

// Upload a new piece of media as the currently logged in User
router.route('/upload')
    .post(
        auth,
        upload.fields([
            { name: 'file', maxCount: 1 },
            { name: 'media', maxCount: 1 }
        ]),
        mediaController.uploadMedia
    );

// Get only the Violations that infringe upon the currently logged in User's media
router.route('/violations/me')
    .get(auth, mediaController.getMyViolations);


// --- INTERNAL SCRAPER ROUTES ---
// Protected by static x-api-key to prevent public spam

// Fetch ALL media in the database unconditionally so the Scraper can scan for everything
router.route('/all')
    .get(scraperAuth, mediaController.getAllProtectedMedia);

// Report a violation without needing a User JWT
router.route('/report')
    .post(scraperAuth, mediaController.reportViolation);

module.exports = router;
