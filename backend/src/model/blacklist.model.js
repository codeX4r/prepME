const mongoose = require("mongoose")

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: "7d",
    },
});

const tokenBlacklistModel = mongoose.model("BlackListTokens", blacklistTokenSchema)

module.exports = tokenBlacklistModel;