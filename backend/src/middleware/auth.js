const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { findUserById } = require("../data/mockUsers");
const mongoose = require("mongoose");

// Middleware to authenticate JWT tokens
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Find the user - check if database is connected
    let user;
    if (mongoose.connection.readyState === 1) {
      // Database connected - use MongoDB
      user = await User.findById(decoded.id).select("-password");
    } else {
      // Database not connected - use mock users
      user = await findUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token - user not found",
      });
    }

    // Add user info to request object
    req.user = {
      id: user.id || user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

// Middleware to check if user has specific role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

// Optional authentication middleware - doesn't require token but sets user if present
const authenticateOptional = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      // No token provided, continue as guest user
      req.user = null;
      return next();
    }

    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Find the user - check if database is connected
    let user;
    if (mongoose.connection.readyState === 1) {
      // Database connected - use MongoDB
      user = await User.findById(decoded.id).select("-password");
    } else {
      // Database not connected - use mock users
      user = await findUserById(decoded.id);
    }

    if (user) {
      // Add user info to request object
      req.user = {
        id: user.id || user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    // If token is invalid, continue as guest user
    console.log("Optional auth - invalid token, continuing as guest");
    req.user = null;
    next();
  }
};

// Required authentication middleware - requires valid token
const authenticateRequired = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Find the user - check if database is connected
    let user;
    if (mongoose.connection.readyState === 1) {
      // Database connected - use MongoDB
      user = await User.findById(decoded.id).select("-password");
    } else {
      // Database not connected - use mock users
      user = await findUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token - user not found",
      });
    }

    // Add user info to request object
    req.user = {
      id: user.id || user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

// Middleware to check if user is verified
const requireVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  // For now, we'll skip verification check since we set isVerified to false by default
  // In a real app, you'd check req.user.isVerified
  next();
};

module.exports = {
  authenticateToken,
  optional: authenticateOptional,
  required: authenticateRequired,
  requireRole,
  requireVerification,
};
