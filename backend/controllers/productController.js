const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Create product (vendor or admin)
const createProduct = asyncHandler(async (req, res) => {
  const data = req.body;
  if (req.files) {
    data.images = req.files.map((f) => `/uploads/${f.filename}`);
  }
  const product = await Product.create(data);
  res.status(201).json(product);
});

// Get all products with search and filter
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, min, max, featured } = req.query;
  const query = {};
  if (search) query.title = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  if (featured) query.featured = featured === 'true';
  if (min || max) query.price = {};
  if (min) query.price.$gte = Number(min);
  if (max) query.price.$lte = Number(max);
  const products = await Product.find(query).populate('category vendor');
  res.json(products);
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category vendor reviews');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  Object.assign(product, req.body);
  if (req.files) product.images = req.files.map((f) => `/uploads/${f.filename}`);
  await product.save();
  res.json(product);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.remove();
  res.json({ message: 'Product removed' });
});

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };
