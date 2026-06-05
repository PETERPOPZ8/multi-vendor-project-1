const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getVendorProfile, vendorProducts, vendorOrders } = require('../controllers/vendorController');

router.get('/me', protect, getVendorProfile);
router.get('/products', protect, vendorProducts);
router.get('/orders', protect, vendorOrders);

module.exports = router;
