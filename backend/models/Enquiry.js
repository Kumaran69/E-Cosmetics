const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['new', 'in_progress', 'resolved'], default: 'new' },
    adminNote: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', enquirySchema);
