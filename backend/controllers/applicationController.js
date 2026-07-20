const asyncHandler = require('express-async-handler');
const Application = require('../models/Application');

// @desc  Submit a distributor/partner/career application (public)
// @route POST /api/applications
// @access Public
const createApplication = asyncHandler(async (req, res) => {
  const { type, fullName, email, phone } = req.body;

  if (!type || !fullName || !email || !phone) {
    res.status(400);
    throw new Error('Please provide type, full name, email and phone');
  }

  const application = await Application.create(req.body);
  res.status(201).json({
    success: true,
    message: 'Your application has been submitted successfully!',
    data: application,
  });
});

// @desc  Get all applications
// @route GET /api/applications
// @access Private/Admin
const getApplications = asyncHandler(async (req, res) => {
  const { type, status } = req.query;
  const query = {};
  if (type) query.type = type;
  if (status) query.status = status;
  const applications = await Application.find(query).sort({ createdAt: -1 });
  res.json({ success: true, data: applications });
});

// @desc  Update application status / admin note
// @route PUT /api/applications/:id
// @access Private/Admin
const updateApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  application.status = req.body.status ?? application.status;
  application.adminNote = req.body.adminNote ?? application.adminNote;
  await application.save();
  res.json({ success: true, data: application });
});

// @desc  Delete an application
// @route DELETE /api/applications/:id
// @access Private/Admin
const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  await application.deleteOne();
  res.json({ success: true, message: 'Application deleted' });
});

module.exports = { createApplication, getApplications, updateApplication, deleteApplication };
