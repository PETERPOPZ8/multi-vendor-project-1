const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');

const addReview = asyncHandler(async (req, res) => {
  const { productId, rating, comment } = req.body;
  const review = await Review.create({ product: productId, user: req.user._id, rating, comment });
  const product = await Product.findById(productId);
  product.reviews.push(review._id);
  // Update rating
  const reviews = await Review.find({ product: productId });
  product.rating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  await product.save();
  res.status(201).json(review);
});

const getReviewsForProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const reviews = await Review.find({ product: productId }).populate('user');
  res.json(reviews);
});

module.exports = { addReview, getReviewsForProduct };
