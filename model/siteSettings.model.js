let mongoose = require("mongoose")

// let contactCr
let basicSiteSettingsCollectionSchema = mongoose.Schema({
    siteName: {
        type: String,
        required: true,
    },
    siteKey: {
        type: String,
        default: "VisitCopenhagen"
    },
    siteLogoUrl: {
        type: String,
    },
    primaryEmailId: {
        type: String
    },
    facebookUrl: String,
    instagramUrl: String,
    youtubeUrl: String,
    
}, {timestamps: true})


let basicSiteSettingsModel = mongoose.model("BasicSiteSettings",basicSiteSettingsCollectionSchema);
module.exports = basicSiteSettingsModel;