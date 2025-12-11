const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Get admin dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      // Return dummy data when database is not connected
      const dummyData = {
        userStats: {
          totalUsers: 1247,
          activeUsers: 892,
          adminUsers: 1,
          studentUsers: 1246,
          newUsersThisMonth: 156,
          newUsersToday: 23,
        },
        userGrowth: [
          { month: "Apr", users: 400, active: 320 },
          { month: "May", users: 500, active: 400 },
          { month: "Jun", users: 600, active: 480 },
          { month: "Jul", users: 700, active: 560 },
          { month: "Aug", users: 800, active: 640 },
          { month: "Sep", users: 900, active: 720 },
        ],
        platformStats: {
          totalQuizzes: 89,
          totalRoadmaps: 45,
          totalColleges: 234,
          totalStories: 156,
          totalFaqs: 78,
        },
        engagementData: [
          { name: "Mon", sessions: 2400, pageViews: 4000 },
          { name: "Tue", sessions: 1398, pageViews: 3000 },
          { name: "Wed", sessions: 9800, pageViews: 2000 },
          { name: "Thu", sessions: 3908, pageViews: 2780 },
          { name: "Fri", sessions: 4800, pageViews: 1890 },
          { name: "Sat", sessions: 3800, pageViews: 2390 },
          { name: "Sun", sessions: 4300, pageViews: 3490 },
        ],
        deviceData: [
          { name: "Desktop", value: 45 },
          { name: "Mobile", value: 35 },
          { name: "Tablet", value: 20 },
        ],
        recentActivities: [
          {
            id: 1,
            user: "John Doe",
            action: "completed Know-Me",
            time: "2 minutes ago",
            type: "quiz",
          },
          {
            id: 2,
            user: "Jane Smith",
            action: "viewed software engineering roadmap",
            time: "5 minutes ago",
            type: "roadmap",
          },
          {
            id: 3,
            user: "Mike Johnson",
            action: "applied for internship",
            time: "10 minutes ago",
            type: "application",
          },
          {
            id: 4,
            user: "Sarah Wilson",
            action: "shared success story",
            time: "15 minutes ago",
            type: "story",
          },
        ],
        recentUsers: [
          {
            id: "admin-001",
            name: "System Administrator",
            email: "admin@adhyayanmarg.com",
            role: "admin",
            isActive: true,
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          },
          {
            id: "user-001",
            name: "John Doe",
            email: "john@example.com",
            role: "student",
            isActive: true,
            lastLogin: new Date(Date.now() - 86400000).toISOString(),
            createdAt: new Date(Date.now() - 2592000000).toISOString(),
          },
          {
            id: "user-002",
            name: "Jane Smith",
            email: "jane@example.com",
            role: "student",
            isActive: true,
            lastLogin: new Date(Date.now() - 172800000).toISOString(),
            createdAt: new Date(Date.now() - 5184000000).toISOString(),
          },
          {
            id: "user-003",
            name: "Mike Johnson",
            email: "mike@example.com",
            role: "student",
            isActive: false,
            lastLogin: new Date(Date.now() - 604800000).toISOString(),
            createdAt: new Date(Date.now() - 7776000000).toISOString(),
          },
          {
            id: "user-004",
            name: "Sarah Wilson",
            email: "sarah@example.com",
            role: "student",
            isActive: true,
            lastLogin: new Date(Date.now() - 3600000).toISOString(),
            createdAt: new Date(Date.now() - 10368000000).toISOString(),
          },
        ],
      };

      return res.json({
        success: true,
        data: dummyData,
      });
    }

    // Use individual count queries for better Azure Cosmos DB compatibility
    const [
      totalUsers,
      activeUsers,
      adminUsers,
      studentUsers,
      mentorUsers,
      newUsersThisMonth,
      newUsersToday,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "mentor" }),
      User.countDocuments({
        createdAt: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      }),
      User.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),
    ]);

    // Get recent users (last 10)
    const recentUsers = await User.find()
      .select("name email role isActive lastLogin createdAt")
      .sort({ createdAt: -1 })
      .limit(10);

    // Simplified user growth calculation for Azure Cosmos DB compatibility
    const monthlyGrowth = [];
    const monthNames = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];

    // Generate mock growth data based on total users for performance
    for (let i = 0; i < 6; i++) {
      const monthName = monthNames[i];
      const baseUsers = Math.floor(totalUsers / 6);
      const variance = Math.floor(baseUsers * 0.3);

      monthlyGrowth.push({
        month: monthName,
        users: baseUsers + Math.floor(Math.random() * variance),
        active: Math.floor(
          (baseUsers + Math.floor(Math.random() * variance)) * 0.8
        ),
      });
    }

    // Optimize: Get platform statistics in parallel
    const QuizResult = require("../models/QuizResult");
    const Roadmap = require("../models/Roadmap");
    const College = require("../models/College");
    const Story = require("../models/Story");
    const Faq = require("../models/Faq");

    const [
      totalQuizzes,
      totalRoadmaps,
      totalColleges,
      totalStories,
      totalFaqs,
    ] = await Promise.all([
      QuizResult.countDocuments(),
      Roadmap.countDocuments(),
      College.countDocuments(),
      Story.countDocuments(),
      Faq.countDocuments(),
    ]);

    const platformStats = {
      totalQuizzes,
      totalRoadmaps,
      totalColleges,
      totalStories,
      totalFaqs,
    };

    // Optimize: Simplified engagement data (mock for now to improve performance)
    const engagementData = [
      {
        name: "Mon",
        sessions: Math.floor(totalUsers * 0.8),
        pageViews: Math.floor(totalUsers * 1.2),
      },
      {
        name: "Tue",
        sessions: Math.floor(totalUsers * 0.9),
        pageViews: Math.floor(totalUsers * 1.3),
      },
      {
        name: "Wed",
        sessions: Math.floor(totalUsers * 0.7),
        pageViews: Math.floor(totalUsers * 1.1),
      },
      {
        name: "Thu",
        sessions: Math.floor(totalUsers * 0.85),
        pageViews: Math.floor(totalUsers * 1.25),
      },
      {
        name: "Fri",
        sessions: Math.floor(totalUsers * 0.75),
        pageViews: Math.floor(totalUsers * 1.15),
      },
      {
        name: "Sat",
        sessions: Math.floor(totalUsers * 0.6),
        pageViews: Math.floor(totalUsers * 0.9),
      },
      {
        name: "Sun",
        sessions: Math.floor(totalUsers * 0.5),
        pageViews: Math.floor(totalUsers * 0.8),
      },
    ];

    // Optimize: Simplified device data (mock for performance)
    const deviceData = [
      { name: "Desktop", value: 60 },
      { name: "Mobile", value: 35 },
      { name: "Tablet", value: 5 },
    ];

    // Optimize: Simplified recent activities
    const recentActivities = recentUsers.slice(0, 5).map((user, index) => ({
      id: index + 1,
      user: user.name,
      action: "last active",
      time: user.lastLogin
        ? `${Math.floor(
            (new Date() - new Date(user.lastLogin)) / 60000
          )} minutes ago`
        : "Never",
      type: "activity",
    }));

    res.json({
      success: true,
      data: {
        userStats: {
          totalUsers,
          activeUsers,
          adminUsers,
          studentUsers,
          mentorUsers,
          newUsersThisMonth,
          newUsersToday,
        },
        userGrowth: monthlyGrowth,
        platformStats,
        engagementData,
        deviceData,
        recentActivities,
        recentUsers: recentUsers.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
    });
  }
};

