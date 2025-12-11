const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import routes
const quizRoutes = require("./routes/quiz");
const roadmapRoutes = require("./routes/roadmap");
const collegeRoutes = require("./routes/college");
const storyRoutes = require("./routes/story");
const faqRoutes = require("./routes/faq");
const analyticsRoutes = require("./routes/analytics");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const mentorRoutes = require("./routes/mentor");

// Import middleware
const errorHandler = require("./middleware/errorHandler");
const logger = require("./middleware/logger");

// Security middleware
app.use(helmet());

// Rate limiting - DISABLED FOR DEBUGGING
// const limiter = rateLimit({
//   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
//   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
//   message: "Too many requests from this IP, please try again later.",
// });
// app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
app.use(morgan("combined"));
app.use(logger);

// Enhanced health check endpoint with database status
app.get("/health", (req, res) => {
  const dbStatus = dbManager.getStatus();

  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database: {
      status: dbStatus.isConnected ? "connected" : "disconnected",
      readyState: dbStatus.readyState,
      host: dbStatus.host,
      port: dbStatus.port,
      name: dbStatus.name,
      retries: dbStatus.retries,
      healthy: dbManager.isHealthy(),
    },
  });
});

// API routes
app.use("/api/quiz", quizRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/colleges", collegeRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mentor", mentorRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use(errorHandler);

// Enhanced database connection with persistent connection and auto-reconnection
const dbManager = require("./config/database");
const { createIndexes } = require("./config/indexes");

// Start server with enhanced database connection
const startServer = async () => {
  try {
    // Connect to MongoDB with persistent connection
    await dbManager.connect();

    // Create database indexes for performance
    await createIndexes();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(
        `🗄️  Database: ${dbManager.isHealthy() ? "Connected" : "Disconnected"}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    console.log("🔄 Retrying in 5 seconds...");

    // Retry connection after 5 seconds
    setTimeout(() => {
      startServer();
    }, 5000);
  }
};

// Enhanced graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await dbManager.gracefulShutdown();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  await dbManager.gracefulShutdown();
  process.exit(0);
});

startServer().catch(console.error);

module.exports = app;
