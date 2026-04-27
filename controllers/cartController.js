const cart = require('../models/cart');

//get cart by user ID
exports.getCartByUserId = async (req, res) => {
    try {
        const userCart = await cart.findOne({ userId: req.params.userId })
            .populate('products.productId'); // This populates product details
        
        if (!userCart) {
            return res.status(404).json({ message: "Cart not found for this user" });
        }
        
        // Transform the response to include product details
        const transformedCart = {
            _id: userCart._id,
            userId: userCart.userId,
            products: userCart.products.map(item => ({
                productId: item.productId._id,
                name: item.productId.name,
                price: item.price,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
                image: item.productId.image
            }))
        };
        
        res.status(200).json(transformedCart);
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message });
    }   
}

//add product to cart
//add product to cart
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity, price, size, color } = req.body;
        const userId = req.user._id || req.user.id; // Fix: get userId properly
        
        let userCart = await cart.findOne({ userId });
        
        if (!userCart) {
            // Remove the problematic line
            userCart = new cart({ userId: userId, products: [{ productId, quantity, price, size, color }] });
        } else { 
            const productIndex = userCart.products.findIndex(p => p.productId.toString() === productId);
            if (productIndex > -1) {
                userCart.products[productIndex].quantity += quantity;
            } else {
                userCart.products.push({ productId, quantity, price, size, color });
            }
        }
        const savedCart = await userCart.save();
        
        // Return populated cart
        const populatedCart = await cart.findById(savedCart._id).populate('products.productId');
        res.status(200).json(populatedCart);
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(400).json({ message: error.message });
    }
}
// remove product from cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;
        const userCart = await cart.findOne({ userId });
        
        if (!userCart) {
            return res.status(404).json({ message: "Cart not found for this user" });
        }   
        
        const productIndex = userCart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            userCart.products.splice(productIndex, 1);
            const savedCart = await userCart.save();
            const populatedCart = await cart.findById(savedCart._id).populate('products.productId');
            res.status(200).json(populatedCart);
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }       
    } catch (error) {
        console.error("Remove from cart error:", error);
        res.status(400).json({ message: error.message });   
    }
}

//remove all products from cart
exports.clearCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const userCart = await cart.findOne({ userId });
        
        if (!userCart) {
            return res.status(404).json({ message: "Cart not found for this user" });
        }
        
        userCart.products = [];
        const savedCart = await userCart.save();
        const populatedCart = await cart.findById(savedCart._id).populate('products.productId');
        res.status(200).json(populatedCart);
    } catch (error) {
        console.error("Clear cart error:", error);
        res.status(400).json({ message: error.message });
    }
}

//update product quantity in cart
exports.updateCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({ message: "Invalid productId or quantity" });
        }
        
        const userId = req.user._id;
        const userCart = await cart.findOne({ userId });
        
        if (!userCart) {
            return res.status(404).json({ message: "Cart not found for this user" });
        }
        
        const productIndex = userCart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            userCart.products[productIndex].quantity = quantity;
            const savedCart = await userCart.save();
            // Populate product details before sending
            const populatedCart = await cart.findById(savedCart._id).populate('products.productId');
            res.status(200).json(populatedCart);
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.error("Update cart error:", error);
        res.status(400).json({ message: error.message });
    }
}