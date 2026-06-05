const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Admin access required');
  }
});

module.exports = { admin };
