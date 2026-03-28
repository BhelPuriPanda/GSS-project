const express = require('express');
const mediaController = require('../controllers/mediaController');
const upload = require('../services/storageService');

const router = express.Router();

// Route: Fetch all original, protected media
router.route('/')
    .get(mediaController.getMedia);

// Route: Upload new media asset directly to the system (Frontend interaction)
// `upload.single('file')` matches the formData field name "file"
router.route('/upload')
    .post(upload.single('file'), mediaController.uploadMedia);

// Route: Fetch all identified violations (scraper detections)
router.route('/violations')
    .get(mediaController.getViolations);

// Route: Report an infringement (Internal system interaction - Scraper Node)
// Optional: we can add API Key verification middleware here to lock down report inserts
router.route('/report')
    .post(mediaController.reportViolation);

module.exports = router;
