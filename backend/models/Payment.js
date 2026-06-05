const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    transactionId: { type: String },
    paymentStatus: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
    method: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
