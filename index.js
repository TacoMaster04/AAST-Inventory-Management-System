const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/productModel");
const Category = require("./models/categoryModel");
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.3vhsy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
	.then(console.log("Connected to the database successfully"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/index.html");
});

app.get("/products", async (req, res) => {
	const products = await Product.find();
	res.status(200).json(products);
});

app.get("/categories", async (req, res) => {
	const categories = await Category.find();
	res.status(200).json(categories);
});

app.get("/products/:id", async (req, res) => {
	const product = await Product.findById(req.params.id);
	
	if (!product) {
		return res.status(404).json({ message: "Product not found" });
	}

	res.status(200).json(product);
});

app.get("/categories/:id", async (req, res) => {
	const category = await Category.findById(req.params.id);
	
	if (!category) {
		return res.status(404).json({ message: "Category not found" });
	}

	res.status(200).json(category);
});

app.post("/products", async (req, res) => {
	try {
		const product = new Product(req.body);
		await product.save();
		res.status(200).json(product);
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
});

app.post("/categories", async (req, res) => {
	try {
		const category = new Category(req.body);
		await category.save();
		res.status(200).json(category);
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });

	}
});

app.put("/products/:id", async (req, res) => {
	const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});

	if (!product) {
		return res.status(404).json({ message: "Product not found" });
	}

	res.status(200).json(product);
});

app.put("/categories/:id", async (req, res) => {
	const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
	});

	if (!category) {
		return res.status(404).json({ message: "Category not found" });
	}

	res.status(200).json(category);
});

app.delete("/products/:id", async (req, res) => {
	try {
		const productId = String(req.params.id);
		const product = await Product.findById(productId);
		
		if (!product) {
			return res.status(404).json({ message: "product not found" });
		}

		const removedproduct = await Product.findByIdAndDelete(productId);
		res.status(200).json(removedproduct);
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
});

app.delete("/categories/:id", async (req, res) => {
	try {
		const categoryId = String(req.params.id);
		const category = await Category.findById(categoryId);
		
		if (!category) {
			return res.status(404).json({ message: "Category not found" });
		}

		const removedCategory = await Category.findByIdAndDelete(categoryId);
		res.status(200).json(removedCategory);
	} catch (err) {
		res.status(500).json({ success: false, message: err.message });
	}
});

app.listen(3030, console.log("Server is running on port 3030"));
