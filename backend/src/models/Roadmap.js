const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Engineering",
      "Medicine",
      "Arts",
      "Commerce",
      "Science",
      "Technology",
      "Design",
      "Management",
    ],
  },
  duration: {
    type: String,
    required: true, // e.g., "4 years", "2 years", "6 months"
  },
  difficulty: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Intermediate",
  },
  prerequisites: [String],
  careerPaths: [
    {
      title: String,
      description: String,
      salaryRange: String,
      growthProspect: String,
    },
  ],
  timeline: [
    {
      phase: {
        type: String,
        required: true,
      },
      duration: String,
      milestones: [
        {
          title: String,
          description: String,
          resources: [String],
          completed: { type: Boolean, default: false },
        },
      ],
      skills: [String],
    },
  ],
  resources: {
    books: [String],
    onlineCourses: [String],
    certifications: [String],
    tools: [String],
  },
  institutions: [
    {
      name: String,
      location: String,
      ranking: Number,
      fees: String,
      admissionProcess: String,
    },
  ],
  marketDemand: {
    current: {
      type: String,
      enum: ["Low", "Medium", "High", "Very High"],
      default: "Medium",
    },
    future: {
      type: String,
      enum: ["Declining", "Stable", "Growing", "Booming"],
      default: "Stable",
    },
    salaryRange: {
      entry: String,
      mid: String,
      senior: String,
    },
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for efficient queries (courseName index already created by unique: true)
roadmapSchema.index({ category: 1 });
roadmapSchema.index({ tags: 1 });
roadmapSchema.index({ "marketDemand.current": 1 });

// Update timestamp on save
roadmapSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Roadmap", roadmapSchema);
