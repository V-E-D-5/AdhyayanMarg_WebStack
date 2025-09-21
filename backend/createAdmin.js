const mongoose = require("mongoose");
const User = require("./src/models/User");
const bcrypt = require("bcryptjs");

// Connect to MongoDB (or use dummy mode)
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/career-guidance"
    );
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.log("❌ MongoDB connection error:", error.message);
    console.log(
      "⚠️  Running in dummy mode - admin will be created in memory only"
    );
  }
};

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("✅ Admin user already exists:", existingAdmin.email);
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: "System Administrator",
      email: "admin@adhyayanmarg.com",
      password: "admin123", // This will be hashed by the pre-save hook
      role: "admin",
      isActive: true,
      isVerified: true,
      analytics: {
        totalInteractions: 0,
        completedCourses: 0,
        appliedInternships: 0,
        appliedScholarships: 0,
        totalHours: 0,
        achievements: 0,
        lastUpdated: new Date(),
      },
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@adhyayanmarg.com");
    console.log("🔑 Password: admin123");
    console.log("⚠️  Please change the password after first login!");
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
  }
};

const main = async () => {
  await connectDB();
  await createAdminUser();
  process.exit(0);
};

main();

