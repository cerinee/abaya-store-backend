const Order = require('../models/order'); // ← capital O to match usage below

// GET /orders — logged in user's orders
exports.getAllOrders = async (req, res) => {
    try {
        const allOrders = await Order.find({ userId: req.user._id })
            .populate('products.productId');
        res.status(200).json(allOrders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// POST /orders/create
exports.createOrder = async (req, res) => {
    try {
        const orderData = {
            ...req.body,
            userId: req.user._id, // ← use _id from the full user object
        };
        const newOrder = await Order.create(orderData);
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// GET /admin/orders
exports.getOrdersForAdmin = async (req, res) => {
    try {
        const allOrders = await Order.find()
            .populate('products.productId')
            .populate('userId', 'fullName email');
        res.status(200).json(allOrders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PUT /admin/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ message: "Order status updated", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
