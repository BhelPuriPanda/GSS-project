const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const logger = require('../utils/logger');

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

/**
 * Extracts fingerprint from Python ML Service
 * @param {string} filePath - Local absolute or relative path to the media file
 * @param {string} type - 'image' or 'video'
 * @returns {Object} { pHash, dHash, embedding }
 */
exports.extractFingerprint = async (filePath, type) => {
    try {
        const pythonFormData = new FormData();
        pythonFormData.append('file', fs.createReadStream(filePath));

        const pythonEndpoint = type === 'video' ? '/compare/video' : '/compare/image';
        
        logger.info(`Sending ${type} to Python Service: ${PYTHON_SERVICE_URL}${pythonEndpoint}`);

        const response = await axios.post(`${PYTHON_SERVICE_URL}${pythonEndpoint}`, pythonFormData, {
            headers: {
                ...pythonFormData.getHeaders()
            }
        });

        if (response.data && response.data.fingerprint) {
            return response.data.fingerprint;
        } else if (response.data) {
            return response.data; // Fallback mapping
        }

        return { pHash: null, dHash: null, embedding: [] };
    } catch (error) {
        logger.error(`Python ML Service Error: ${error.message}`);
        throw error;
    }
};
