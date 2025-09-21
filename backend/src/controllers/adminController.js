const User = require("../models/User");
const mongoose = require("mongoose");

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
            action: "completed career quiz",
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

    // Get user statistics from database
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: "admin" });
    const studentUsers = await User.countDocuments({ role: "student" });

    // Get users created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    // Get users created today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: today },
    });

    // Get recent users (last 10)
    const recentUsers = await User.find()
      .select("name email role isActive lastLogin createdAt")
      .sort({ createdAt: -1 })
      .limit(10);

    // Calculate user growth over last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date();
      monthStart.setMonth(monthStart.getMonth() - i);
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthEnd.getMonth() + 1);

      const usersInMonth = await User.countDocuments({
        createdAt: { $gte: monthStart, $lt: monthEnd },
      });

      const activeInMonth = await User.countDocuments({
        lastLogin: { $gte: monthStart, $lt: monthEnd },
        isActive: true,
      });

      monthlyGrowth.push({
        month: monthStart.toLocaleDateString("en-US", { month: "short" }),
        users: usersInMonth,
        active: activeInMonth,
      });
    }

    // Get platform statistics from actual collections
    const QuizResult = require("../models/QuizResult");
    const Roadmap = require("../models/Roadmap");
    const College = require("../models/College");
    const Story = require("../models/Story");
    const Faq = require("../models/Faq");

    const platformStats = {
      totalQuizzes: await QuizResult.countDocuments(),
      totalRoadmaps: await Roadmap.countDocuments(),
      totalColleges: await College.countDocuments(),
      totalStories: await Story.countDocuments(),
      totalFaqs: await Faq.countDocuments(),
    };

    // Get engagement data from user analytics
    const engagementData = await User.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$lastLogin" },
          sessions: { $sum: 1 },
          pageViews: { $sum: "$analytics.totalInteractions" || 0 },
        },
      },
      {
        $project: {
          name: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Sun" },
                { case: { $eq: ["$_id", 2] }, then: "Mon" },
                { case: { $eq: ["$_id", 3] }, then: "Tue" },
                { case: { $eq: ["$_id", 4] }, then: "Wed" },
                { case: { $eq: ["$_id", 5] }, then: "Thu" },
                { case: { $eq: ["$_id", 6] }, then: "Fri" },
                { case: { $eq: ["$_id", 7] }, then: "Sat" },
              ],
              default: "Unknown",
            },
          },
          sessions: 1,
          pageViews: 1,
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get device distribution from user data (if available)
    const deviceData = await User.aggregate([
      {
        $group: {
          _id: "$deviceType",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: { $ifNull: ["$_id", "Unknown"] },
          value: { $multiply: [{ $divide: ["$count", totalUsers] }, 100] },
        },
      },
    ]);

    // Get recent activities from user interactions
    const recentActivities = await User.find({ lastLogin: { $exists: true } })
      .select("name lastLogin analytics")
      .sort({ lastLogin: -1 })
      .limit(5)
      .then((users) =>
        users.map((user, index) => ({
          id: index + 1,
          user: user.name,
          action: "last active",
          time: user.lastLogin
            ? `${Math.floor(
                (new Date() - new Date(user.lastLogin)) / 60000
              )} minutes ago`
            : "Never",
          type: "activity",
        }))
      );

    res.json({
      success: true,
      data: {
        userStats: {
          totalUsers,
          activeUsers,
          adminUsers,
          studentUsers,
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

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getQuizData,
};
