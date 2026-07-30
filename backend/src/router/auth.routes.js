const { Router } = require('express')

const authController = require("../controller/auth.controller.js")

const authRouter = Router()

const authMiddleware = require("../middleware/auth.middleware.js")

authRouter.post("/register", authController.registerUserController)
authRouter.post("/login", authController.loginUserController)
authRouter.post("/logout", authController.logoutUserController)
authRouter.get("/get-me", authMiddleware, authController.getMeController)
authRouter.post("/google", authController.googleLoginController)

module.exports = authRouter