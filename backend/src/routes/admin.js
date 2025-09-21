const express = require("express");
const { authenticateToken, requireRole } = require("../middleware/auth");
const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getQuizData,
} = require("../controllers/adminController");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireRole(["admin"]));

// Get dashboard statistics
router.get("/dashboard", getDashboardStats);

// Get users with pagination and filtering
router.get("/users", getUsers);

// Update user status
router.patch("/users/:userId/status", updateUserStatus);

// Get quiz data for admin dashboard
router.get("/quiz-data", getQuizData);

module.exports = router;
