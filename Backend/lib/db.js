const mongoose = require('mongoose');

// async function connectDB() {
//     if(mongoose.connection.readyState >= 1) {
//         return;
//     }
//    if(!process.env.MONGODB_URI) {
//     throw new Error("MONGODB_URI is not defined in environment variables");
//    }
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("MongoDB Connected Successfully");  

// }
// module.exports = connectDB;



const connectDB = async () => {
  try {
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

