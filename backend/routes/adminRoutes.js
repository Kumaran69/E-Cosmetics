const express = require('express');
const {
  getDashboardStats,
  getCustomers,
  toggleCustomerStatus,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/customers', getCustomers);
router.put('/customers/:id/status', toggleCustomerStatus);

module.exports = router;
