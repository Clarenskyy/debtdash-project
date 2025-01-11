const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to generate a token
const createToken = (id) => {
  return jwt.sign({ id }, "your_secret_key", { expiresIn: "1d" }); // Replace "your_secret_key" with a strong secret key
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a token
    const token = createToken(user._id);

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Signup user
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = await User.create({ email, password: hashedPassword });

    // Generate a token
    const token = createToken(user._id);

    res.status(201).json({ message: "Signup successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error signing up", error: error.message });
  }
};

module.exports = { signupUser, loginUser };
