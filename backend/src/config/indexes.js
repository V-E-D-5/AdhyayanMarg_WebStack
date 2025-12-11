const mongoose = require("mongoose");

// Database indexes for performance optimization
const createIndexes = async () => {
  try {
    console.log("🔍 Creating database indexes for performance...");

    // User collection indexes (check if they exist first)
    try {
      await mongoose.connection.db.collection("users").createIndexes([
        { key: { role: 1 }, name: "role_1" },
        { key: { isActive: 1 }, name: "isActive_1" },
        { key: { createdAt: -1 }, name: "createdAt_-1" },
        { key: { lastLogin: -1 }, name: "lastLogin_-1" },
        { key: { role: 1, isActive: 1 }, name: "role_1_isActive_1" },
        { key: { createdAt: -1, role: 1 }, name: "createdAt_-1_role_1" },
      ]);
    } catch (error) {
      console.log("Some user indexes already exist, skipping...");
    }

    // Quiz results collection indexes
    try {
      await mongoose.connection.db.collection("quizresults").createIndexes([
        { key: { userType: 1 }, name: "userType_1" },
        { key: { personalityType: 1 }, name: "personalityType_1" },
        { key: { submittedAt: -1 }, name: "submittedAt_-1" },
        { key: { userId: 1 }, name: "userId_1" },
      ]);
    } catch (error) {
      console.log("Some quiz indexes already exist, skipping...");
    }

    // Roadmaps collection indexes (skip courseName as it's already unique)
    try {
      await mongoose.connection.db.collection("roadmaps").createIndexes([
        { key: { category: 1 }, name: "category_1" },
        { key: { difficulty: 1 }, name: "difficulty_1" },
      ]);
    } catch (error) {
      console.log("Some roadmap indexes already exist, skipping...");
    }

    // Colleges collection indexes
    try {
      await mongoose.connection.db.collection("colleges").createIndexes([
        { key: { name: 1 }, name: "name_1" },
        { key: { location: 1 }, name: "location_1" },
        { key: { type: 1 }, name: "type_1" },
      ]);
    } catch (error) {
      console.log("Some college indexes already exist, skipping...");
    }

    // Stories collection indexes
    try {
      await mongoose.connection.db.collection("stories").createIndexes([
        { key: { category: 1 }, name: "category_1" },
        { key: { featured: 1 }, name: "featured_1" },
        { key: { createdAt: -1 }, name: "createdAt_-1" },
      ]);
    } catch (error) {
      console.log("Some story indexes already exist, skipping...");
    }

    // FAQ collection indexes
    try {
      await mongoose.connection.db.collection("faqs").createIndexes([
        { key: { category: 1 }, name: "category_1" },
        { key: { helpful: 1 }, name: "helpful_1" },
      ]);
    } catch (error) {
      console.log("Some FAQ indexes already exist, skipping...");
    }

    console.log("✅ Database indexes created successfully");
  } catch (error) {
    console.error("❌ Error creating database indexes:", error);
  }
};

module.exports = { createIndexes };
