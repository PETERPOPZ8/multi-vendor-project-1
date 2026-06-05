const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getWallet, addTransaction } = require('../controllers/walletController');

router.get('/', protect, getWallet);
router.post('/transactions', protect, addTransaction);

module.exports = router;
