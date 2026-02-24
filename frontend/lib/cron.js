// import cron from "node-cron";
// import  connectDB  from "@/lib/db";
// import Form from "@/models/Form";

// cron.schedule("* * * * *", async () => {
//   console.log("Running cron job every minute to create forms...");  

//   await connectDB();
// //       const count = await Form.countDocuments();
// //   console.log("Forms in DB:", count);

//   const recentForms = await Form.find().sort({ createdAt: -1 }).limit(1);

//   if (recentForms.length > 0) { 
//     console.log("Most recent form:", recentForms[0].name);
//   }
// })