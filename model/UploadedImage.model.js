const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  _id: { 
    type: String,
    required: true 
  },
  fileName: { // The unique, hash-based filename of the image as stored on your server's disk.
    type: String,
    required: true,
    unique: true // Ensures no two records have the same filename, which is derived from the hash.
  },
  originalName: { 
    type: String,
    required: true
  },
  mimeType: { // The MIME type of the file (e.g., 'image/jpeg', 'image/png'). Useful for serving.
    type: String,
    required: true
  },
  size: { // The size of the image file in bytes.
    type: Number,
    required: true
  },
  uploadDate: { // The timestamp when the image was first uploaded to your server.
    type: Date,
    default: Date.now // Automatically sets to the current date/time when created.
  },
  uploadedBy: { // (Optional) The ID of the user who uploaded the image.
    type: String,
    default: 'anonymous' // Defaults to 'anonymous' if no user ID is available.
  }
}, { _id: false }); // This option prevents Mongoose from automatically creating a default `_id`.
                    // We explicitly use the `fileHash` as our `_id` for efficient lookups.

const UploadedImageModel = mongoose.model('UploadedImages', ImageSchema);

module.exports = UploadedImageModel;