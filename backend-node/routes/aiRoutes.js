const express = require('express');
const aiController = require('../controllers/aiController');

const router = express.Router();

// Define route for AI analysis
router.post('/analyze', aiController.analyzeViolation);
router.post('/summarize', aiController.summarizeViolations);
router.post('/draft-takedown', aiController.draftTakedown);

module.exports = router;
