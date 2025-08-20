const mongoose = require('mongoose');


// --- Main Dynamic Page Schema ---
const DynamicPageSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true, // Ensures each page has a unique ID
        index: true   // Creates an index for faster lookups
    },
    title: {
        type: String,
        required: true,
        trim: true // Removes whitespace from both ends of a string
    },
     slug: { // New field for URL-friendly identifier
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, // Ensure slugs are always lowercase
        index: true
    },
    sections: [
        new mongoose.Schema({
            id: { type: String, required: true },
            type: {
                type: String,
                required: true,
                enum: [
                    'banner',
                    'three-columns',
                    'four-columns',
                    'big-banner-with-text-card',
                    'trip'
                ]
            },
            data: {
                type: mongoose.Schema.Types.Mixed, 
                required: true
            }
        }, { _id: false })
    ]
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps automatically

let DynamicPageModel = mongoose.model('DynamicPages', DynamicPageSchema);
module.exports = DynamicPageModel;
