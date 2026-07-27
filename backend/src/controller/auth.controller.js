const userModel = require("../model/user.model.js")
const tokenBlacklistModel = require("../model/blacklist.model.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { OAuth2Client } = require("google-auth-library")
const axios = require("axios")

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
const getJwtSecretKey = () => {
    if (!JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not configured.")
    }
    return JWT_SECRET_KEY
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

async function registerUserController(req, res) {
    try {
        console.log("registerUserController req.body:", req.body);
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

        const token = jwt.sign(
            { id: user._id, username: user.username },
            getJwtSecretKey(),
            { expiresIn: "1d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        })
        res.status(201).json({
            message: "User registered successfully",
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

        const token = jwt.sign(
            { id: user._id, username: user.username },
            getJwtSecretKey(),
            { expiresIn: "1d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        })
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

async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token

        if (token) {
            await tokenBlacklistModel.create({ token })
        }

        res.clearCookie("token")
        res.status(200).json({ message: "user logged out successfully" })
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

        if (googleResponse.verified_email) throw new error("the user is not verified by google")

        let user = await userModel.find({
            email: googleResponse.email
        })



    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    googleLoginController
}