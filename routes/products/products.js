const express = require("express");
const Product = require("../../models/products");

const routes = express.Router();

routes.post("/create-product", async (req, res) => {
    // Destructure product details
    const { name, description, price, category, brand, createdAt } = req.body;
    try {
        const products = await Product.create({ name, description, price, category, brand, createdAt });
        console.log(products);
        res.status(201).send(products.name + " has been added to the store");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

routes.get("/find-product", async (req, res) => {
    const { id, name, description, price, category } = req.query;
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

routes.put("/update-product", async (req, res) => {
    const { id, name, description, price, category, createdAt } = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, { name, description, price, category, createdAt }, { new: true, upsert: true });
        if (!updatedProduct) {
            return res.status(404).send('Product not found');
        }
        console.log(updatedProduct);
        res.json(updatedProduct);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error updating product');
    }
});

routes.delete("/delete-product", async (req, res) => {
    const { id } = req.body;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).send('Product not found');
        }
        console.log(deletedProduct);
        res.json(deletedProduct);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error deleting product');
    }
});

module.exports = routes;