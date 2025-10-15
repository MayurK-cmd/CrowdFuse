// Signup and Login routes
const express = require("express");
const { signup, login, toggleLoginAccess, getUserDetails } = require("../controllers/authController");
const { authenticateJWT } = require("../middlewares/authenticateJWT");
const router = express.Router();

router.post("/signup", signup);//over
router.post("/login", login);//over
router.post("/toggle-login", authenticateJWT, toggleLoginAccess);
router.get("/my-profile",authenticateJWT, getUserDetails);

module.exports = router;

