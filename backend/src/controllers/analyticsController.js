const mongoose = require("mongoose");
const User = require("../models/User");
const QuizResult = require("../models/QuizResult");
const Roadmap = require("../models/Roadmap");
const College = require("../models/College");
const Story = require("../models/Story");
const Faq = require("../models/Faq");

// Check if database is connected
const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Admin middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
  next();
};

// Get user analytics
const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find user and populate analytics
    const user = await User.findById(userId).select("analytics");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Initialize analytics if not exists
    if (!user.analytics) {
      user.analytics = {
        totalInteractions: 0,
        completedCourses: 0,
        appliedInternships: 0,
        appliedScholarships: 0,
        totalHours: 0,
        achievements: 0,
        lastUpdated: new Date(),
      };
      await user.save();
    }

    res.status(200).json({
      success: true,
      data: user.analytics,
    });
  } catch (error) {
    console.error("Error getting user analytics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update user analytics
const updateUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { analytics } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update analytics
    user.analytics = {
      ...user.analytics,
      ...analytics,
      lastUpdated: new Date(),
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Analytics updated successfully",
      data: user.analytics,
    });
  } catch (error) {
    console.error("Error updating user analytics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get admin dashboard statistics
const getAdminDashboard = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // User statistics
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalCounselors = await User.countDocuments({ role: "counselor" });
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    // Content statistics
    const totalQuizResults = await QuizResult.countDocuments();
    const totalRoadmaps = await Roadmap.countDocuments();
    const totalColleges = await College.countDocuments();
    const totalStories = await Story.countDocuments();
    const totalFaqs = await Faq.countDocuments();

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    const recentQuizResults = await QuizResult.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Engagement statistics
    const usersWithAnalytics = await User.find({
      "analytics.totalInteractions": { $exists: true, $gt: 0 },
    });

    const totalInteractions = usersWithAnalytics.reduce(
      (sum, user) => sum + (user.analytics.totalInteractions || 0),
      0
    );

    const avgInteractionsPerUser = totalUsers > 0 ? totalInteractions / totalUsers : 0;

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          students: totalStudents,
          admins: totalAdmins,
          counselors: totalCounselors,
          active: activeUsers,
          verified: verifiedUsers,
          recentRegistrations,
        },
        content: {
          quizResults: totalQuizResults,
          roadmaps: totalRoadmaps,
          colleges: totalColleges,
          stories: totalStories,
          faqs: totalFaqs,
          recentQuizResults,
        },
        engagement: {
          totalInteractions,
          avgInteractionsPerUser: Math.round(avgInteractionsPerUser * 100) / 100,
        },
      },
    });
  } catch (error) {
    console.error("Error getting admin dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get user list with analytics (admin only)
const getUsersList = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    const skip = (page - 1) * limit;

    if (!isDbConnected()) {
      return res.status(503).json({
        success: false,
        message: "Database not available",
      });
    }

    // Build filter
    const filter = {};
    if (role) {
      filter.role = role;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Get users with pagination
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: page * limit < totalUsers,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Error getting users list:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get user details (admin only)
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get user's quiz results
    const quizResults = await QuizResult.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        user,
        quizResults,
      },
    });
  } catch (error) {
    console.error("Error getting user details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update user status (admin only)
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive, isVerified } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user status
    if (isActive !== undefined) {
      user.isActive = isActive;
    }
    if (isVerified !== undefined) {
      user.isVerified = isVerified;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getUserAnalytics,
  updateUserAnalytics,
  getAdminDashboard,
  getUsersList,
  getUserDetails,
  updateUserStatus,
  requireAdmin,
};