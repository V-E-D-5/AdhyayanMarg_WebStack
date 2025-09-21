const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["student", "admin", "counselor"],
    default: "student",
  },
  profile: {
    age: Number,
    grade: String,
    interests: [String],
    location: String,
    phone: String,
  },
  quizResults: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizResult",
    },
  ],
  preferences: {
    language: {
      type: String,
      enum: ["en", "hi"],
      default: "en",
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  lastLogin: Date,
  analytics: {
    totalInteractions: { type: Number, default: 0 },
    completedCourses: { type: Number, default: 0 },
    appliedInternships: { type: Number, default: 0 },
    appliedScholarships: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
    achievements: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
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

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update timestamp on save
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model("User", userSchema);
