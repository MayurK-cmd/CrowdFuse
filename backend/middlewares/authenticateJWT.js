// JWT 
//require("dotenv").config();
const jwt = require("jsonwebtoken");
const {User }= require("../models/userModel")

const JWT_SECRET = "your_secret_key";


exports.authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(403).json({ message: "Access denied, no token provided" });

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        try {
            const user = await User.findById(decoded.userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            req.user = user;
            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};
