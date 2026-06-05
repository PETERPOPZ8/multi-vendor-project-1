const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const generateToken = require('../utils/generateToken');

// Register customer
const registerCustomer = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('User already exists');
  }
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password: hashed, phone, address });
  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email },
    token: generateToken({ id: user._id, role: 'customer' }),
  });
});

const buildIdentifierQuery = (identifier) => {
  if (!identifier) return {};
  const trimmed = identifier.trim();
  if (trimmed.includes('@')) {
    return { email: trimmed };
  }
  return {
    $or: [
      { email: trimmed },
      { name: trimmed },
      { storeName: trimmed },
      { ownerName: trimmed },
    ],
  };
};

const getUserResponse = (entity, role) => {
  if (role === 'vendor') {
    return { id: entity._id, storeName: entity.storeName, ownerName: entity.ownerName, email: entity.email, role };
  }
  return { id: entity._id, name: entity.name, email: entity.email, role };
};

// Generic login for customer/vendor/admin
const login = asyncHandler(async (req, res) => {
  const { email, password, role = 'customer' } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Email/username and password are required');
  }

  const query = buildIdentifierQuery(email);
  let entity = null;
  let tokenRole = role;

  if (role === 'vendor') {
    entity = await Vendor.findOne(query);
  } else if (role === 'admin') {
    entity = await User.findOne({ ...query, role: 'admin' });
  } else {
    entity = await User.findOne(query);
  }

  if (entity && (await bcrypt.compare(password, entity.password))) {
    res.json({ user: getUserResponse(entity, tokenRole), token: generateToken({ id: entity._id, role: tokenRole }) });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// Login customer
const loginCustomer = asyncHandler(async (req, res) => {
  req.body.role = 'customer';
  return login(req, res);
});

// Register vendor
const registerVendor = asyncHandler(async (req, res) => {
  const { storeName, ownerName, email, password, phone, address } = req.body;
  const existing = await Vendor.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('Vendor already exists');
  }
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const vendor = await Vendor.create({ storeName, ownerName, email, password: hashed, phone, address });
  res.status(201).json({ vendor: { id: vendor._id, storeName: vendor.storeName, email: vendor.email }, token: generateToken({ id: vendor._id, role: 'vendor' }) });
});

// Login vendor
const loginVendor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const vendor = await Vendor.findOne({ email });
  if (vendor && (await bcrypt.compare(password, vendor.password))) {
    res.json({ vendor: { id: vendor._id, storeName: vendor.storeName, email: vendor.email }, token: generateToken({ id: vendor._id, role: 'vendor' }) });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// Admin login (simple admin user stored in users collection with role=admin)
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await User.findOne({ email, role: 'admin' });
  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.json({ admin: { id: admin._id, name: admin.name, email: admin.email }, token: generateToken({ id: admin._id, role: 'admin' }) });
  } else {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }
});

// Forgot password -> send reset code (OTP-like)
const forgotPassword = asyncHandler(async (req, res) => {
  const { email, type } = req.body; // type: customer | vendor
  let user = null;
  if (type === 'vendor') user = await Vendor.findOne({ email });
  else user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetCode = code;
  user.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  await user.save();
  // In production, send code via email/SMS. Here return code for frontend integration.
  res.json({ message: 'Reset code generated', code });
});

// Verify OTP (reset code)
const verifyResetCode = asyncHandler(async (req, res) => {
  const { email, code, type } = req.body;
  let user = null;
  if (type === 'vendor') user = await Vendor.findOne({ email });
  else user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (user.resetCode !== code || user.resetCodeExpires < Date.now()) {
    res.status(400);
    throw new Error('Invalid or expired code');
  }
  user.resetCode = undefined;
  user.resetCodeExpires = undefined;
  await user.save();
  res.json({ message: 'Code verified' });
});

// Reset password after verification
const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, type } = req.body;
  let user = null;
  if (type === 'vendor') user = await Vendor.findOne({ email });
  else user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  user.resetCode = undefined;
  user.resetCodeExpires = undefined;
  await user.save();
  res.json({ message: 'Password reset successful' });
});

module.exports = {
  registerCustomer,
  login,
  loginCustomer,
  registerVendor,
  loginVendor,
  loginAdmin,
  forgotPassword,
  verifyResetCode,
  resetPassword,
};
