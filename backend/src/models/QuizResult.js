const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Not required for guest users
  },
  sessionId: {
    type: String,
    required: false, // For guest users
  },
  userType: {
    type: String,
    enum: ["guest", "authenticated"],
    required: true,
    default: "authenticated",
  },
  quizType: {
    type: String,
    enum: ["mock", "detailed"],
    required: true,
    default: "detailed",
  },
  answers: [
    {
      questionId: {
        type: String,
        required: true,
      },
      question: {
        type: String,
        required: true,
      },
      selectedOption: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
    },
  ],
  scores: {
    technical: { type: Number, default: 0 },
    creative: { type: Number, default: 0 },
    analytical: { type: Number, default: 0 },
    social: { type: Number, default: 0 },
    leadership: { type: Number, default: 0 },
  },
  recommendedCourses: [
    {
      courseName: String,
      matchPercentage: Number,
      description: String,
      careerPaths: [String],
    },
  ],
  personalityType: {
    type: String,
    enum: ["Analyst", "Creator", "Helper", "Leader", "Explorer"],
    required: true,
  },
  strengths: [String],
  areasForImprovement: [String],
  completionTime: {
    type: Number, // in seconds
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  version: {
    type: String,
    default: "1.0",
  },
});

// Index for efficient queries
quizResultSchema.index({ userId: 1, submittedAt: -1 });
quizResultSchema.index({ sessionId: 1, submittedAt: -1 });
quizResultSchema.index({ userType: 1, quizType: 1 });
quizResultSchema.index({ personalityType: 1 });

// Virtual for total score
quizResultSchema.virtual("totalScore").get(function () {
  return Object.values(this.scores).reduce((sum, score) => sum + score, 0);
});

// Ensure virtual fields are serialized
quizResultSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("QuizResult", quizResultSchema);
