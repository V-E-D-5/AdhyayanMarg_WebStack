const express = require("express");
const router = express.Router();
const {
  getUserAnalytics,
  updateUserAnalytics,
  resetUserAnalytics,
  requireAdmin,
  getAdminDashboard,
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getSystemHealth,
} = require("../controllers/analyticsController");
const { authenticateToken } = require("../middleware/auth");

// @route   GET /api/analytics/user
// @desc    Get user analytics
// @access  Private
router.get("/user", authenticateToken, getUserAnalytics);

// @route   POST /api/analytics/user/update
// @desc    Update user analytics
// @access  Private
router.post("/user/update", authenticateToken, updateUserAnalytics);

// @route   POST /api/analytics/user/reset
// @desc    Reset user analytics to 0
// @access  Private
router.post("/user/reset", authenticateToken, resetUserAnalytics);

// Admin Routes
// @route   GET /api/analytics/admin/dashboard
// @desc    Get comprehensive admin dashboard data
// @access  Private (Admin only)
router.get(
  "/admin/dashboard",
  authenticateToken,
  requireAdmin,
  getAdminDashboard
);

// @route   GET /api/analytics/admin/users
// @desc    Get all users with pagination and filtering
// @access  Private (Admin only)
router.get("/admin/users", authenticateToken, requireAdmin, getAllUsers);

// @route   GET /api/analytics/admin/users/:userId
// @desc    Get specific user details
// @access  Private (Admin only)
router.get(
  "/admin/users/:userId",
  authenticateToken,
  requireAdmin,
  getUserById
);

// @route   PUT /api/analytics/admin/users/:userId
// @desc    Update user status (active, verified, role)
// @access  Private (Admin only)
router.put(
  "/admin/users/:userId",
  authenticateToken,
  requireAdmin,
  updateUserStatus
);

// @route   DELETE /api/analytics/admin/users/:userId
// @desc    Delete user
// @access  Private (Admin only)
router.delete(
  "/admin/users/:userId",
  authenticateToken,
  requireAdmin,
  deleteUser
);

// @route   GET /api/analytics/admin/system-health
// @desc    Get system health and performance metrics
// @access  Private (Admin only)
router.get(
  "/admin/system-health",
  authenticateToken,
  requireAdmin,
  getSystemHealth
);

module.exports = router;
