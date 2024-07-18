const express = require("express");
const mongoose = require("mongoose");
const bCrypt = require('bcrypt');
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = 3000;

// FUNCTION ROUTES IMPORT
const storeAuth = require("./routes/auth/index");
const storeCart = require("./routes/carts/cart");
const storeProducts = require("./routes/products/products");

const app = express();

const { addUser, getUsers, getUser, handleErrors } = require('./User_DataStore');
const User = require('./models/user');
const Product = require('./models/products');
const Order = require('./models/order');
const cartProduct = require("./models/cart");

// Middleware
app.use(express.static('public'));
app.use(express.json());

// USER SIGN UP AND LOG IN --------------------------------------------------------------------------
app.post("/auth/login", storeAuth);
app.post("/auth/register", storeAuth);

// PRODUCTS CREATION AND MODIFICATION
app.post("/products/find-product", storeProducts);
app.post("/products/update-product", storeProducts);
app.post("/products/delete-product", storeProducts);

// PRODUCTS TO CART MODIFICATION --------------------------------------------------------------------
app.post("/cart/add-to-cart", storeCart);
app.post("/cart/remove-from-cart", storeCart);

// ORDERS MADE -------------------------------------------------------------------------------------

app.get("/make-order", async (req, res) => {
  const { id } = req.body;

  try {
    const cart = await cart.findById(id);

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