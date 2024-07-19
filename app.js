require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const Mongo_Uri = process.env.MONGO_URI;
const bCrypt = require('bcrypt');
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = 3000;
const app = express();


// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
app.use(express.json());

// Connect to MongoDB with the specified connection string
const CONNECTION_URL = Mongo_Uri;
mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    console.log("MONGODB CONNECTED SUCCESSFULLY!");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

// FUNCTION ROUTES IMPORT
const storeAuth = require("./routes/auth/index");
const cartHouse = require("./routes/carts/cart");
const productRoute = require("./routes/products/products");

const { addUser, getUsers, getUser, handleErrors } = require('./User_DataStore');
const User = require('./models/user');
const Product = require('./models/products');
const Order = require('./models/order');
const cartProduct = require("./models/cart");
const { render } = require('ejs');

app.get('/', (req, res) => {
  res.send('This is working');
})

// USER SIGN UP AND LOG IN --------------------------------------------------------------------------
app.use("/auth/login", storeAuth);
app.use("/auth/register", storeAuth);

// PRODUCTS CREATION AND MODIFICATION
app.use("/product/find-product", productRoute);
app.use("/product/update-product", productRoute);
app.use("/product/delete-product", productRoute);

// PRODUCTS TO CART MODIFICATION --------------------------------------------------------------------
app.use("/cart/add-to-cart", cartHouse);
app.use("/cart/add-to-cart", cartHouse);

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});