const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

const rzp = new Razorpay({ key_id: process.env.RZP_KEY_ID, key_secret: process.env.RZP_KEY_SECRET });

// Create Razorpay order
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const options = {
    amount: Math.round(order.totalAmount * 100),
    currency: 'INR',
    receipt: `order_rcpt_${order._id}`,
  };
  const rzpOrder = await rzp.orders.create(options);
  const payment = await Payment.create({ order: order._id, transactionId: rzpOrder.id, paymentStatus: 'created', method: 'razorpay' });
  res.json({ rzpOrder });
});

// Handle COD
const codPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const payment = await Payment.create({ order: order._id, paymentStatus: 'paid', method: 'cod', transactionId: `cod_${Date.now()}` });
  order.orderStatus = 'confirmed';
  await order.save();
  res.json({ message: 'COD confirmed', payment });
});

module.exports = { createRazorpayOrder, codPayment };
