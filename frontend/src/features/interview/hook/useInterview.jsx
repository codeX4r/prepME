import { useContext } from "react"

import { generateInterviewReport, getInterviewReportById, getAllInterviewReports, updateRoadmapProgress as apiUpdateRoadmapProgress } from "../services/interview.api.js"

import { interviewContext } from "../context/interview.context.jsx"

const normalizeText = (text = "") => {
    return text
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
}

const taskMatchesSkill = (taskText, skillText) => {
    const normalizedTask = normalizeText(taskText)
    const normalizedSkill = normalizeText(skillText)
    if (!normalizedSkill) return false
    if (normalizedTask.includes(normalizedSkill)) return true

    const taskWords = new Set(normalizedTask.split(" ").filter(Boolean))
    const skillWords = normalizedSkill.split(" ").filter(Boolean)
    if (skillWords.length === 0) return false

    if (skillWords.every((word) => taskWords.has(word))) return true

    if (skillWords.some((skillWord) => Array.from(taskWords).some((taskWord) => taskWord.includes(skillWord) || skillWord.includes(taskWord)))) {
        return true
    }

    return normalizedTask.includes(normalizedSkill)
}

const reduceSkillSeverity = (currentSeverity) => {
    if (currentSeverity === "high") return "medium"
    if (currentSeverity === "medium") return "low"
    return "low"
}

const applySkillGapReduction = (planItem, skillGaps) => {
    const combinedText = `${planItem.focus || ""} ${planItem.task || ""}`
    return (skillGaps || []).map((gap) => {
        if (taskMatchesSkill(combinedText, gap.skill)) {
            return { ...gap, severity: reduceSkillSeverity(gap.severity) }
        }
        return gap
    })
}

const severityOrder = { high: 3, medium: 2, low: 1 }

const markReducedSkillGaps = (oldGaps = [], newGaps = []) => {
    const oldMap = new Map(oldGaps.map(gap => [normalizeText(gap.skill), gap.severity]))
    return (newGaps || []).map((gap) => {
        const oldSeverity = oldMap.get(normalizeText(gap.skill))
        const isReduced = oldSeverity && severityOrder[gap.severity] < severityOrder[oldSeverity]
        return { ...gap, reduced: isReduced }
    })
}

export const UseInterview = () => {

    const context = useContext(interviewContext)

    if (!context) {
        throw new Error("useInterview must be used within an interviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context;

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {

        setLoading(true)

        try {

            const response = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile
            })

            // console.log("HOOK RESPONSE:", response)

            setReport(response.interviewReport)

            return response.interviewReport

        } catch (error) {

            console.log(error)

            throw error

        } finally {

            setLoading(false)
        }
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        try {
            const response = await getInterviewReportById(interviewId)
            setReport(response.interviewReport)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const getReports = async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports()
            setReports(response.interviewReports)

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const updateRoadmapProgress = async (interviewId, day, progressData) => {
        // optimistic update: update local report state immediately to avoid UI flicker
        const previous = report
        try {
            const updated = { ...report }
            updated.preparationPlan = (updated.preparationPlan || []).map(p => {
                if (String(p.day) === String(day) || p.day === Number(day)) {
                    return { ...p, ...progressData }
                }
                return p
            })
            if (progressData.status === 'completed') {
                const completedPlan = updated.preparationPlan.find(p => String(p.day) === String(day) || p.day === Number(day))
                updated.skillGap = applySkillGapReduction(completedPlan, updated.skillGap)
                updated.skillGap = markReducedSkillGaps(previous.skillGap, updated.skillGap)
            }
            setReport(updated)

            const response = await apiUpdateRoadmapProgress(interviewId, day, progressData)
            if (response && response.interviewReport) {
                const updatedResponseReport = { ...response.interviewReport }
                updatedResponseReport.skillGap = markReducedSkillGaps(previous.skillGap, updatedResponseReport.skillGap)
                setReport(updatedResponseReport)
            }
            return response.interviewReport
        } catch (error) {
            console.log(error)
            // revert optimistic change
            setReport(previous)
            throw error
        }
    }

    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports
        , updateRoadmapProgress
    }
}