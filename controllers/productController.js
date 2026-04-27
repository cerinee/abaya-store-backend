const Product = require("../models/product");


// GET products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("category", "name");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// GET
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            "category",
            "name",
        );
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// POST  (admin only)
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            stock,
            size,
            color,
            isFeatured,
        } = req.body;

        const image = req.file ? req.file.filename : null;

        const createData = {
            name,
            description,
            price,
            category,
            stock,
            image,
        };

        if (size) {
            createData.size = typeof size === "string" ? JSON.parse(size) : size;
        }

        if (color) {
            createData.color = typeof color === "string" ? JSON.parse(color) : color;
        }

        const product = await Product.create(createData);

        res.status(201).json({ message: "Product created", product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT  (admin only)
const editProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            stock,
            size,
            color,
            isFeatured,
        } = req.body;

        const updateData = {};

        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = price;
        if (category) updateData.category = category;
        if (stock) updateData.stock = stock;

        if (size) {
            updateData.size = typeof size === "string" ? JSON.parse(size) : size;
        }

        if (color) {
            updateData.color = typeof color === "string" ? JSON.parse(color) : color;
        }

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated", product });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// DELETE   (admin only)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    editProduct,
    deleteProduct,
};
