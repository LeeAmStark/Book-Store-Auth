const User = require('../../models/user');
const express = require("express");
const routes = express.Router();
const jwt = require("jsonwebtoken");
const bCrypt = require('bcrypt');
// const { addUser, getUsers, getUser, handleErrors } = require('../../User_DataStore');

// Login route
routes.post("/signup", async (req, res) => {
  const { email, username, password, token } = req.body;
  try {
    
    const existingUser = await User.findOne({ email });
    let id;

    if (existingUser) {
      id = existingUser._id.toString()
      return res.status(400).json("Email is already registered");
    }
    const tokenValAge = 50;
    const Token = jwt.sign({ _id: id }, "monsterhalfbadbeatkillshotashtray", {
      expiresIn: tokenValAge
    })

    // console.log("This is the generated token:" + Token)
    await User.updateOne({ _id: id }, { $set: { token: Token } })

    const salt = await bCrypt.genSalt();
    const hashedPassword = await bCrypt.hash(password, salt);
    // await addUser({ email, username, password: hashedPassword, token }); 
    const user = await User.create({ email, username, password: hashedPassword, token: Token })
    await user.save();
    res.status(201).json({ success: true, message: 'User registered successfully.' });

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

routes.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("Input your email and password");
    }

    const user = await User.findOne({ username });
    const e_mail = await User.findOne({email});

    if (!user) {
      return res.status(400).json("User doesn't exist");
    }else if(!e_mail){
      return res.status(400).json("Email doesn't exist");
    }

    const passwordValid = await bCrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(400).json("Your password is incorrect");
    }

    // Generate token
    const token = jwt.sign({ _id: user._id }, "your_secret_key", { expiresIn: '1h' });

    res.status(200).json({ success: true, message: "Logged in successfully", token });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = routes;