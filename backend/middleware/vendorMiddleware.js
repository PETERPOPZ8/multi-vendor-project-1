const asyncHandler = require('express-async-handler');

const vendorOnly = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.approvalStatus === 'approved') {
    next();
  } else {
    res.status(403);
    throw new Error('Vendor access required or not approved');
  }
});

module.exports = { vendorOnly };
