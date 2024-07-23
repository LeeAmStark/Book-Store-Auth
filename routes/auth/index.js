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

    if (!email || !username && !password) {
      return res.status(400).json("Input your username or email and password");
    }

    const userExists = await User.findOne({ email, username });

    if (!userExists) {
      console.log(userExists)
      return res.status(400).json("User doesn't exist");
    }

    const passwordValid = await bCrypt.compare(password, userExists.password);
    if (!passwordValid) {
      console.log("password not correct")
      return res.status(400).json("Your password is incorrect");
    }
    let logTimer = setTimeout(navigate("/home"));
    alert(`You'll be logged in - ${logTimer}`)
    console.log("Logging in")
    return res.status(200).json("Logging in");
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
});

module.exports = routes;