// Get all users with pagination and filtering
const getUsers = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      // Return dummy data when database is not connected
      const dummyUsers = [
        {
          id: "admin-001",
          name: "System Administrator",
          email: "admin@adhyayanmarg.com",
          role: "admin",
          isActive: true,
          lastLogin: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        {
          id: "user-001",
          name: "John Doe",
          email: "john@example.com",
          role: "student",
          isActive: true,
          lastLogin: new Date(Date.now() - 86400000).toISOString(),
          createdAt: new Date(Date.now() - 2592000000).toISOString(),
        },
        {
          id: "user-002",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "student",
          isActive: true,
          lastLogin: new Date(Date.now() - 172800000).toISOString(),
          createdAt: new Date(Date.now() - 5184000000).toISOString(),
        },
        {
          id: "user-003",
          name: "Mike Johnson",
          email: "mike@example.com",
          role: "student",
          isActive: false,
          lastLogin: new Date(Date.now() - 604800000).toISOString(),
          createdAt: new Date(Date.now() - 7776000000).toISOString(),
        },
        {
          id: "user-004",
          name: "Sarah Wilson",
          email: "sarah@example.com",
          role: "student",
          isActive: true,
          lastLogin: new Date(Date.now() - 3600000).toISOString(),
          createdAt: new Date(Date.now() - 10368000000).toISOString(),
        },
      ];

      return res.json({
        success: true,
        data: {
          users: dummyUsers,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalUsers: dummyUsers.length,
            hasNext: false,
            hasPrev: false,
          },
        },
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const role = req.query.role || "";
    const status = req.query.status || "";

    // Build filter object
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (status === "active") {
      filter.isActive = true;
    } else if (status === "inactive") {
      filter.isActive = false;
    }

    // Get total count
    const totalUsers = await User.countDocuments(filter);

    // Get users with pagination
    const users = await User.find(filter)
      .select("name email role isActive lastLogin createdAt")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: {
        users: users.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        })),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: page < Math.ceil(totalUsers / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};

// Update user status
const updateUserStatus = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message:
          "Database not connected. Please ensure MongoDB is running and properly configured.",
      });
    }

    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select("name email role isActive");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user status",
    });
  }
};

