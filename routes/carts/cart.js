const express = require("express");

const routes = express.Router();

routes.post("/add-to-cart", async (req, res) => {
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

routes.get("/remove-from-cart", async (req, res) => {
    const { id, name } = req.body;
    try {
      const productInCart = await cartProduct.findByIdAndDelete(id);
      if (!productInCart) {
        return res.status(404).send('There was an error removing product: Product not found ');
      }
      res.status(201).send(`${productInCart.name} has been removed frome cart`)
    }
    catch (err) {
      console.error(err.message);
      res.status(500).send('Error adding product to cart');
    }
  })

  module.export = routes