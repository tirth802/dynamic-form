const cron = require("node-cron");

const Form = require("../models/Form");

cron.schedule("* * * * *", async () => {
  console.log("Running cron job every minute to create forms...");  

  

  const recentForms = await Form.find().sort({ createdAt: -1 }).limit(1);

  if (recentForms.length > 0) { 
    console.log("Most recent form:", recentForms[0].name);
  }
})