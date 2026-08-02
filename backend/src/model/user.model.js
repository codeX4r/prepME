const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    provider: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
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
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpiry: Date,
    password: {
        type: String,
        required: function () { return this.provider === "local" }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        required: false
    },
    googleID: {
        type: String,
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    },
    verificationToken: String,
    verificationTokenExpires: Date
});

const userModel = mongoose.model("User", userSchema)
module.exports = userModel