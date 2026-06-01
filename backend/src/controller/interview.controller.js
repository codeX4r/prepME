const pdfParse = require("pdf-parse")

const interviewReportModel = require("../model/interviewReport.model.js")
const generateInterviewReport = require("../services/ai.service.js")

const normalizeInterviewReportData = (interviewReportByAi = {}) => {
    const normalizePreparationPlan = (plan) => {
        if (!plan || typeof plan !== "object") {
            return {
                day: undefined,
                focus: undefined,
                task: undefined
            }
        }

        const tasks = Array.isArray(plan.tasks) ? plan.tasks.filter(Boolean) : []

        return {
            day: plan.day,
            focus: plan.focus,
            task: plan.task || tasks.join(", ") || undefined
        }
    }

    return {
        ...interviewReportByAi,
        technicalQuestion: Array.isArray(interviewReportByAi.technicalQuestions)
            ? interviewReportByAi.technicalQuestions
            : [],
        behavioralQuestion: Array.isArray(interviewReportByAi.behavioralQuestions)
            ? interviewReportByAi.behavioralQuestions
            : [],
        skillGap: Array.isArray(interviewReportByAi.skillGaps)
            ? interviewReportByAi.skillGaps
            : [],
        preparationPlan: Array.isArray(interviewReportByAi.preparationPlan)
            ? interviewReportByAi.preparationPlan.map(normalizePreparationPlan)
            : []
    }
}

const validateInterviewRequest = ({ jobDescription, selfDescription }) => {
    if (!jobDescription || typeof jobDescription !== "string" || !jobDescription.trim()) {
        return "Job description is required."
    }
    if (jobDescription.trim().length > 5000) {
        return "Job description must be under 5000 characters."
    }
    if (selfDescription && typeof selfDescription === "string" && selfDescription.trim().length > 1000) {
        return "Self description must be under 1000 characters."
    }
    return ""
}

const reduceSkillSeverity = (currentSeverity) => {
    if (currentSeverity === "high") return "medium"
    if (currentSeverity === "medium") return "low"
    return "low"
}

const normalizeText = (text = "") => {
    return text
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
}

const normalizeToken = (token) => {
    let normalized = token.toLowerCase().replace(/[^a-z0-9]/g, "")
    if (normalized.length > 5 && normalized.endsWith("ing")) {
        normalized = normalized.slice(0, -3)
    }
    if (normalized.length > 4 && (normalized.endsWith("es") || normalized.endsWith("s"))) {
        normalized = normalized.replace(/(es|s)$/, "")
    }
    return normalized
}

const taskMatchesSkill = (taskText, skillText) => {
    const normalizedTask = normalizeText(taskText)
    const normalizedSkill = normalizeText(skillText)
    if (!normalizedSkill) return false
    if (normalizedTask.includes(normalizedSkill)) return true

    const taskWords = normalizedTask.split(" ").filter(Boolean).map(normalizeToken)
    const skillWords = normalizedSkill.split(" ").filter(Boolean).map(normalizeToken)
    if (skillWords.length === 0) return false

    const taskSet = new Set(taskWords)

    if (skillWords.every((word) => taskSet.has(word))) return true

    const matchedWords = skillWords.filter((skillWord) => {
        return taskWords.some((taskWord) => taskWord === skillWord || taskWord.includes(skillWord) || skillWord.includes(taskWord))
    })

    // Require at least half of the skill words to match, with a minimum of 1.
    return matchedWords.length >= Math.max(1, Math.ceil(skillWords.length / 2))
}

const applySkillGapReduction = (planItem, skillGaps) => {
    const combinedText = `${planItem.focus || ""} ${planItem.task || ""}`
    return skillGaps.map((gap) => {
        if (taskMatchesSkill(combinedText, gap.skill)) {
            return {
                ...gap,
                severity: reduceSkillSeverity(gap.severity)
            }
        }
        return gap
    })
}

