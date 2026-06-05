const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const { dashboardStats, manageVendors, approveVendor, rejectVendor } = require('../controllers/adminController');

router.get('/stats', protect, admin, dashboardStats);
router.get('/vendors', protect, admin, manageVendors);
router.put('/vendors/:id/approve', protect, admin, approveVendor);
router.put('/vendors/:id/reject', protect, admin, rejectVendor);

module.exports = router;
