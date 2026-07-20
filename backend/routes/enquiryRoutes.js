const express = require('express');
const {
  createEnquiry,
  getEnquiries,
  updateEnquiry,
  deleteEnquiry,
} = require('../controllers/enquiryController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/', createEnquiry);
router.get('/', protect, admin, getEnquiries);
router.put('/:id', protect, admin, updateEnquiry);
router.delete('/:id', protect, admin, deleteEnquiry);

module.exports = router;
