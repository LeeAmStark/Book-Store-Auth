const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please include a product name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please include a product description"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Please include a product price"],
        min: 0
    },
    category: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        required: [true, "Add product to a specific brand"],
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    ratings: {
        type: Number,
        MaxKey: 99
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;