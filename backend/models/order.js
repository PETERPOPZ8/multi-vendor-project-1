const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
      },
    ],
    shippingAddress: { type: String },
    paymentMethod: { type: String },
    totalAmount: { type: Number, required: true },
    orderStatus: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
