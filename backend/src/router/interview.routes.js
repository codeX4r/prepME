const express = require("express")

const authUser = require("../middleware/auth.middleware.js")
const uploadResume = require("../middleware/file.middleware.js")

const interviewController = require("../controller/interview.controller.js")


const interviewRouter = express.Router()

/**
 * @route POST/api/resume
 * @description generate new interview report on the basis of user self description, resume pdf & job description
 * @access private 
 */
interviewRouter.post("/resume", authUser, uploadResume.single("resume"), interviewController.generateReportInterviewController)

/**
 * @route GET /api/interview/report/:interviewId
 * @description get interview report by interview id
 * @access private
 */
interviewRouter.get('/report/:interviewId', authUser, interviewController.getInterviewReportById)

/**
 * @route GET /api/interview
 * @description get all interview reports of loggedIn user
 * @access private
 */
interviewRouter.get("/", authUser, interviewController.getAllInterviewReports)

/**
 * @route PATCH /api/interview/report/:interviewId/roadmap/:day
 * @description update roadmap task progress for a given day
 * @access private
 */
interviewRouter.patch('/report/:interviewId/roadmap/:day', authUser, interviewController.updateRoadmapProgress)

module.exports = interviewRouter