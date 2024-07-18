const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true
    },
    productPrice: {
        type: Number,
        required: true,
        min: 0
    },
    productImage: {
        type: String,
        trim: true
    },
    productQuantity: {
        type: Number,
        default: 1
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    CardNumber: {
        type: Number,

    },
    PaymentMethod: {
        type: String
    },
});

const cartProduct = mongoose.model('cartProducts', cartSchema);