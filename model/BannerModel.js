const mongoose = require('mongoose');


const bannerSchema = new mongoose.Schema({
  // Array of image objects
  imageUrls: [String],
  bannerKey: String,
  // Main title for the banner
  mainTitle: {
    type: String,
  },
  // Optional caption text
  caption: {
    type: String,
    default: '',
  },
  
  // Optional subtitle
  subTitle: {
    type: String,
    default: '',
  },
  // Array of description texts
  descriptionTexts: [{
    type: String,
    default: '',
  }],
}, {
  // Add timestamps to automatically manage createdAt and updatedAt fields
  timestamps: true,
});

// Create the Mongoose model from the schema
const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;