const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  registerCustomer,
  login,
  loginCustomer,
  registerVendor,
  loginVendor,
  loginAdmin,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require('../controllers/authController');

router.post('/register', [body('email').isEmail().normalizeEmail()], registerCustomer);
router.post('/login', login);
router.post('/vendor/register', registerVendor);
router.post('/vendor/login', loginVendor);
router.post('/admin/login', loginAdmin);
router.post('/forgot', forgotPassword);
router.post('/verify-code', verifyResetCode);
router.post('/reset', resetPassword);

module.exports = router;