// Reset user password
const resetUserPassword = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message:
          "Database not connected. Please ensure MongoDB is running and properly configured.",
      });
    }

    const { userId } = req.params;
    const { newPassword } = req.body;

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update the password (it will be hashed by the pre-save hook)
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Reset user password error:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting user password",
    });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message:
          "Database not connected. Please ensure MongoDB is running and properly configured.",
      });
    }

    const { userId } = req.params;
    const { adminPassword } = req.body;

    // Validate admin password
    if (!adminPassword) {
      return res.status(400).json({
        success: false,
        message: "Admin password is required",
      });
    }

    // Get admin user from token
    const adminId = req.user.id;
    const admin = await User.findById(adminId).select("+password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    // Verify admin password
    const isPasswordValid = await bcrypt.compare(adminPassword, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin password",
      });
    }

    // Find the user to delete
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deleting themselves
    if (userId === adminId) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    // Check if the user to delete is an admin
    if (userToDelete.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete admin accounts",
      });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: "User deleted successfully",
      data: {
        deletedUserId: userId,
        deletedUserName: userToDelete.name,
        deletedUserEmail: userToDelete.email,
      },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
    });
  }
};

// Get quiz data for admin dashboard
const getQuizData = async (req, res) => {
  try {
    const QuizResult = require("../models/QuizResult");

    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      // Return dummy data when database is not connected
      const dummyQuizData = {
        totalQuizzes: 89,
        guestQuizzes: 45,
        authenticatedQuizzes: 44,
        personalityDistribution: {
          Analyst: 22,
          Creator: 18,
          Helper: 16,
          Leader: 20,
          Explorer: 13,
        },
        recentQuizzes: [
          {
            id: "quiz-001",
            userType: "guest",
            quizType: "mock",
            personalityType: "Analyst",
            completionTime: 180,
            submittedAt: new Date().toISOString(),
            userInfo: null,
          },
          {
            id: "quiz-002",
            userType: "authenticated",
            quizType: "detailed",
            personalityType: "Creator",
            completionTime: 420,
            submittedAt: new Date(Date.now() - 3600000).toISOString(),
            userInfo: {
              name: "John Doe",
              email: "john@example.com",
            },
          },
        ],
        quizStats: {
          averageCompletionTime: 280,
          totalAnswers: 445,
          mostCommonPersonality: "Analyst",
        },
      };

      return res.json({
        success: true,
        data: dummyQuizData,
      });
    }

    // Get quiz statistics from database
    const totalQuizzes = await QuizResult.countDocuments();
    const guestQuizzes = await QuizResult.countDocuments({ userType: "guest" });
    const authenticatedQuizzes = await QuizResult.countDocuments({
      userType: "authenticated",
    });

    // Get personality type distribution
    const personalityDistribution = await QuizResult.aggregate([
      {
        $group: {
          _id: "$personalityType",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          personalityType: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    // Get recent quizzes with user info
    const recentQuizzes = await QuizResult.find()
      .populate("userId", "name email")
      .sort({ submittedAt: -1 })
      .limit(10)
      .select(
        "userType quizType personalityType completionTime submittedAt userId"
      );

    // Calculate quiz statistics
    const quizStats = await QuizResult.aggregate([
      {
        $group: {
          _id: null,
          averageCompletionTime: { $avg: "$completionTime" },
          totalAnswers: { $sum: { $size: "$answers" } },
          mostCommonPersonality: { $first: "$personalityType" },
        },
      },
    ]);

    // Get most common personality type
    const mostCommonPersonalityAgg = await QuizResult.aggregate([
      {
        $group: {
          _id: "$personalityType",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const mostCommonPersonality =
      mostCommonPersonalityAgg.length > 0
        ? mostCommonPersonalityAgg[0]._id
        : "Analyst";

    res.json({
      success: true,
      data: {
        totalQuizzes,
        guestQuizzes,
        authenticatedQuizzes,
        personalityDistribution: personalityDistribution.reduce((acc, item) => {
          acc[item.personalityType] = item.count;
          return acc;
        }, {}),
        recentQuizzes: recentQuizzes.map((quiz) => ({
          id: quiz._id,
          userType: quiz.userType,
          quizType: quiz.quizType,
          personalityType: quiz.personalityType,
          completionTime: quiz.completionTime,
          submittedAt: quiz.submittedAt,
          userInfo: quiz.userId
            ? {
                name: quiz.userId.name,
                email: quiz.userId.email,
              }
            : null,
        })),
        quizStats: {
          averageCompletionTime:
            quizStats.length > 0
              ? Math.round(quizStats[0].averageCompletionTime)
              : 0,
          totalAnswers: quizStats.length > 0 ? quizStats[0].totalAnswers : 0,
          mostCommonPersonality,
        },
      },
    });
  } catch (error) {
    console.error("Get quiz data error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching quiz data",
    });
  }
};

// Create new user (admin only)
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and role are required",
      });
    }

    // Validate role
    const validRoles = ["student", "mentor", "admin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be 'student', 'mentor', or 'admin'",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
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

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  createUser,
  updateUserStatus,
  resetUserPassword,
  deleteUser,
  getQuizData,
};
