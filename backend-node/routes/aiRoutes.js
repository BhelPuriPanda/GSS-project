const express = require('express');
const aiController = require('../controllers/aiController');

const router = express.Router();

// Define route for AI analysis
router.post('/analyze', aiController.analyzeViolation);

module.exports = router;
