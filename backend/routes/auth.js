const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for Admin Login (Hardcoded)
        if (email === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ id: "000000000000000000000001", isAdmin: true }, process.env.JWT_SECRET || "fallbacksecret", { expiresIn: "7d" });
            return res.json({
                token,
                user: {
                    _id: "000000000000000000000001",
                    username: "Admin",
                    email: email,
                    isAdmin: true,
                    bookmarks: []
                }
            });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallbacksecret", { expiresIn: "7d" });

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                bookmarks: user.bookmarks,
                isPublisher: user.isPublisher,
                isAdmin: user.isAdmin || false
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const auth = require("../middleware/auth");

// GET CURRENT USER
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        // Handle hardcoded admin
        if (req.user.id === "000000000000000000000001") {
            return res.json({
                _id: "000000000000000000000001",
                username: "Admin",
                email: process.env.ADMIN_USER,
                isAdmin: true,
                bookmarks: []
            });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
