const express = require("express");
const router = express.Router();
const {
  getUserAnalytics,
  updateUserAnalytics,
  requireAdmin,
  getAdminDashboard,
  getUsersList,
  getUserDetails,
  updateUserStatus,
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

// Removed resetUserAnalytics route - not implemented

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
router.get("/admin/users", authenticateToken, requireAdmin, getUsersList);

// @route   GET /api/analytics/admin/users/:userId
// @desc    Get specific user details
// @access  Private (Admin only)
router.get(
  "/admin/users/:userId",
  authenticateToken,
  requireAdmin,
  getUserDetails
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

// Removed delete user and system health routes - not implemented

module.exports = router;
