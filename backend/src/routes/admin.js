const express = require("express");
const { authenticateToken, requireRole } = require("../middleware/auth");
const {
  getDashboardStats,
  getUsers,
  createUser,
  updateUserStatus,
  resetUserPassword,
  deleteUser,
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

// Create new user
router.post("/users", createUser);

// Update user status
router.patch("/users/:userId/status", updateUserStatus);

// Reset user password
router.patch("/users/:userId/password", resetUserPassword);

// Delete user
router.delete("/users/:userId", deleteUser);

// Get quiz data for admin dashboard
router.get("/quiz-data", getQuizData);

module.exports = router;
