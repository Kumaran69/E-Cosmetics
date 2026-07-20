const asyncHandler = require('express-async-handler');
const Enquiry = require('../models/Enquiry');

// @desc  Submit a contact/product enquiry (public)
// @route POST /api/enquiries
// @access Public
const createEnquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, product, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please provide name, email, subject and message');
  }

  const enquiry = await Enquiry.create({ name, email, phone, product, subject, message });
  res.status(201).json({
    success: true,
    message: "Thanks for reaching out! We'll get back to you soon.",
    data: enquiry,
  });
});

// @desc  Get all enquiries
// @route GET /api/enquiries
// @access Private/Admin
const getEnquiries = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};
  const enquiries = await Enquiry.find(query).populate('product', 'name').sort({ createdAt: -1 });
  res.json({ success: true, data: enquiries });
});

// @desc  Update enquiry status / admin note
// @route PUT /api/enquiries/:id
// @access Private/Admin
const updateEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) {
    res.status(404);
    throw new Error('Enquiry not found');
  }
  enquiry.status = req.body.status ?? enquiry.status;
  enquiry.adminNote = req.body.adminNote ?? enquiry.adminNote;
  await enquiry.save();
  res.json({ success: true, data: enquiry });
});

// @desc  Delete an enquiry
// @route DELETE /api/enquiries/:id
// @access Private/Admin
const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) {
    res.status(404);
    throw new Error('Enquiry not found');
  }
  await enquiry.deleteOne();
  res.json({ success: true, message: 'Enquiry deleted' });
});

module.exports = { createEnquiry, getEnquiries, updateEnquiry, deleteEnquiry };
