const mongoose = require('mongoose');

// --- Sub-schema for ThreeColumnSubform ---
const ThreeColumnSubformSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true } 
}, { _id: false }); // _id: will false prevents Mongoose from adding an _id to subdocuments

// --- Sub-schema for FourColumnSubform ---
const FourColumnSubformSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    link: { type: String, required: true }, 
    image: { type: String, required: true } // Base64 string
}, { _id: false });

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

// --- Middleware to handle 'data' field validation and structure ---
DynamicPageSchema.pre('save', function(next) {
    this.sections.forEach(section => {
        switch (section.type) {
            case 'banner':
                // Ensure data matches BannerSectionData structure
                if (!section.data.topic || !section.data.subTopic || !section.data.description || !section.data.imageCaption || !Array.isArray(section.data.images)) {
                    throw new Error('Banner section data is incomplete or malformed.');
                }
                if (section.data.images.length > 2) {
                    throw new Error('Banner section can have a maximum of 2 images.');
                }
                break;
            case 'three-columns':
                // Ensure data matches ThreeColumnsSectionData structure
                if (!section.data.topic || !section.data.description || !Array.isArray(section.data.subforms)) {
                    throw new Error('Three-columns section data is incomplete or malformed.');
                }
                if (section.data.subforms.length > 3) {
                    throw new Error('Three-columns section can have a maximum of 3 subforms.');
                }
                // Validate each subform
                section.data.subforms.forEach(subform => {
                    if (!subform.id || !subform.title || !subform.description || !subform.image) {
                        throw new Error('Three-column subform data is incomplete or malformed.');
                    }
                });
                break;
            case 'four-columns':
                // Ensure data matches FourColumnsSectionData structure
                if (!section.data.topic || !section.data.description || !Array.isArray(section.data.subforms)) {
                    throw new Error('Four-columns section data is incomplete or malformed.');
                }
                if (section.data.subforms.length > 4) {
                    throw new Error('Four-columns section can have a maximum of 4 subforms.');
                }
                // Validate each subform
                section.data.subforms.forEach(subform => {
                    if (!subform.id || !subform.title || !subform.link || !subform.image) {
                        throw new Error('Four-column subform data is incomplete or malformed.');
                    }
                });
                break;
            case 'big-banner-with-text-card':
                // Ensure data matches BigBannerWithTextCardSectionData structure
                if (!section.data.topic || !section.data.description || !section.data.bigImage || !section.data.imageCaption) {
                    throw new Error('Big Banner with Text Card section data is incomplete or malformed.');
                }
                break;
            case 'trip':
                // Ensure data matches TripSectionData structure
                if (!section.data.content) {
                    throw new Error('Trip section data is incomplete or malformed.');
                }
                break;
            default:
                // Optionally handle unknown section types or throw an error
                console.warn(`Unknown section type encountered: ${section.type}`);
        }
    });
    next();
});
let DynamicPageModel = mongoose.model('DynamicPages', DynamicPageSchema);
module.exports = DynamicPageModel;
