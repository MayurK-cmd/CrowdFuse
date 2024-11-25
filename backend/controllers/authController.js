const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const  { User } = require("../models/userModel");

const JWT_SECRET = "your_secret_key";

// Signup route
exports.signup = async (req, res) => {
    const { email, password, username, role = "Resident" } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, username, role });

        await newUser.save();
        res.status(201).json({ msg: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Login route
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // Check whether login is allowed for the account
        if (!user.isLoginAllowed) {
            return res.status(403).json({ message: "Login is currently disabled for this account" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ msg: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Toggle login access for a user
exports.toggleLoginAccess = async (req, res) => {
    const { email, allowLogin } = req.body;

    try {
        // Check if the admin user is authorized
        const adminUser = req.user;
        if (adminUser.email !== "mayurgk2006@gmail.com") {
            return res.status(403).json({ message: "Access denied" });
        }

        // Validate `allowLogin` input
        if (typeof allowLogin !== "boolean") {
            return res.status(400).json({ message: "Invalid value for allowLogin. Expected true or false." });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isLoginAllowed = allowLogin;
        await user.save();

        res.json({ message: `Login access for ${email} has been ${allowLogin ? "enabled" : "disabled"}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
