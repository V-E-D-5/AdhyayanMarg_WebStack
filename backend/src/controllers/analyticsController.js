const mongoose = require("mongoose");
const User = require("../models/User");
const QuizResult = require("../models/QuizResult");
const Roadmap = require("../models/Roadmap");
const College = require("../models/College");
const Story = require("../models/Story");
const Faq = require("../models/Faq");
const {
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
} = require("../data/mockUsers");

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

    res.json({
      success: true,
      data: user.analytics,
    });
  } catch (error) {
    console.error("Get user analytics error:", error);
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
    const { field, increment = 1 } = req.body;

    const validFields = [
      "totalInteractions",
      "completedCourses",
      "appliedInternships",
      "appliedScholarships",
      "totalHours",
      "achievements",
    ];

    if (!validFields.includes(field)) {
      return res.status(400).json({
        success: false,
        message: "Invalid field name",
      });
    }

    const user = await User.findById(userId);

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
    }

    // Update the specific field
    user.analytics[field] = (user.analytics[field] || 0) + increment;
    user.analytics.lastUpdated = new Date();

    await user.save();

    res.json({
      success: true,
      data: user.analytics,
      message: `${field} updated successfully`,
    });
  } catch (error) {
    console.error("Update user analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Reset user analytics to 0
const resetUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Reset all analytics to 0
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

    res.json({
      success: true,
      data: user.analytics,
      message: "Analytics reset successfully",
    });
  } catch (error) {
    console.error("Reset user analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin: Get comprehensive dashboard analytics
const getAdminDashboard = async (req, res) => {
  try {
    let totalUsers,
      totalStudents,
      totalAdmins,
      totalCounselors,
      activeUsers,
      verifiedUsers;
    let totalQuizResults,
      completedQuizzes,
      totalRoadmaps,
      totalColleges,
      totalStories,
      totalFaqs;

    if (isDbConnected()) {
      // Get total counts from MongoDB
      totalUsers = await User.countDocuments();
      totalStudents = await User.countDocuments({ role: "student" });
      totalAdmins = await User.countDocuments({ role: "admin" });
      totalCounselors = await User.countDocuments({ role: "counselor" });
      activeUsers = await User.countDocuments({ isActive: true });
      verifiedUsers = await User.countDocuments({ isVerified: true });

      // Get quiz statistics
      totalQuizResults = await QuizResult.countDocuments();
      completedQuizzes = await QuizResult.countDocuments({ completed: true });

      // Get content statistics
      totalRoadmaps = await Roadmap.countDocuments();
      totalColleges = await College.countDocuments();
      totalStories = await Story.countDocuments();
      totalFaqs = await Faq.countDocuments();
    } else {
      // Use mock data when database is not connected
      const { users } = require("../data/mockUsers");
      totalUsers = users.length;
      totalStudents = users.filter((u) => u.role === "student").length;
      totalAdmins = users.filter((u) => u.role === "admin").length;
      totalCounselors = users.filter((u) => u.role === "counselor").length;
      activeUsers = users.filter((u) => u.isActive).length;
      verifiedUsers = users.filter((u) => u.isVerified).length;

      // Mock content statistics
      totalQuizResults = 15;
      completedQuizzes = 12;
      totalRoadmaps = 8;
      totalColleges = 25;
      totalStories = 10;
      totalFaqs = 20;
    }

    // Get user engagement analytics
    let userEngagement;
    if (isDbConnected()) {
      userEngagement = await User.aggregate([
        {
          $group: {
            _id: null,
            totalInteractions: { $sum: "$analytics.totalInteractions" },
            totalHours: { $sum: "$analytics.totalHours" },
            totalCompletedCourses: { $sum: "$analytics.completedCourses" },
            totalAppliedInternships: { $sum: "$analytics.appliedInternships" },
            totalAppliedScholarships: {
              $sum: "$analytics.appliedScholarships",
            },
            totalAchievements: { $sum: "$analytics.achievements" },
            avgInteractions: { $avg: "$analytics.totalInteractions" },
            avgHours: { $avg: "$analytics.totalHours" },
          },
        },
      ]);
    } else {
      // Mock engagement data
      const { users } = require("../data/mockUsers");
      const totalInteractions = users.reduce(
        (sum, user) => sum + (user.analytics?.totalInteractions || 0),
        0
      );
      const totalHours = users.reduce(
        (sum, user) => sum + (user.analytics?.totalHours || 0),
        0
      );
      const totalCompletedCourses = users.reduce(
        (sum, user) => sum + (user.analytics?.completedCourses || 0),
        0
      );
      const totalAppliedInternships = users.reduce(
        (sum, user) => sum + (user.analytics?.appliedInternships || 0),
        0
      );
      const totalAppliedScholarships = users.reduce(
        (sum, user) => sum + (user.analytics?.appliedScholarships || 0),
        0
      );
      const totalAchievements = users.reduce(
        (sum, user) => sum + (user.analytics?.achievements || 0),
        0
      );

      userEngagement = [
        {
          totalInteractions,
          totalHours,
          totalCompletedCourses,
          totalAppliedInternships,
          totalAppliedScholarships,
          totalAchievements,
          avgInteractions: totalInteractions / users.length,
          avgHours: totalHours / users.length,
        },
      ];
    }

    // Get recent user registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let recentRegistrations,
      dailyActivity,
      topUsers,
      roleDistribution,
      verificationStats;

    if (isDbConnected()) {
      recentRegistrations = await User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo },
      });

      // Get user activity by day (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      dailyActivity = await User.aggregate([
        {
          $match: {
            lastLogin: { $gte: sevenDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$lastLogin" },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      // Get top performing users
      topUsers = await User.find({ isActive: true })
        .select("name email analytics totalInteractions totalHours")
        .sort({ "analytics.totalInteractions": -1 })
        .limit(10);

      // Get user role distribution
      roleDistribution = await User.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ]);

      // Get user verification status
      verificationStats = await User.aggregate([
        {
          $group: {
            _id: "$isVerified",
            count: { $sum: 1 },
          },
        },
      ]);
    } else {
      // Mock data
      const { users } = require("../data/mockUsers");
      recentRegistrations = users.filter(
        (u) => new Date(u.createdAt) >= thirtyDaysAgo
      ).length;

      // Mock daily activity
      dailyActivity = [
        { _id: "2025-09-20", count: 3 },
        { _id: "2025-09-19", count: 2 },
        { _id: "2025-09-18", count: 1 },
      ];

      // Mock top users
      topUsers = users
        .filter((u) => u.isActive)
        .sort(
          (a, b) =>
            (b.analytics?.totalInteractions || 0) -
            (a.analytics?.totalInteractions || 0)
        )
        .slice(0, 10)
        .map((u) => ({
          name: u.name,
          email: u.email,
          analytics: u.analytics || {},
        }));

      // Mock role distribution
      roleDistribution = [
        {
          _id: "student",
          count: users.filter((u) => u.role === "student").length,
        },
        { _id: "admin", count: users.filter((u) => u.role === "admin").length },
        {
          _id: "counselor",
          count: users.filter((u) => u.role === "counselor").length,
        },
      ];

      // Mock verification stats
      verificationStats = [
        { _id: true, count: users.filter((u) => u.isVerified).length },
        { _id: false, count: users.filter((u) => !u.isVerified).length },
      ];
    }

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalStudents,
          totalAdmins,
          totalCounselors,
          activeUsers,
          verifiedUsers,
          recentRegistrations,
        },
        content: {
          totalQuizResults,
          completedQuizzes,
          totalRoadmaps,
          totalColleges,
          totalStories,
          totalFaqs,
        },
        engagement: userEngagement[0] || {
          totalInteractions: 0,
          totalHours: 0,
          totalCompletedCourses: 0,
          totalAppliedInternships: 0,
          totalAppliedScholarships: 0,
          totalAchievements: 0,
          avgInteractions: 0,
          avgHours: 0,
        },
        activity: {
          dailyActivity,
          topUsers,
          roleDistribution,
          verificationStats,
        },
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin: Get all users with pagination and filtering
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role;
    const search = req.query.search;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    let users, totalUsers;

    if (isDbConnected()) {
      // Build filter object
      const filter = {};
      if (role) filter.role = role;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      // Get users with pagination
      users = await User.find(filter)
        .select("-password")
        .sort({ [sortBy]: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit);

      totalUsers = await User.countDocuments(filter);
    } else {
      // Use mock data
      const { users: mockUsers } = require("../data/mockUsers");

      // Apply filters
      let filteredUsers = mockUsers;

      if (role) {
        filteredUsers = filteredUsers.filter((u) => u.role === role);
      }

      if (search) {
        filteredUsers = filteredUsers.filter(
          (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Sort
      filteredUsers.sort((a, b) => {
        const aVal = a[sortBy] || new Date(a.createdAt);
        const bVal = b[sortBy] || new Date(b.createdAt);

        if (sortOrder === 1) {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      totalUsers = filteredUsers.length;

      // Paginate
      const startIndex = (page - 1) * limit;
      users = filteredUsers.slice(startIndex, startIndex + limit);
    }

    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages,
          totalUsers,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin: Get user details by ID
const getUserById = async (req, res) => {
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
    const quizResults = await QuizResult.find({ userId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: {
        user,
        quizResults,
      },
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin: Update user status
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive, isVerified, role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user fields
    if (typeof isActive === "boolean") user.isActive = isActive;
    if (typeof isVerified === "boolean") user.isVerified = isVerified;
    if (role && ["student", "admin", "counselor"].includes(role))
      user.role = role;

    await user.save();

    res.json({
      success: true,
      message: "User updated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin: Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Don't allow deleting admin users
    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete admin users",
      });
    }

    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin: Get system health and performance metrics
const getSystemHealth = async (req, res) => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get recent activity
    const recentLogins = await User.countDocuments({
      lastLogin: { $gte: oneHourAgo },
    });

    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: oneDayAgo },
    });

    // Get database connection status
    const dbStatus =
      mongoose.connection.readyState === 1 ? "connected" : "disconnected";

    // Get memory usage (if available)
    const memoryUsage = process.memoryUsage();

    res.json({
      success: true,
      data: {
        timestamp: now,
        database: {
          status: dbStatus,
          connectionState: mongoose.connection.readyState,
        },
        activity: {
          recentLogins,
          recentRegistrations,
        },
        system: {
          uptime: process.uptime(),
          memoryUsage: {
            rss: Math.round(memoryUsage.rss / 1024 / 1024) + " MB",
            heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + " MB",
            heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + " MB",
          },
        },
      },
    });
  } catch (error) {
    console.error("System health error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
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
};
