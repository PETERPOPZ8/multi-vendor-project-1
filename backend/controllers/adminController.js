const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Vendor = require('../models/Vendor');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');

const dashboardStats = asyncHandler(async (req, res) => {
  const productCount = await Product.countDocuments();
  const vendorCount = await Vendor.countDocuments({ approvalStatus: 'approved' });
  const pendingVendors = await Vendor.countDocuments({ approvalStatus: 'pending' });
  const orderCount = await Order.countDocuments();
  res.json({ productCount, vendorCount, pendingVendors, orderCount });
});

const manageVendors = asyncHandler(async (req, res) => {
  const vendors = await Vendor.find();
  res.json(vendors);
});

const approveVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    res.status(404);
    throw new Error('Vendor not found');
  }
  vendor.approvalStatus = 'approved';
  await vendor.save();
  res.json(vendor);
});

const rejectVendor = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) {
    res.status(404);
    throw new Error('Vendor not found');
  }
  vendor.approvalStatus = 'rejected';
  await vendor.save();
  res.json(vendor);
});

module.exports = { dashboardStats, manageVendors, approveVendor, rejectVendor };
