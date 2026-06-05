const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createRazorpayOrder, codPayment } = require('../controllers/paymentController');

router.post('/razorpay', protect, createRazorpayOrder);
router.post('/cod', protect, codPayment);

module.exports = router;
