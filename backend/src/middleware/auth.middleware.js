const jwt = require("jsonwebtoken")
const tokenBlackListModel = require("../model/blacklist.model.js")

async function authUser(req, res, next) {
    const acessToken = req.cookies && req.cookies.accessToken

    if (!acessToken) {
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    try {
        const isTokenBlackListed = await tokenBlackListModel.findOne({ token: acessToken })
        if (isTokenBlackListed) {
            return res.status(401).json({ message: "The token is invalid." })
        }

        const decoded = jwt.verify(acessToken,
            process.env.JWT_ACCESS_SECRET
        )
        req.user = decoded
        next()
    } catch (err) {
        console.error("authUser error:", err)
        return res.status(401).json({ message: "Invalid token." })
    }
}

module.exports = authUser
