// Signup and Login routes
const express = require("express");
const { signup, login, toggleLoginAccess } = require("../controllers/authController");
const { authenticateJWT } = require("../middlewares/authenticateJWT");
const router = express.Router();

router.post("/signup", signup);//over
router.post("/login", login);//over
router.post("/toggle-login", authenticateJWT, toggleLoginAccess);

module.exports = router;

