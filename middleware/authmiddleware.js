const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv');
dotenv.config();

const authenticate = async (req, res, next) => {
    try {
        // ← was req.header.Authorization which crashes (req.header is a function not object)
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ← was just req.user = decoded, which only has {id, isAdmin}
        // Fetching full user from DB so req.user._id works in all controllers
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(401).json({ message: "User not found." });

        req.user = user;
        next();
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired token." });
    }
};

module.exports = authenticate;
