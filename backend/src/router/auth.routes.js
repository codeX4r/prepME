const { Router } = require('express')

const authController = require("../controller/auth.controller.js")

const authRouter = Router()

const authMiddleware = require("../middleware/auth.middleware.js")

authRouter.post("/register", authController.registerUserController)
authRouter.post("/login", authController.loginUserController)
authRouter.get("/logout", authController.logoutUserController)
authRouter.get("/get-me", authMiddleware, authController.getMeController)

module.exports = authRouter