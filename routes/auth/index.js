const express = require("express");

const routes = express.Router();

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
      // addUser({ email, username, password }); 
      const user = await User.create({ email, username, password: hashedPassword, token: Token })
      res.send('User details stored on User.json');
    } catch (err) {
      console.log(err.message);
      if (err.message == "Cannot read properties of undefined (reading 'length')") {
        res.status(400).send('Include your username');
      }
      else
        res.status(400).send('Error, user not created: ' + err.message);
    }
  });

  