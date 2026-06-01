import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "",
    withCredentials: true,
})

/**
* @description to create interview report from details by user
*/

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {

    const formData = new FormData()// for sending file

    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("resume", resumeFile)

    const response = await api.post("/api/interview/resume", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data

}


/**
* @description to get interview report
*/

export const getInterviewReportById = async (interviewId) => {

    const response = await api.get(`/api/interview/report/${interviewId}`)

    return response.data

}

export const updateRoadmapProgress = async (interviewId, day, progressData) => {
    const response = await api.patch(`/api/interview/report/${interviewId}/roadmap/${day}`, progressData)
    return response.data
}

/**
* @description to get all interview report of user 
*/

export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")

    return response.data
}