const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
  findUserById,
  updateUser,
  comparePassword,
} = require("../data/mockUsers");
const mongoose = require("mongoose");
const router = express.Router();

// Check if database is connected
const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key",
    (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token",
        });
      }
      req.user = user;
      next();
    }
  );
};

// Register
router.post(
  "/register",
  [
    body("name")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Name must be at least 2 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }

      // Create new user (password will be hashed by pre-save hook)
      const user = new User({
        name,
        email,
        password,
        role: "student",
        isActive: true,
        isVerified: true,
        analytics: {
          totalInteractions: 0,
          completedCourses: 0,
          appliedInternships: 0,
          appliedScholarships: 0,
          totalHours: 0,
          achievements: 0,
          lastUpdated: new Date(),
        },
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: process.env.JWT_EXPIRE || "7d" }
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Login
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      let user;

      if (isDbConnected()) {
        // Use MongoDB
        user = await User.findOne({ email }).select("+password");
      } else {
        // Use mock users
        console.log("Looking for user with email:", email);
        user = await findUserByEmailWithPassword(email);
        console.log("Found user:", user ? "Yes" : "No");
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated",
        });
      }

      // Compare password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      // Update last login
      user.lastLogin = new Date();
      if (isDbConnected()) {
        await user.save();
      } else {
        await updateUser(user.id, { lastLogin: new Date() });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id || user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: process.env.JWT_EXPIRE || "7d" }
      );

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

// Get current user
router.get("/me", authenticateToken, async (req, res) => {
  try {
    let user;

    if (isDbConnected()) {
      user = await User.findById(req.user.id);
    } else {
      user = await findUserById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id || user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile || {},
        preferences: user.preferences || {},
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Logout (client-side token removal)
router.post("/logout", (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

// Verify token
router.post("/verify", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token is required",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    res.json({
      success: true,
      user: decoded,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

module.exports = router;
