const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  data: { type: mongoose.Schema.Types.Mixed, required: true }
});

const DynamicPageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { 
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  sections: [SectionSchema]
}, { timestamps: true });

let DynamicPageModel = mongoose.model('DynamicPages', DynamicPageSchema);
module.exports = DynamicPageModel;
