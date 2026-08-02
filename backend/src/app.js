const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const helmet = require("helmet")
const app = express()

const authRouter = require("./router/auth.routes.js")
const interviewRouter = require("./router/interview.routes.js")
const emailRouter = require('./router/email.routes.js')

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173"

app.disable("x-powered-by")

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1)
}

app.use(express.json({ limit: "10kb" }))
app.use(helmet())

app.use(
    cors({
        origin: clientOrigin,
        credentials: true
    })
)

app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)
app.use("/api/email", emailRouter)

app.use((req, res) => {
    res.status(404).json({ message: "Route not found." })
})

app.use((err, req, res, next) => {
    console.error("Unhandled server error:", err)
    res.status(err.status || 500).json({ message: "Internal server error." })
})

module.exports = app
