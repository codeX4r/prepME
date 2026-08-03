const crypto = require("crypto");
const userModel = require("../model/user.model.js");

async function verifyEmailToken(req, res) {
    const token = req.params.token;

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    try {
        const user = await userModel.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpiry: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Time limit exceeded, please retry."
            });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpiry = null;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully."
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Error in email verification."
        });
    }
}

async function forgotPassword(req, res) {

}

module.exports = { verifyEmailToken, forgotPassword };