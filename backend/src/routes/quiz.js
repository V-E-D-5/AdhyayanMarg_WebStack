const express = require("express");
const router = express.Router();
const {
  getQuizQuestions,
  submitQuiz,
  getQuizResults,
} = require("../controllers/quizController");
const auth = require("../middleware/auth");

// @route   GET /api/quiz/questions
// @desc    Get quiz questions (different for guest vs authenticated users)
// @access  Public (auth middleware handles guest vs authenticated)
router.get("/questions", auth.optional, getQuizQuestions);

// @route   POST /api/quiz
// @desc    Submit quiz results (supports both guest and authenticated users)
// @access  Public (auth middleware handles guest vs authenticated)
router.post("/", auth.optional, submitQuiz);

// @route   GET /api/quiz/results
// @desc    Get quiz results for authenticated user
// @access  Private
router.get("/results", auth.required, getQuizResults);

module.exports = router;
