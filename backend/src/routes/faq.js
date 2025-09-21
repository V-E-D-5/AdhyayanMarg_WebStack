const express = require("express");
const router = express.Router();
const {
  getAllFaqs,
  getFaqById,
  searchFaqs,
  getFaqCategories,
  submitFaqQuery,
  getAIProviders,
  markFaqHelpful,
} = require("../controllers/faqController");

// @route   GET /api/faq
// @desc    Get all FAQs with optional filtering
// @access  Public
router.get("/", getAllFaqs);

// @route   GET /api/faq/categories
// @desc    Get FAQ categories
// @access  Public
router.get("/categories", getFaqCategories);

// @route   GET /api/faq/search
// @desc    Search FAQs
// @access  Public
router.get("/search", searchFaqs);

// @route   POST /api/faq/query
// @desc    Submit FAQ query for chatbot
// @access  Public
router.post("/query", submitFaqQuery);

// @route   GET /api/faq/ai-providers
// @desc    Get available AI providers
// @access  Public
router.get("/ai-providers", getAIProviders);

// @route   GET /api/faq/:id
// @desc    Get FAQ by ID
// @access  Public
router.get("/:id", getFaqById);

// @route   POST /api/faq/:id/helpful
// @desc    Mark FAQ as helpful or not helpful
// @access  Public
router.post("/:id/helpful", markFaqHelpful);

module.exports = router;
