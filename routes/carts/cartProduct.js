const mongoose = require("mongoose");

const cartProductSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product' // assuming this references the Product model
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const CartProduct = mongoose.model("CartProduct", cartProductSchema);

module.exports = CartProduct;
