const product = require("../models/product");
const category = require("../models/category");

//get latest products and all categories and discounted items for home page
exports.getHomeData = async (req, res) => {
    try {
        const latestProducts = await product.find().sort({ createdAt: -1 }).limit(6);
        const Categories = await category.find();
        const discountedProducts = await product.find({ discount: { $gt: 0 } }).sort({ createdAt: -1 }).limit(6);

        res.status(200).json({ products: latestProducts, categories: Categories, discountedProducts: discountedProducts });
    }catch (err) {
        res.status(500).json({ message: err.message });
    }
}