const express = require("express");
const emailController = require("../controller/emailController.controller.js")

const emailRouter = express.Router();

emailRouter.get("/verify-email/:token", emailController.verifyEmailToken)

emailRouter.post("/forgot-password", emailController.forgotPassword)

module.exports = emailRouter;