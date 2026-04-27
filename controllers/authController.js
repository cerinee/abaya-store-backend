const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require('validator');
const dotenv = require('dotenv');
dotenv.config();

exports.signUp = async (req, res) => {
    try {
        const { fullName, address, phoneNumber, email, password } = req.body;

        // validate input — first thing
        if (!fullName || !address || !phoneNumber || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (!validator.isMobilePhone(phoneNumber, 'any')) {
            return res.status(400).json({ message: "Invalid phone number format" });
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Password is not strong enough" });
        }
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: "Email already exists" });
        }
        if (await User.findOne({ phoneNumber })) {
            return res.status(400).json({ message: "Phone number already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, address, phoneNumber, email, password: hashedPassword });
        const savedUser = await newUser.save();

        const token = jwt.sign(
            { id: savedUser._id, isAdmin: savedUser.isAdmin }, 
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                _id: savedUser._id,
                fullName: savedUser.fullName,
                email: savedUser.email,
                isAdmin: savedUser.isAdmin,
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // validate input — must be at the top before using them
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: foundUser._id, isAdmin: foundUser.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: "User signed in successfully",
            token,
            user: {
                _id: foundUser._id,
                fullName: foundUser.fullName,
                email: foundUser.email,
                isAdmin: foundUser.isAdmin,
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};