const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.NODE_ENV === 'test' 
    ? process.env.DATABASE_TEST 
    : process.env.DATABASE;

if (!MONGO_URI) {
    console.error("MongoDB URI is missing. Check environment variables.");
    process.exit(1);
}

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 0) { // Prevent multiple connections
            await mongoose.connect(MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log(`Connected to MongoDB: ${MONGO_URI}`);
        }
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
