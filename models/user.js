const mongoose = require('mongoose');
const { isEmail } = require(('validator'));

const userSchema = new mongoose.Schema({
    token: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    }, password: {
        type: String,
        required: [true, 'Please enter a password']
    },
    username: {
        type: String,
        required: [true, 'Please enter your username']
    },

})

const User = mongoose.model('user', userSchema);

module.exports = User;