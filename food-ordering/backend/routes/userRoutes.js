const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const requireAuth = require("../middleware/auth");

const router = express.Router();

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// POST /api/users/register - create a new account (always a customer)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(400).json({ message: "This email is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",
    });

    res.status(201).json({ token: createToken(user._id), user: publicUser(user) });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "This email is already registered" });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/users/login - log in with email and password
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    const passwordMatches = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({ message: "Wrong email or password" });
    }

    res.json({ token: createToken(user._id), user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/users/me - get the logged in customer
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = router;