const express = require('express');
const connectDB = require('./lib/db.js');
const formRoutes = require('./routes/formRoutes.js');
const env = require('dotenv').config();
const cors = require('cors');
const responseRoutes = require('./routes/form-responseRoutes.js');
const crons = require('./lib/cron.js');

const app = express();
app.use(express.json());
app.use(cors());



// Form Routes
app.use('/api/forms', formRoutes);


//Response Routes
app.use('/api/form-responses', responseRoutes);

// Start the server
const startServer = async () => {
    try {
        await connectDB();
       
        app.listen(5000, () => {
            console.log('Server is running on port 5000');
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}
startServer();