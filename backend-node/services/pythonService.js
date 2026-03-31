const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');
const logger = require('../utils/logger');

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'https://daps-python.onrender.com';

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
            },
            timeout: 45000,
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });

        if (response.data && response.data.fingerprint) {
            const fp = response.data.fingerprint;
            return {
                pHash: fp.phash || null,
                dHash: fp.dhash || null,
                embedding: fp.embedding || []
            };
        } else if (response.data) {
            return response.data; // Fallback mapping
        }

        return { pHash: null, dHash: null, embedding: [] };
    } catch (error) {
        logger.error(`Python ML Service Error: ${error.message}`);
        throw error;
    }
};
