const mongoose = require("mongoose")

async function connectToDB() {
    const mongoUri = process.env.MONGO_URI
    if (!mongoUri) {
        throw new Error("MONGO_URI is not configured.")
    }

    try {
        await mongoose.connect(mongoUri)
        console.log("Connected to database.")
    } catch (error) {
        console.error("Database connection error:", error)
        throw error
    }
}

module.exports = connectToDB