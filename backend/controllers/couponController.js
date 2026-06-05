const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(coupon);
});

const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { code, amount } = req.body;
  const coupon = await Coupon.findOne({ code });
  if (!coupon || (coupon.expiryDate && coupon.expiryDate < Date.now())) {
    res.status(400);
    throw new Error('Invalid or expired coupon');
  }
  let discount = 0;
  if (coupon.discountType === 'percent') discount = (amount * coupon.discountValue) / 100;
  else discount = coupon.discountValue;
  res.json({ discount, code: coupon.code });
});

module.exports = { createCoupon, getCoupons, applyCoupon };
