const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Enquiry = require('../models/Enquiry');
const Application = require('../models/Application');

// @desc  Get dashboard summary stats
// @route GET /api/admin/dashboard
// @access Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalProducts,
    totalCustomers,
    newEnquiries,
    pendingApplications,
    lowStockProducts,
    topRatedProducts,
    categoryBreakdown,
  ] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'customer' }),
    Enquiry.countDocuments({ status: 'new' }),
    Application.countDocuments({ status: 'pending' }),
    Product.find({ stock: { $lte: 5 }, isActive: true }).select('name stock').limit(10),
    Product.find({ isActive: true }).sort({ ratingsAverage: -1 }).limit(5).select('name ratingsAverage ratingsCount'),
    Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  res.json({
    success: true,
    data: {
      totalProducts,
      totalCustomers,
      newEnquiries,
      pendingApplications,
      lowStockProducts,
      topRatedProducts,
      categoryBreakdown,
    },
  });
});

// @desc  Get all customers
// @route GET /api/admin/customers
// @access Private/Admin
const getCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 });
  res.json({ success: true, data: customers });
});

// @desc  Toggle a customer's active status
// @route PUT /api/admin/customers/:id/status
// @access Private/Admin
const toggleCustomerStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'customer') {
    res.status(404);
    throw new Error('Customer not found');
  }
  user.isActive = !user.isActive;
  await user.save();
  res.json({ success: true, data: user });
});

module.exports = { getDashboardStats, getCustomers, toggleCustomerStatus };
