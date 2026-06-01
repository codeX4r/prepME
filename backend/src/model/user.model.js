const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "username already taken"],
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: [true, "Account already taken"],
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
})

const userModel = mongoose.model("User", userSchema)
module.exports = userModel