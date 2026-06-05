const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createCoupon, getCoupons, applyCoupon } = require('../controllers/couponController');

router.post('/', protect, createCoupon);
router.get('/', getCoupons);
router.post('/apply', protect, applyCoupon);

module.exports = router;
