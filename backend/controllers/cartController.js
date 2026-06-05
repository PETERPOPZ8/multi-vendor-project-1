const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, products: [{ product: productId, quantity }] });
    return res.status(201).json(cart);
  }
  const idx = cart.products.findIndex((p) => p.product.toString() === productId);
  if (idx > -1) {
    cart.products[idx].quantity += Number(quantity);
  } else {
    cart.products.push({ product: productId, quantity });
  }
  await cart.save();
  res.json(cart);
});

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ user: userId }).populate('products.product');
  res.json(cart || { products: [] });
});

const updateCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  const idx = cart.products.findIndex((p) => p.product.toString() === productId);
  if (idx > -1) {
    cart.products[idx].quantity = Number(quantity);
    await cart.save();
    res.json(cart);
  } else {
    res.status(404);
    throw new Error('Product not in cart');
  }
});

const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  cart.products = cart.products.filter((p) => p.product.toString() !== productId);
  await cart.save();
  res.json(cart);
});

module.exports = { addToCart, getCart, updateCart, removeFromCart };
