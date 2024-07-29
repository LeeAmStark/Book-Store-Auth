const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    productID: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    }
});

const cartProduct = mongoose.model('cartProducts', cartSchema);
module.exports = cartProduct;2