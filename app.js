const express = require("express");
const mongoose = require("mongoose");
const bCrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const port = 3000;

const app = express();

const { addUser, getUsers, getUser, handleErrors } = require('./User_DataStore');
const User = require('./user');
const Product = require('./products');
const Cart = require('./cart');
const Order = require('/order');

// Middleware
app.use(express.static('public'));
app.use(express.json());


// USER SIGN UP AND LOG IN --------------------------------------------------------------------------
app.post("/signup", async (req, res) => {
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

app.get("/login", async (req, res) => {
  const { email, username, password } = req.body;
  try {
    // const user = getUser(email, username, password || email, password || username, password);
    const logIn = await User.findOne({ email });
    const isPasswordValid = await bCrypt.compare(password, logIn.password)
    if (logIn) {
      if (isPasswordValid) {
        console.log('User found:', logIn);
        res.send(`User: ${logIn} logged in`);
      } else {
        console.log("Incorrect password");
        res.send("Incorrect password");
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).send('Error during login');
  }
});

// PRODUCT MODIFICATION ----------------------------------------------------------------------------

app.post("/create-product", async (req, res) => {
  // Destructure product details
  const { name, description, price, category, brand, createdAt } = req.body;
  try {
    const products = await Product.create({ name, description, price, category, brand, createdAt });
    console.log(products);
    res.send(products.name + " :has been added to the store");
  } catch (error) {
    res.status(400).json(error.message);
  }
})

app.get("/find-product", async (req, res) => {
  const { id, name, description, price, category } = req.body;
  try {
    let query = {};

    if (id) {
      // If an ID is provided, search by ID only
      const foundProduct = await Product.findById(id);
      if (!foundProduct) {
        return res.status(404).send('Product not found');
      }
      return res.json(foundProduct);
    }

    if (name) query.name = name;
    if (description) query.description = description;
    if (price) query.price = price;
    if (category) query.category = category;

    const foundProducts = await Product.find(query);
    res.json(foundProducts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Couldn't find products");
  }
});

app.put("/update-product", async (req, res) => {
  const { id, name, description, price, category, createdAt } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, { name, description, price, category, createdAt }, { new: true, upsert: true })
    if (!updatedProduct) {
      return res.status(404).send('Product not found');
    }
    console.log(updatedProduct);
    res.json(updatedProduct)
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Error updating product');
  }
})

app.get("/delete-product", async (req, res) => {
  const { id } = req.body;
  try {
    const deleteProduct = await Product.findByIdAndDelete(id)
    if (!deleteProduct) {
      return res.status(404).send('Product not found');
    }
    console.log(deleteProduct);
    res.json(deleteProduct)
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Error updating product');
  }
})

// ADD TO CART -------------------------------------------------------------------------------------

app.get("/add-to-cart", async (req, res) => {
  const { id } = req.body;
  try {
    const storeProduct = await Product.findById(id);

    if (!storeProduct) {
      return res.status(404).send('Product not unavailable');
    }

    const newCartProduct = new cartProduct({
      id: storeProduct.id,
      name: storeProduct.name,
      description: storeProduct.description,
      price: storeProduct.price,
      category: storeProduct.category
    })

    await newCartProduct.save();

    res.status(201).send(`${newCartProduct.name} has been added to cart`);

  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Error adding product to cart');
  }
})

app.get("/remove-from-cart", async (req, res) => {
  const { id, name } = req.body;
  try {
    const cartProduct = await Cart.findByIdAndDelete(id);
    if (!cartProduct) {
      return res.status(404).send('There was an error removing product: Product not found ');
    }
    res.status(201).send(`${cartProduct.name} has been added to cart`)
  }
  catch (err) {
    console.error(err.message);
    res.status(500).send('Error adding product to cart');
  }
})

// ORDERS MADE -------------------------------------------------------------------------------------

app.get("/make-order", async (req, res) => {
  const { productID } = req.body;

  try {
    const cart = await Cart.findById(productID);

    if (!cart) {
      return res.status(404).send("Product could not be sent to orders");
    }

    const orderItems = cart.products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price
    }));

    const newOrderBatch = new ProductOrderBatch({
      items: orderItems
    });

    await newOrderBatch.save();

    res.status(201).send("Order successfully created");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/payment-details", async (req, res) => {
  
})


// Connect to MongoDB with the specified connection string
const CONNECTION_URL = 'mongodb+srv://Liam:Stark404@book-storeauth.tjhllrf.mongodb.net/?retryWrites=true&w=majority&appName=Book-StoreAuth';
mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    console.log("MONGODB CONNECTED SUCCESSFULLY!");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

app.listen(port, () => {
  console.log("Server running on port 3000");
});