let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        match: /^\d{10}$/
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    password: { 
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('User', userSchema);
