const mongoose = require('mongoose');

let orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        name: { type: String },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        size:  { type: String },
        color: { type: String },
        price: { type: Number, required: true },
        image: { type: String },
    }],
    customerInfo: {
        fullName:       { type: String, required: true },
        email:          { type: String },
        phoneNumber:    { type: String, required: true },
        address:        { type: String, required: true },
        // ← enum was ['Home', 'yalidine'] but frontend sends 'domicile' — fixed
        deliveryMethod: { type: String, enum: ['domicile', 'yalidine'], default: 'domicile' }
    },
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    orderDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
