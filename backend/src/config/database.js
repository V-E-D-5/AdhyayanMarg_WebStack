const mongoose = require("mongoose");

// Optimized connection options for Azure Cosmos DB
const connectionOptions = {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  maxIdleTimeMS: 120000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

class DatabaseManager {
  constructor() {
    this.isConnected = false;
    this.connectionRetries = 0;
    this.maxRetries = 10;
    this.retryDelay = 5000; // 5 seconds
    this.reconnectInterval = null;
  }

  async connect() {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("❌ MongoDB URI is required but not provided");
    }

    try {
      console.log("🔄 Attempting to connect to MongoDB...");

      // Set up event listeners before connecting
      this.setupEventListeners();

      // Connect with enhanced options
      await mongoose.connect(mongoUri, connectionOptions);

      this.isConnected = true;
      this.connectionRetries = 0;

      console.log("✅ MongoDB connected successfully");
      console.log(`📊 Database: ${mongoose.connection.name}`);
      console.log(
        `🌐 Host: ${mongoose.connection.host}:${mongoose.connection.port}`
      );

      return true;
    } catch (error) {
      this.isConnected = false;
      console.error("❌ MongoDB connection failed:", error.message);

      // Start reconnection process
      this.startReconnection();

      throw error;
    }
  }

  setupEventListeners() {
    // Connection established
    mongoose.connection.on("connected", () => {
      this.isConnected = true;
      this.connectionRetries = 0;
      console.log("✅ MongoDB connection established");

      // Clear any existing reconnection interval
      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
    });

    // Connection error
    mongoose.connection.on("error", (error) => {
      this.isConnected = false;
      console.error("❌ MongoDB connection error:", error.message);
      this.startReconnection();
    });

    // Connection disconnected
    mongoose.connection.on("disconnected", () => {
      this.isConnected = false;
      console.warn("⚠️ MongoDB disconnected");
      this.startReconnection();
    });

    // Connection reconnected
    mongoose.connection.on("reconnected", () => {
      this.isConnected = true;
      this.connectionRetries = 0;
      console.log("🔄 MongoDB reconnected");

      if (this.reconnectInterval) {
        clearInterval(this.reconnectInterval);
        this.reconnectInterval = null;
      }
    });

    // Process termination
    process.on("SIGINT", this.gracefulShutdown.bind(this));
    process.on("SIGTERM", this.gracefulShutdown.bind(this));
  }

  startReconnection() {
    if (this.reconnectInterval || this.connectionRetries >= this.maxRetries) {
      return;
    }

    console.log(
      `🔄 Starting reconnection process... (Attempt ${
        this.connectionRetries + 1
      }/${this.maxRetries})`
    );

    this.reconnectInterval = setInterval(async () => {
      try {
        this.connectionRetries++;

        if (this.connectionRetries > this.maxRetries) {
          console.error(
            "❌ Maximum reconnection attempts reached. Stopping reconnection."
          );
          clearInterval(this.reconnectInterval);
          this.reconnectInterval = null;
          return;
        }

        console.log(
          `🔄 Reconnection attempt ${this.connectionRetries}/${this.maxRetries}`
        );

        // Try to reconnect
        await mongoose.connect(process.env.MONGODB_URI, connectionOptions);

        // If successful, this will trigger the 'connected' event
        console.log("✅ Reconnection successful");
      } catch (error) {
        console.error(
          `❌ Reconnection attempt ${this.connectionRetries} failed:`,
          error.message
        );

        // Exponential backoff
        const delay = Math.min(
          this.retryDelay * Math.pow(2, this.connectionRetries - 1),
          30000
        );
        console.log(`⏳ Waiting ${delay}ms before next attempt...`);

        setTimeout(() => {
          // Continue with next attempt
        }, delay);
      }
    }, this.retryDelay);
  }

  async gracefulShutdown() {
    console.log("🔄 Gracefully shutting down MongoDB connection...");

    if (this.reconnectInterval) {
      clearInterval(this.reconnectInterval);
    }

    try {
      await mongoose.connection.close();
      console.log("✅ MongoDB connection closed");
    } catch (error) {
      console.error("❌ Error closing MongoDB connection:", error.message);
    }
  }

  // Health check method
  isHealthy() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  // Get connection status
  getStatus() {
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return {
      isConnected: this.isConnected,
      readyState: states[mongoose.connection.readyState],
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      retries: this.connectionRetries,
    };
  }
}

// Create singleton instance
const dbManager = new DatabaseManager();

module.exports = dbManager;
