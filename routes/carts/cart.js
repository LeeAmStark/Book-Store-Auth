const express = require("express");
const Product = require("../../models/products");
const CartProduct = require("./cartProduct");

const routes = express.Router();

routes.post("/add-to-cart", async (req, res) => {
  const { id } = req.body;

  try {
    const storeProduct = await Product.findById(id);

    if (!storeProduct) {
      return res.status(404).send('Product not available');
    }

    const newCartProduct = new CartProduct({
      id: storeProduct.id,
      name: storeProduct.name,
      description: storeProduct.description,
      price: storeProduct.price,
      category: storeProduct.category
    });

    await newCartProduct.save();
    res.status(201).send(`${newCartProduct.name} has been added to cart`);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error adding product to cart');
  }
});

routes.delete("/remove-from-cart", async (req, res) => {
  const { id } = req.body;

  try {
    const productInCart = await CartProduct.findByIdAndDelete(id);

    if (!productInCart) {
      return res.status(404).send('There was an error removing product: Product not found');
    }

    res.status(200).send(`${productInCart.name} has been removed from cart`);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error removing product from cart');
  }
});

module.exports = routes;