const generateReportInterviewController = async (req, res) => {
    try {
        const resume = req.file
        const { selfDescription = "", jobDescription = "" } = req.body

        const validationError = validateInterviewRequest({ jobDescription, selfDescription })
        if (validationError) {
            return res.status(400).json({ message: validationError })
        }

        if (!resume) {
            return res.status(400).json({ message: "Resume file is required." })
        }

        if (resume.mimetype !== "application/pdf") {
            return res.status(400).json({ message: "Only PDF resumes are supported on the server." })
        }

        let resumeText
        try {
            const parsed = await pdfParse(resume.buffer)
            resumeText = parsed?.text || ""
        } catch (error) {
            console.error("Resume parsing failed:", error)
            return res.status(400).json({
                message: "Unable to process the resume. Please upload a valid PDF file."
            })
        }

        if (!resumeText.trim()) {
            return res.status(400).json({
                message: "Unable to extract text from the resume. Please upload a valid PDF."
            })
        }

        let interviewReportByAi
        try {
            interviewReportByAi = await generateInterviewReport({
                resume: resumeText,
                selfDescription,
                jobDescription
            })
        } catch (error) {
            console.error("AI report generation failed:", error)
            return res.status(502).json({
                message: "Unable to generate interview report at this time. Please try again later."
            })
        }

        const normalizedInterviewReport = normalizeInterviewReportData(interviewReportByAi)

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...normalizedInterviewReport
        })

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        })
    } catch (error) {
        console.error("generateReportInterviewController error:", error)
        res.status(500).json({ message: "Failed to generate interview report due to server error." })
    }
}

const getInterviewReportById = async function (req, res) {
    try {
        const { interviewId } = req.params

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." })
        }

        return res.status(200).json({
            message: "Report fetched successfully",
            interviewReport
        })
    } catch (error) {
        console.error("getInterviewReportById error:", error)
        res.status(500).json({ message: "Failed to fetch the interview report." })
    }
}

const getAllInterviewReports = async function (req, res) {
    try {
        const interviewReports = await interviewReportModel
            .find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestion -behavioralQuestion -skillGap -preparationPlan")

        return res.status(200).json({ interviewReports })
    } catch (error) {
        console.error("getAllInterviewReports error:", error)
        res.status(500).json({ message: "Failed to fetch interview reports." })
    }
}

const updateRoadmapProgress = async function (req, res) {
    try {
        const { interviewId, day } = req.params
        const { status, completedAt, estimatedTime } = req.body

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found." })
        }

        const planIndex = interviewReport.preparationPlan.findIndex(p => String(p.day) === String(day) || p.day === Number(day))

        if (planIndex === -1) {
            return res.status(404).json({ message: "Roadmap day not found." })
        }

        const currentStatus = interviewReport.preparationPlan[planIndex].status

        // Once a task is completed, it cannot be reverted.
        if (currentStatus === 'completed' && status && status !== 'completed') {
            return res.status(400).json({ message: 'Completed roadmap days cannot be undone.' })
        }

        // Enforce sequential completion: if attempting to mark this day completed,
        // ensure previous day's task (if exists) is completed first.
        if (status === 'completed' && currentStatus !== 'completed') {
            const currentDay = interviewReport.preparationPlan[planIndex].day
            const prev = interviewReport.preparationPlan.find(p => Number(p.day) === Number(currentDay) - 1)
            if (prev && prev.status !== 'completed') {
                return res.status(400).json({ message: 'Complete previous day before marking this day completed.' })
            }
        }

        if (status) interviewReport.preparationPlan[planIndex].status = status
        if (completedAt) interviewReport.preparationPlan[planIndex].completedAt = new Date(completedAt)
        if (typeof estimatedTime !== 'undefined') interviewReport.preparationPlan[planIndex].estimatedTime = estimatedTime

        if (status === 'completed' && currentStatus !== 'completed') {
            interviewReport.skillGap = applySkillGapReduction(interviewReport.preparationPlan[planIndex], interviewReport.skillGap)
        }

        await interviewReport.save()

        return res.status(200).json({ message: "Roadmap progress updated", interviewReport })
    } catch (error) {
        console.error("updateRoadmapProgress error:", error)
        res.status(500).json({ message: "Failed to update roadmap progress." })
    }
}

module.exports = { generateReportInterviewController, getInterviewReportById, getAllInterviewReports, updateRoadmapProgress }
