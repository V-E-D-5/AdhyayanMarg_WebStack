const User = require("../models/User");
const { ensureDbConnection } = require("../utils/database");

// Get all students for a mentor with assignment status
const getStudents = async (req, res) => {
  try {
    ensureDbConnection();

    const mentorId = req.user.id;
    const { page = 1, limit = 10, search = "", filter = "all" } = req.query;

    // Build query based on filter
    let query = {
      role: "student",
      ...(search && {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }),
    };

    // Apply filter for assignment status
    if (filter === "assigned") {
      query.mentorId = { $exists: true, $ne: null };
    } else if (filter === "unassigned") {
      query.$or = [{ mentorId: { $exists: false } }, { mentorId: null }];
    }

    const students = await User.find(query)
      .select("name email role profile analytics lastLogin mentorId")
      .populate("mentorId", "name email")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ lastLogin: -1 });

    const total = await User.countDocuments(query);

    // Add assignment status to each student
    const studentsWithStatus = students.map((student) => ({
      ...student.toObject(),
      isAssigned: !!student.mentorId,
      assignedMentor: student.mentorId
        ? {
            name: student.mentorId.name,
            email: student.mentorId.email,
          }
        : null,
      canAssign:
        !student.mentorId || student.mentorId._id.toString() === mentorId,
    }));

    res.json({
      success: true,
      students: studentsWithStatus,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Assign students to mentor
const assignStudents = async (req, res) => {
  try {
    ensureDbConnection();

    const { studentIds } = req.body;
    const mentorId = req.user.id;

    // Check if students are already assigned to other mentors
    const students = await User.find({
      _id: { $in: studentIds },
      role: "student",
    });
    const alreadyAssigned = students.filter(
      (s) => s.mentorId && s.mentorId.toString() !== mentorId
    );

    if (alreadyAssigned.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Some students are already assigned to other mentors: ${alreadyAssigned
          .map((s) => s.name)
          .join(", ")}`,
      });
    }

    // Update students with mentor assignment
    await User.updateMany(
      { _id: { $in: studentIds }, role: "student" },
      { $set: { mentorId } }
    );

    res.json({
      success: true,
      message: "Students assigned successfully",
    });
  } catch (error) {
    console.error("Assign students error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Unassign students from mentor
const unassignStudents = async (req, res) => {
  try {
    ensureDbConnection();

    const { studentIds } = req.body;
    const mentorId = req.user.id;

    // Only allow unassigning students assigned to this mentor
    await User.updateMany(
      { _id: { $in: studentIds }, role: "student", mentorId },
      { $unset: { mentorId: 1 } }
    );

    res.json({
      success: true,
      message: "Students unassigned successfully",
    });
  } catch (error) {
    console.error("Unassign students error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get mentor's assigned students
const getAssignedStudents = async (req, res) => {
  try {
    ensureDbConnection();

    const mentorId = req.user.id;

    const students = await User.find({ mentorId, role: "student" })
      .select("name email profile analytics lastLogin")
      .sort({ lastLogin: -1 });

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    console.error("Get assigned students error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Send message to students
const sendMessage = async (req, res) => {
  try {
    ensureDbConnection();

    const { studentIds, message, type = "guidance" } = req.body;
    const mentorId = req.user.id;

    // In a real app, you'd save this to a messages collection
    // For now, just log it
    console.log(
      `Mentor ${mentorId} sent ${type} message to students ${studentIds}: ${message}`
    );

    res.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get mentor dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    ensureDbConnection();

    const mentorId = req.user.id;

    // Get assigned students
    const assignedStudents = await User.find({ mentorId, role: "student" });

    // Calculate stats
    const totalStudents = assignedStudents.length;
    const activeStudents = assignedStudents.filter((s) => {
      const lastLogin = new Date(s.lastLogin);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return lastLogin > oneDayAgo;
    }).length;

    const avgProgress =
      assignedStudents.length > 0
        ? Math.round(
            assignedStudents.reduce(
              (acc, s) => acc + (s.analytics?.totalInteractions || 0),
              0
            ) / assignedStudents.length
          )
        : 0;

    const avgAptitude =
      assignedStudents.length > 0
        ? Math.round(
            assignedStudents.reduce(
              (acc, s) => acc + (s.analytics?.achievements || 0),
              0
            ) / assignedStudents.length
          )
        : 0;

    res.json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        avgProgress,
        avgAptitude,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get student aptitude test results
const getStudentAptitudeResults = async (req, res) => {
  try {
    ensureDbConnection();

    const { studentId } = req.params;
    const mentorId = req.user.id;

    // Verify student is assigned to this mentor
    const student = await User.findOne({
      _id: studentId,
      mentorId,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found or not assigned to you",
      });
    }

    // Get aptitude test results from student's analytics
    const aptitudeResults = {
      studentId: student._id,
      studentName: student.name,
      overallScore: student.analytics?.achievements || 0,
      testHistory: student.analytics?.testHistory || [],
      strengths: student.profile?.strengths || [],
      areasForImprovement: student.profile?.areasForImprovement || [],
      lastTestDate: student.analytics?.lastTestDate || null,
    };

    res.json({
      success: true,
      aptitudeResults,
    });
  } catch (error) {
    console.error("Get aptitude results error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get career path recommendations for a student
const getCareerRecommendations = async (req, res) => {
  try {
    ensureDbConnection();

    const { studentId } = req.params;
    const mentorId = req.user.id;

    // Verify student is assigned to this mentor
    const student = await User.findOne({
      _id: studentId,
      mentorId,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found or not assigned to you",
      });
    }

    // Generate career recommendations based on student's profile and analytics
    const recommendations = {
      studentId: student._id,
      studentName: student.name,
      recommendedPaths: [
        {
          path: "Software Engineering",
          matchScore: 85,
          reasoning: "Strong analytical skills and programming interest",
          requirements: [
            "Computer Science degree",
            "Programming skills",
            "Problem-solving ability",
          ],
        },
        {
          path: "Data Science",
          matchScore: 78,
          reasoning: "Good mathematical foundation and analytical thinking",
          requirements: [
            "Statistics knowledge",
            "Programming (Python/R)",
            "Domain expertise",
          ],
        },
        {
          path: "Product Management",
          matchScore: 72,
          reasoning: "Leadership potential and communication skills",
          requirements: [
            "Business acumen",
            "Technical understanding",
            "Communication skills",
          ],
        },
      ],
      currentInterests: student.profile?.interests || [],
      skillGaps: student.profile?.skillGaps || [],
    };

    res.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error("Get career recommendations error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Record guidance session
const recordGuidanceSession = async (req, res) => {
  try {
    ensureDbConnection();

    const { studentId, sessionType, duration, notes, topics } = req.body;
    const mentorId = req.user.id;

    // Verify student is assigned to this mentor
    const student = await User.findOne({
      _id: studentId,
      mentorId,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found or not assigned to you",
      });
    }

    // Create session record
    const sessionRecord = {
      studentId,
      mentorId,
      sessionType,
      duration,
      notes,
      topics,
      date: new Date(),
    };

    // In a real app, you'd save this to a sessions collection
    console.log("Guidance session recorded:", sessionRecord);

    res.json({
      success: true,
      message: "Guidance session recorded successfully",
      sessionId: `session_${Date.now()}`,
    });
  } catch (error) {
    console.error("Record guidance session error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Submit performance feedback
const submitPerformanceFeedback = async (req, res) => {
  try {
    ensureDbConnection();

    const { studentId, feedback, rating, areas, recommendations } = req.body;
    const mentorId = req.user.id;

    // Verify student is assigned to this mentor
    const student = await User.findOne({
      _id: studentId,
      mentorId,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found or not assigned to you",
      });
    }

    // Create feedback record
    const feedbackRecord = {
      studentId,
      mentorId,
      feedback,
      rating,
      areas,
      recommendations,
      date: new Date(),
    };

    // In a real app, you'd save this to a feedback collection
    console.log("Performance feedback submitted:", feedbackRecord);

    res.json({
      success: true,
      message: "Performance feedback submitted successfully",
      feedbackId: `feedback_${Date.now()}`,
    });
  } catch (error) {
    console.error("Submit performance feedback error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get student detailed profile
const getStudentProfile = async (req, res) => {
  try {
    ensureDbConnection();

    const { studentId } = req.params;
    const mentorId = req.user.id;

    // Verify student is assigned to this mentor
    const student = await User.findOne({
      _id: studentId,
      mentorId,
      role: "student",
    }).select("name email profile analytics lastLogin");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found or not assigned to you",
      });
    }

    const studentProfile = {
      ...student.toObject(),
      progress: {
        totalHours: student.analytics?.totalHours || 0,
        completedCourses: student.analytics?.completedCourses || 0,
        appliedInternships: student.analytics?.appliedInternships || 0,
        appliedScholarships: student.analytics?.appliedScholarships || 0,
        achievements: student.analytics?.achievements || 0,
        totalInteractions: student.analytics?.totalInteractions || 0,
      },
      lastActive: student.lastLogin,
    };

    res.json({
      success: true,
      student: studentProfile,
    });
  } catch (error) {
    console.error("Get student profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get mentor's comprehensive analytics
const getMentorAnalytics = async (req, res) => {
  try {
    ensureDbConnection();

    const mentorId = req.user.id;

    // Get all assigned students
    const assignedStudents = await User.find({ mentorId, role: "student" });

    // Calculate comprehensive analytics
    const analytics = {
      overview: {
        totalStudents: assignedStudents.length,
        activeStudents: assignedStudents.filter((s) => {
          const lastLogin = new Date(s.lastLogin);
          const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return lastLogin > oneWeekAgo;
        }).length,
        newStudents: assignedStudents.filter((s) => {
          const created = new Date(s.createdAt);
          const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          return created > oneMonthAgo;
        }).length,
      },
      performance: {
        avgProgress:
          assignedStudents.length > 0
            ? Math.round(
                assignedStudents.reduce(
                  (acc, s) => acc + (s.analytics?.totalHours || 0),
                  0
                ) / assignedStudents.length
              )
            : 0,
        avgInteractions:
          assignedStudents.length > 0
            ? Math.round(
                assignedStudents.reduce(
                  (acc, s) => acc + (s.analytics?.totalInteractions || 0),
                  0
                ) / assignedStudents.length
              )
            : 0,
        topPerformers: assignedStudents
          .sort(
            (a, b) =>
              (b.analytics?.totalHours || 0) - (a.analytics?.totalHours || 0)
          )
          .slice(0, 3)
          .map((s) => ({
            name: s.name,
            hours: s.analytics?.totalHours || 0,
            interactions: s.analytics?.totalInteractions || 0,
          })),
      },
      trends: {
        weeklyActivity: generateWeeklyActivity(assignedStudents),
        monthlyProgress: generateMonthlyProgress(assignedStudents),
      },
      insights: {
        needsAttention: assignedStudents.filter(
          (s) => (s.analytics?.totalHours || 0) < 10
        ).length,
        highPerformers: assignedStudents.filter(
          (s) => (s.analytics?.totalHours || 0) > 50
        ).length,
        engagementRate: calculateEngagementRate(assignedStudents),
      },
    };

    res.json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("Get mentor analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get student progress timeline
const getStudentProgressTimeline = async (req, res) => {
  try {
    ensureDbConnection();

    const { studentId } = req.params;
    const mentorId = req.user.id;

    // Verify student is assigned to this mentor
    const student = await User.findOne({
      _id: studentId,
      mentorId,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found or not assigned to you",
      });
    }

    // Generate progress timeline (mock data for now)
    const timeline = [
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        event: "Completed Python Basics Course",
        type: "achievement",
        description:
          "Student completed the Python programming fundamentals course",
      },
      {
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        event: "Applied for Software Engineering Internship",
        type: "application",
        description: "Applied to 3 software engineering internship positions",
      },
      {
        date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        event: "Career Guidance Session",
        type: "session",
        description: "Discussed career goals and development plan",
      },
    ];

    res.json({
      success: true,
      timeline,
    });
  } catch (error) {
    console.error("Get student progress timeline error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get mentor's session history
const getSessionHistory = async (req, res) => {
  try {
    ensureDbConnection();

    const mentorId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    // Mock session history (in real app, this would come from a sessions collection)
    const sessions = [
      {
        id: "session_1",
        studentId: "student_1",
        studentName: "John Doe",
        sessionType: "Career Guidance",
        duration: 45,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        topics: ["Career Planning", "Skill Development"],
        notes: "Discussed career goals and next steps",
      },
      {
        id: "session_2",
        studentId: "student_2",
        studentName: "Jane Smith",
        sessionType: "Academic Support",
        duration: 30,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        topics: ["Study Strategies", "Time Management"],
        notes: "Helped with study techniques and time management",
      },
    ];

    res.json({
      success: true,
      sessions,
      pagination: {
        current: page,
        pages: 1,
        total: sessions.length,
      },
    });
  } catch (error) {
    console.error("Get session history error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get mentor's messages
const getMessages = async (req, res) => {
  try {
    ensureDbConnection();

    const mentorId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    // Mock messages (in real app, this would come from a messages collection)
    const messages = [
      {
        id: "msg_1",
        studentId: "student_1",
        studentName: "John Doe",
        message:
          "Thank you for the guidance session yesterday. It was very helpful!",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isRead: false,
        type: "student_message",
      },
      {
        id: "msg_2",
        studentId: "student_2",
        studentName: "Jane Smith",
        message: "I have a question about the career path you suggested.",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isRead: true,
        type: "student_message",
      },
    ];

    res.json({
      success: true,
      messages,
      pagination: {
        current: page,
        pages: 1,
        total: messages.length,
      },
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Send message to student
const sendMessageToStudent = async (req, res) => {
  try {
    ensureDbConnection();

    const { studentId, message, type = "guidance" } = req.body;
    const mentorId = req.user.id;

    // Verify student is assigned to this mentor
    const student = await User.findOne({
      _id: studentId,
      mentorId,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found or not assigned to you",
      });
    }

    // In a real app, you'd save this to a messages collection
    console.log(
      `Mentor ${mentorId} sent message to student ${studentId}: ${message}`
    );

    res.json({
      success: true,
      message: "Message sent successfully",
      messageId: `msg_${Date.now()}`,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Helper functions
const generateWeeklyActivity = (students) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((day) => ({
    day,
    activity: Math.floor(Math.random() * 10) + 1,
  }));
};

const generateMonthlyProgress = (students) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return months.map((month) => ({
    month,
    progress: Math.floor(Math.random() * 100) + 1,
  }));
};

const calculateEngagementRate = (students) => {
  if (students.length === 0) return 0;
  const activeStudents = students.filter((s) => {
    const lastLogin = new Date(s.lastLogin);
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return lastLogin > oneWeekAgo;
  }).length;
  return Math.round((activeStudents / students.length) * 100);
};

module.exports = {
  getStudents,
  assignStudents,
  unassignStudents,
  getAssignedStudents,
  sendMessage,
  getDashboardStats,
  getStudentAptitudeResults,
  getCareerRecommendations,
  recordGuidanceSession,
  submitPerformanceFeedback,
  getStudentProfile,
  getMentorAnalytics,
  getStudentProgressTimeline,
  getSessionHistory,
  getMessages,
  sendMessageToStudent,
};
