const express = require('express');
const {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.post('/', createApplication);
router.get('/', protect, admin, getApplications);
router.put('/:id', protect, admin, updateApplication);
router.delete('/:id', protect, admin, deleteApplication);

module.exports = router;
