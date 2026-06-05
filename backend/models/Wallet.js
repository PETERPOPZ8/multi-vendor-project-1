const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: { type: String },
  amount: { type: Number },
  note: { type: String },
  date: { type: Date, default: Date.now },
});

const walletSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    balance: { type: Number, default: 0 },
    transactions: [transactionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Wallet', walletSchema);
