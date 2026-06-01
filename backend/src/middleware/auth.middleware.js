const jwt = require("jsonwebtoken")
const tokenBlackListModel = require("../model/blacklist.model.js")

async function authUser(req, res, next) {
    const token = req.cookies && req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    try {
        const isTokenBlackListed = await tokenBlackListModel.findOne({ token })
        if (isTokenBlackListed) {
            return res.status(401).json({ message: "The token is invalid." })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user = decoded
        next()
    } catch (err) {
        console.error("authUser error:", err)
        return res.status(401).json({ message: "Invalid token." })
    }
}

module.exports = authUser
