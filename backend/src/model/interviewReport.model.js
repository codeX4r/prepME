const mongoose = require("mongoose")

const skillGapSchema = new mongoose.Schema(
    {
        skill: {
            type: String,
            required: [true, "skill is required"]
        },
        severity: {
            type: String,
            enum: ["low", "medium", "high"],
            required: [true, "severity is required"]
        }
    },
    {
        _id: false
    }
)

const technicalQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "technical question is required"]
        },
        intention: {
            type: String,
            required: [true, "intention is required"]
        },
        answer: {
            type: String,
            required: [true, "answer is required"]
        }
    },
    {
        _id: false
    }
)

const behavioralQuestionSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: [true, "behavioral question is required"]
        },
        intention: {
            type: String,
            required: [true, "intention is required"]
        },
        answer: {
            type: String,
            required: [true, "answer is required"]
        }
    },
    {
        _id: false
    }
)

const preparationPlanSchema = new mongoose.Schema(
    {
        day: {
            type: Number,
            required: [true, "day is required"]
        },
        focus: {
            type: String,
            required: [true, "focus is required"]
        },
        task: {
            type: String,
            required: [true, "task is required"]
        }
    },
    {
        _id: false
    }
)

// Extend preparation plan with progress tracking
preparationPlanSchema.add({
    status: {
        type: String,
        enum: ["not-started", "in-progress", "completed"],
        default: "not-started"
    },
    completedAt: {
        type: Date
    },
    estimatedTime: {
        type: Number // minutes, optional
    }
})

const interviewReportSchema = new mongoose.Schema(
    {
        jobDescription: {
            type: String,
            required: [true, "job description is required"]
        },
        resume: {
            type: String
        },
        selfDescription: {
            type: String
        },
        matchScore: {
            type: Number,
            min: 0,
            max: 100
        },
        technicalQuestion: [technicalQuestionSchema],
        behavioralQuestion: [behavioralQuestionSchema],
        skillGap: [skillGapSchema],
        preparationPlan: [preparationPlanSchema],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        title: {
            type: String,
            required: [true, "job title is required"]
        }
    },
    {
        timestamps: true
    }
)

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema)

module.exports = interviewReportModel
