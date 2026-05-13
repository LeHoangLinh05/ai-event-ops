const mongoose = require("mongoose");
const env = require("../config/env.config");

async function connectMongoDB() {
    try {
        await mongoose.connect(env.MONGODB_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Error:", error);
        process.exit(1);
    }
}

module.exports = connectMongoDB;