let mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true  
    },
    description: {
        type: String,   
    },
    image: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,  
        ref: 'Category'
    },
    stock: {
        type: Number,
        default: 0
    },
    color:{
        type: [String],
    },
    size: {
        type: [String],
    },
    images: {
        type: [String],
    },
    discount: {
        type: Number,
        default: 0
    },
    discountenddate: {
        type: Date,
    }
});
    
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;