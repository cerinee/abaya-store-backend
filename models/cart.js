let mongoose = require('mongoose');

let cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                default: 1,
                min: 1
            },
            price: {
                type: Number,
                required: true
            },
                        size: {      
                type: String
            },
            color: {    
                type: String
            }
        }],
        totalPrice: Number,
        priceAfterDiscount: Number,
        discount: Number

});

module.exports = mongoose.model('Cart', cartSchema);