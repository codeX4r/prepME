const userModel = require("../model/user.model.js")
const tokenBlacklistModel = require("../model/blacklist.model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library")
const axios = require("axios")
const crypto = require("crypto")

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET

const { sendEmail } = require("../services/email.service.js")


const getJwtSecretKey = () => {
    if (!JWT_ACCESS_SECRET) {
        const { BrevoClient } = require("@getbrevo/brevo")

        throw new Error("JWT_ACCESS_SECRET is not configured.")
    }
    return JWT_ACCESS_SECRET
}

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    // process.env.GOOGLE_REDIRECT_URI
)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const isValidEmail = (value) => typeof value === "string" && emailRegex.test(value.trim())

const validateRegisterData = ({ username, email, password }) => {
    if (!username || typeof username !== "string" || !username.trim()) return "Username is required."
    const trimmedUsername = username.trim()
    if (trimmedUsername.length < 3) return "Username must be at least 3 characters."
    if (!email || typeof email !== "string" || !email.trim()) return "Email is required."
    if (!isValidEmail(email)) return "Please enter a valid email address."
    if (!password || typeof password !== "string") return "Password is required."
    if (password.length < 8) return "Password must be at least 8 characters."
    return ""
}

const validateLoginData = ({ email, password }) => {
    if (!email || typeof email !== "string" || !email.trim()) return "Email is required."
    if (!isValidEmail(email)) return "Please enter a valid email address."
    if (!password || typeof password !== "string") return "Password is required."
    return ""
}

function generateAccessToken(user) {
    return jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        getJwtSecretKey(),
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRY
        }
    )
}

function generateRefreshToken(user) {
    return jwt.sign(
        {
            id: user._id
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRY
        }
    )
}

function sendToken(res, name, token, maxAge) {
    res.cookie(name, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge
    })
}

async function registerUserController(req, res) {
    try {
        // console.log("registerUserController req.body:", req.body)
        const { username, email, password } = req.body;
        const validationError = validateRegisterData({ username, email, password })
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            })
        }

        const trimmedUsername = username.trim()
        const trimmedEmail = email.trim().toLowerCase()

        const existingUserByEmail = await userModel.findOne({ email: trimmedEmail })
        if (existingUserByEmail) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered."
            })
        }

        const existingUserByUsername = await userModel.findOne({ username: trimmedUsername })
        if (existingUserByUsername) {
            return res.status(409).json({
                success: false,
                message: "Username is already taken."
            })
        }

        const hash = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            username: trimmedUsername,
            email: trimmedEmail,
            password: hash
        })

        const accessToken = generateAccessToken(user)
        sendToken(res, "accessToken", accessToken, 15 * 60 * 1000)

        // email verification token
        const emailVerificationToken = crypto.randomBytes(32).toString("hex")
        const hashedToken = crypto.createHash("sha256").update(emailVerificationToken).digest("hex")
        user.emailVerificationToken = hashedToken
        user.emailVerificationExpiry = new Date(Date.now() + 15 * 60 * 1000)
        await user.save()

        const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${emailVerificationToken}`

        const subject = "Verify your email"

        console.log("Verification URL:", verificationUrl);

        await sendEmail({ to: email, subject, url: verificationUrl })

        console.log("Email sent successfully");

        res.status(201).json({
            message: "User registered successfully, Please Verify your email",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("registerUserController error:", error)
        res.status(500).json({ success: false, message: "Registration failed due to server error." })
    }
}

async function loginUserController(req, res) {
    try {
        const { email, password } = req.body
        const validationError = validateLoginData({ email, password })
        if (validationError) {
            return res.status(400).json({ message: validationError })
        }

        const trimmedEmail = email.trim().toLowerCase()
        const user = await userModel.findOne({ email: trimmedEmail })
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password."
            })
        }

        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        user.refreshToken = refreshToken
        await user.save()

        sendToken(res, "accessToken", accessToken, 15 * 60 * 1000)
        sendToken(res, "refreshToken", refreshToken, 24 * 60 * 60 * 1000)

        res.status(200).json({
            message: "user logged in ",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("loginUserController error:", error)
        res.status(500).json({ message: "Login failed due to server error." })
    }
}

async function googleLoginController(req, res) {
    try {
        const { code } = req.body;

        // received tokens from the access code received

        const { tokens } = await client.getToken({
            code,
            redirect_uri: "postmessage",
        });

        //getting profile from google using access tokens received
        const googleResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokens.access_token}`, }
        })
        console.log(googleResponse.data)
        const googleUser = googleResponse.data
        if (!googleUser.verified_email) throw new Error("the user is not verified by google")

        let user = await userModel.findOne({
            email: googleUser.email
        })

        try {
            if (!user) {
                user = await userModel.create({
                    provider: "google",
                    email: googleUser.email,
                    avatar: googleUser.picture,
                    googleID: googleUser.id,
                    isVerified: true,
                    password: null,
                    isEmailVerified: true,
                    username: googleUser.email.split("@")[0].toLowerCase()
                })
            }

            const accessToken = generateAccessToken(user)
            const refreshToken = generateRefreshToken(user)

            user.refreshToken = refreshToken
            await user.save()
            sendToken(res, "accessToken", accessToken, 15 * 60 * 1000)
            sendToken(res, "refreshToken", refreshToken, 24 * 60 * 60 * 1000)

            return res.status(200).json({
                message: "Google Login Successfull",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            })

        } catch (error) {
            console.log(error);
        }



    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

async function logoutUserController(req, res) {
    try {
        const token = req.cookies.accessToken

        if (token) {
            await tokenBlacklistModel.findOneAndUpdate(
                { token },
                { token },
                { upsert: true }
            )
        }

        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        })
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        })

        // user.refreshToken = null;
        // await user.save();

        res.status(200).json({
            success: true,
            message: "user logged out successfully"
        })
    } catch (error) {
        console.error("logoutUserController error:", error)
        res.status(500).json({ message: "Logout failed due to server error." })
    }
}

async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }

        res.status(200).json({
            message: "user details fetched successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error("getMeController error:", error)
        res.status(500).json({ message: "Failed to fetch user details." })
    }
}

async function refreshTokenController(req, res) {

    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        return res.status(401).json({
            message: "RefreshToken is missing"
        })
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

        const user = await userModel.findById(decoded.id)

        if (!user) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        if (user.refreshToken !== refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
        }

        const accessToken = generateAccessToken(user)

        sendToken(res, "accessToken", accessToken, 15 * 60 * 1000)

        return res.status(200).json({ sucess: true, message: "acessesToken refreshed sucessfully" })

    } catch (error) {
        return res.status(401).json({ success: false, message: "invalid response or refreshToken expired" })
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    googleLoginController,
    refreshTokenController
}