const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
});

const cartProduct = mongoose.model('cartProducts', cartSchema);
module.exports = cartProduct;