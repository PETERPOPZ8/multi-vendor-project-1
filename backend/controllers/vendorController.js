const asyncHandler = require('express-async-handler');
const Vendor = require('../models/Vendor');
const Product = require('../models/Product');
const Order = require('../models/Order');

const getVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.user._id).select('-password');
  res.json(vendor);
});

const vendorProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ vendor: req.user._id });
  res.json(products);
});

const vendorOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ 'products.product': { $exists: true }, vendor: req.user._id }).populate('products.product');
  res.json(orders);
});

module.exports = { getVendorProfile, vendorProducts, vendorOrders };
