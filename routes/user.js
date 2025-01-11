const express = require("express");

const router = express.Router();

// Controller functions
const { signupUser, loginUser } = require("../controllers/userController");

// Login route
router.post("/login", loginUser);

// Signup route
router.post("/signup", signupUser);

module.exports = router;
