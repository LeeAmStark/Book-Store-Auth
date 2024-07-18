const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        default: 1
    },

    brand: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    ratings: {
        type: Number,
        default: 0
    }
});

const cartProduct = mongoose.model('cartProducts', cartSchema);