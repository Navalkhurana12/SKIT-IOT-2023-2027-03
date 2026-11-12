const mongoose = require("mongoose");
require("dotenv").config();

module.exports.MongodbConfig = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log("MongoDB connection failed:", err.message);
        process.exit(1);
    }
};