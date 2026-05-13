const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

console.log("Loaded Model from Env:", process.env.GEMINI_MODEL);

const env = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI || "",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
    GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-1.5-flash",
};

module.exports = env;