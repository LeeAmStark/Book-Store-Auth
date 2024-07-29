const User = require('../../models/user');
const express = require("express");
const routes = express.Router();
const jwt = require("jsonwebtoken");
const bCrypt = require('bcrypt');
const { requireAuth } = require('../../middleware/authMiddleware.js');

// Signup route
routes.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json("Email is already registered");
    }

    const salt = await bCrypt.genSalt();
    const hashedPassword = await bCrypt.hash(password, salt);

    const user = new User({ email, username, password: hashedPassword });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '10s' });
    user.token = token;
    await user.save();

    res.status(201).json({ success: true, message: 'User registered successfully.', token });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).reduce((acc, key) => {
        acc[key] = err.errors[key].message;
        return acc;
      }, {});
      res.status(400).json(errors);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
});

// Login route
routes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("Input your email and password");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json("User doesn't exist");
    }

    const passwordValid = await bCrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(400).json("Your password is incorrect");
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '10s' });

    res.status(200).json({ success: true, message: "Logged in successfully", token });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = routes;