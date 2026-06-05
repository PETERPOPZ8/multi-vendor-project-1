const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { shippingAddress, paymentMethod, couponCode } = req.body;
  const cart = await Cart.findOne({ user: userId }).populate('products.product');
  if (!cart || cart.products.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }
  let total = 0;
  const orderProducts = cart.products.map((p) => {
    const price = p.product.price;
    total += price * p.quantity;
    return { product: p.product._id, quantity: p.quantity, price };
  });
  const order = await Order.create({ user: userId, products: orderProducts, shippingAddress, paymentMethod, totalAmount: total });
  // Clear cart
  cart.products = [];
  await cart.save();
  res.status(201).json(order);
});

const getOrders = asyncHandler(async (req, res) => {
  const user = req.user;
  let orders;
  if (user.role === 'admin') {
    orders = await Order.find().populate('products.product user');
  } else {
    orders = await Order.find({ user: user._id }).populate('products.product');
  }
  res.json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('products.product user');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json(order);
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.orderStatus = status;
  await order.save();
  res.json(order);
});

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
