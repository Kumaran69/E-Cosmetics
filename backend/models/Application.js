const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['distributor', 'retail_partner', 'bulk_order', 'career'],
      required: true,
    },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    companyName: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    message: { type: String, trim: true },
    resumeUrl: { type: String }, // for career applications, if a link is provided
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNote: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
