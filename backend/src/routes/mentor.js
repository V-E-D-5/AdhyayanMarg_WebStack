const express = require("express");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const {
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
} = require("../controllers/mentorController");

const router = express.Router();

// Middleware to verify JWT token and check mentor role
const authenticateMentor = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required",
    });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-secret-key",
    (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: "Invalid or expired token",
        });
      }

      // Check if user is a mentor
      if (user.role !== "mentor") {
        return res.status(403).json({
          success: false,
          message: "Access denied. Mentor role required.",
        });
      }

      req.user = user;
      next();
    }
  );
};

// Get all available students
router.get("/students", authenticateMentor, getStudents);

// Get mentor's assigned students
router.get("/assigned-students", authenticateMentor, getAssignedStudents);

// Assign students to mentor
router.post(
  "/assign-students",
  authenticateMentor,
  [
    body("studentIds")
      .isArray({ min: 1 })
      .withMessage("At least one student ID is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
  assignStudents
);

// Unassign students from mentor
router.post(
  "/unassign-students",
  authenticateMentor,
  [
    body("studentIds")
      .isArray({ min: 1 })
      .withMessage("At least one student ID is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
  unassignStudents
);

// Send message to students
router.post(
  "/send-message",
  authenticateMentor,
  [
    body("studentIds")
      .isArray({ min: 1 })
      .withMessage("At least one student ID is required"),
    body("message")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Message is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
  sendMessage
);

// Get mentor dashboard stats
router.get("/dashboard-stats", authenticateMentor, getDashboardStats);

// Get student detailed profile
router.get(
  "/student/:studentId/profile",
  authenticateMentor,
  getStudentProfile
);

// Get student aptitude test results
router.get(
  "/student/:studentId/aptitude",
  authenticateMentor,
  getStudentAptitudeResults
);

// Get career path recommendations for a student
router.get(
  "/student/:studentId/career-recommendations",
  authenticateMentor,
  getCareerRecommendations
);

// Record guidance session
router.post(
  "/guidance-session",
  authenticateMentor,
  [
    body("studentId").notEmpty().withMessage("Student ID is required"),
    body("sessionType").notEmpty().withMessage("Session type is required"),
    body("duration").isNumeric().withMessage("Duration must be a number"),
    body("notes").notEmpty().withMessage("Notes are required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
  recordGuidanceSession
);

// Submit performance feedback
router.post(
  "/performance-feedback",
  authenticateMentor,
  [
    body("studentId").notEmpty().withMessage("Student ID is required"),
    body("feedback").notEmpty().withMessage("Feedback is required"),
    body("rating").isNumeric().withMessage("Rating must be a number"),
    body("areas").isArray().withMessage("Areas must be an array"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
  submitPerformanceFeedback
);

// Get comprehensive mentor analytics
router.get("/analytics", authenticateMentor, getMentorAnalytics);

// Get student progress timeline
router.get(
  "/student/:studentId/timeline",
  authenticateMentor,
  getStudentProgressTimeline
);

// Get mentor's session history
router.get("/sessions", authenticateMentor, getSessionHistory);

// Get mentor's messages
router.get("/messages", authenticateMentor, getMessages);

// Send message to student
router.post(
  "/send-message-to-student",
  authenticateMentor,
  [
    body("studentId").notEmpty().withMessage("Student ID is required"),
    body("message").notEmpty().withMessage("Message is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  },
  sendMessageToStudent
);

module.exports = router;
