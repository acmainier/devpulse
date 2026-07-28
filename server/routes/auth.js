const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // used to create and sign login tokens
const User = require("../models/user"); // Sequelize model for the users table
const { Op } = require("sequelize"); // Sequelize operators (e.g. Op.or for "OR" queries)
const authMiddleware = require("../middleware/auth");

// GET /api/auth/me — returns the currently logged-in user, based on their token
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // authMiddleware already verified the token and attached the user's id to req.user
    const user = await User.findByPk(req.user.id);

    // Token was valid, but this user no longer exists in the database
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send back only safe fields — never the password hash
    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/register — creates a new user account
router.post("/register", async (req, res) => {
  try {
    // const { username, email, password } = req.body;
    const { username = null, email = null, password } = req.body;

    // Reject the request if any required field is missing
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Username, email, and password are all required" });
    }

    // Check whether a user with this email OR username already exists.
    // This is what actually enforces "unique" at the application level,
    // giving a clean error instead of a raw database error.
    const userData = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });
    if (userData) {
      return res
        .status(409) // 409 = Conflict (the data submitted conflicts with existing data)
        .json({ error: "Username or email already in use" });
    }

    // Create the user. We pass the PLAIN password on purpose —
    // the beforeCreate hook in the User model hashes it automatically
    // before it's written to the database. This route never hashes anything itself.
    const user = await User.create({ username, email, password });

    // Sign a JWT containing just the new user's id.
    // process.env.JWT_SECRET is a private key stored in .env — never hardcode this.
    // expiresIn controls how long the token stays valid before the user must log in again.
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 201 = Created. Send back the token plus a SAFE subset of user fields —
    // never send back user.password (even hashed), the client doesn't need it.
    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    // Catches anything unexpected (e.g. DB connection issues) so the server
    // doesn't crash and the client still gets a clean JSON error.
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/login — verifies credentials and returns a JWT
router.post("/login", async (req, res) => {
  try {
    // const { username, email, password } = req.body;
    const { username = null, email = null, password } = req.body;

    // Look the user up by either email or username
    const user = await User.findOne({
      where: { [Op.or]: [{ email }, { username }] },
    });

    // Deliberately vague error message — we don't want to reveal whether
    // the email/username exists at all. That would let an attacker use
    // this endpoint to check which accounts exist on the app.
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the submitted plain-text password against the stored hash.
    // comparePassword is an instance method defined on the User model.
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Same token-signing pattern as register
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 200 = OK (nothing new was created here, unlike register's 201)
    res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
