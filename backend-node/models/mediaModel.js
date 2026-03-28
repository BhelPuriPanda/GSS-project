const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a media title']
        },
        type: {
            type: String,
            enum: ['image', 'video'],
            required: [true, 'Please provide a media type']
        },
        fileUrl: {
            type: String,
            required: function () {
                // If it's a violation from scraper, we might not always have a fileUrl initially, but typically uploaded media will.
                return !this.isViolation;
            }
        },
        fingerprint: {
            pHash: {
                type: String,
                default: null
            },
            dHash: {
                type: String,
                default: null
            },
            embedding: {
                type: [Number],
                default: []
            }
        },
        isViolation: {
            type: Boolean,
            default: false
        },
        owner: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: false // Optional for now to not break existing tested mock data
        },
        // Fields specific to Violations reported by the Scraper
        sourceUrl: {
            type: String,
            default: null
        },
        matchedWith: {
            type: mongoose.Schema.ObjectId,
            ref: 'Media',
            default: null
        },
        similarityScore: {
            type: Number,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Indexes for faster queries (optional but recommended for large datasets)
mediaSchema.index({ isViolation: 1 });
mediaSchema.index({ 'fingerprint.pHash': 1 }); // might be useful if python service queries by hash later

const Media = mongoose.model('Media', mediaSchema);

module.exports = Media;
