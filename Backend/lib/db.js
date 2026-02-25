const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    console.log(process.env.MONGODB_URI,"process.env.MONGODB_URI")
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);

    // Exit process if initial connection fails
    process.exit(1);
  }

  // Handle lost connection after startup
  mongoose.connection.on("disconnected", () => {
    console.error("⚠️ MongoDB disconnected. Attempting to reconnect...");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB error:", err);
  });
};

module.exports = connectDB;

