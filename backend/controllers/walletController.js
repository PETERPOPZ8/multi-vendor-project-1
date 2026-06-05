const asyncHandler = require('express-async-handler');
const Wallet = require('../models/Wallet');
const Vendor = require('../models/Vendor');

const getWallet = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  const wallet = await Wallet.findOne({ vendor: vendorId }) || { balance: 0, transactions: [] };
  res.json(wallet);
});

const addTransaction = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  const { type, amount, note } = req.body;
  let wallet = await Wallet.findOne({ vendor: vendorId });
  if (!wallet) wallet = await Wallet.create({ vendor: vendorId, balance: 0, transactions: [] });
  wallet.transactions.push({ type, amount, note });
  wallet.balance = (wallet.balance || 0) + Number(amount);
  await wallet.save();
  res.json(wallet);
});

module.exports = { getWallet, addTransaction };
