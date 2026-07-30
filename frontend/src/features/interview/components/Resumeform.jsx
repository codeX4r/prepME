import { useState, useRef } from "react"
import { useNavigate } from "react-router"
import { UseInterview } from "../hook/useInterview.jsx"
import { ReportLoadingScreen } from "../components/ReportLoadingScreen.jsx"

export const Resumeform = () => {

    const { loading, generateReport } = UseInterview()

    const navigate = useNavigate()

    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeName, setResumeName] = useState("")
    const [resumeFile, setResumeFile] = useState(null)
    const [dragActive, setDragActive] = useState(false)
    const [formError, setFormError] = useState("")

    const resumeInputRef = useRef()

    // =========================================
    // Handle File Upload
    // =========================================

    const handleFileChange = (file) => {

        if (!file) return

        setFormError("")

        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ]

        if (!allowedTypes.includes(file.type)) {
            setFormError("Only PDF, DOC, or DOCX files are allowed.")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            setFormError("File size must be under 5MB.")
            return
        }

        setResumeName(file.name)
        setResumeFile(file)
    }

    // =========================================
    // Generate Interview
    // =========================================

    const handleGeneration = async () => {

        setFormError("")

        if (!jobDescription.trim()) {
            setFormError("Please enter a job description.")
            return
        }

        if (jobDescription.trim().length > 5000) {
            setFormError("Job description must be under 5000 characters.")
            return
        }

        if (!resumeFile) {
            setFormError("Please upload your resume.")
            return
        }

        if (selfDescription.trim().length > 1000) {
            setFormError("Quick self description must be under 1000 characters.")
            return
        }

        try {
            const data = await generateReport({
                jobDescription: jobDescription.trim(),
                selfDescription: selfDescription.trim(),
                resumeFile
            })

            navigate(`/interview/${data._id}`)

        } catch (error) {
            console.error(error)
            setFormError("Failed to generate interview strategy. Please try again.")
        }
    }

    if (loading && resumeFile && jobDescription && selfDescription) {
        return <ReportLoadingScreen />
    }

    return (

        <main className="min-h-screen bg-linear-to-br from-[#06121f] via-[#0b1728] to-[#10233d] flex items-center justify-center px-4 py-10 overflow-hidden">

            {/* =========================================
                Background Glow
            ========================================= */}

            <div className="absolute inset-0 overflow-hidden pointer-events-none ">

                <div className="absolute -top-30 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

                <div className="absolute -bottom-30 -right-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
            </div>

            {/* =========================================
                Main Card
            ========================================= */}

            <div className="relative z-10 w-full max-w-6xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">

                {formError && (
                    <div className="mx-6 mt-6 rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100 shadow-sm sm:mx-10">
                        {formError}
                    </div>
                )}

                {/* =========================================
                    Content Grid
                ========================================= */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-5 sm:p-8 md:p-10">

                    {/* =========================================
                        LEFT SECTION
                    ========================================= */}

                    <div className="flex flex-col">

                        {/* Header */}

                        <div className="flex items-center gap-3 mb-4">

                            <div className="flex items-center gap-2">

                                <div className="h-2.5 w-2.5 rounded-full bg-cyan-400" />

                                <h2 className="text-white font-semibold text-lg">
                                    Target Job Description
                                </h2>
                            </div>

                            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
                                Required
                            </span>
                        </div>

                        {/* Job Description Textarea */}

                        <textarea
                            rows={18}
                            value={jobDescription}
                            placeholder={`Paste the full job description here...

e.g. Senior Frontend Engineer skilled in React, TypeScript, scalable UI architecture, API integrations, performance optimization...`}
                            onChange={(e) => { setJobDescription(e.target.value); setFormError(""); }}
                            className="
                                w-full flex-1

                                resize-none
                                overflow-y-auto
                                overscroll-contain
                                minimal-scrollbar

                                rounded-2xl
                                border border-white/15

                                bg-[#1e293b]/80

                                px-5 py-4

                                text-sm leading-7 text-blue-50

                                placeholder:text-blue-200/35

                                outline-none
                                backdrop-blur-md

                                transition-all duration-300

                                focus:border-cyan-400/40
                                focus:bg-[#243244]/90
                                focus:ring-2
                                focus:ring-cyan-400/20
                            "
                        />

                        {/* Footer Info */}

                        <div className="mt-3 flex items-center justify-between text-xs text-blue-200/50">

                            <p>AI-powered strategy generation</p>

                            <p>
                                {jobDescription.length} / 5000
                            </p>
                        </div>
                    </div>

                    {/* =========================================
                        RIGHT SECTION
                    ========================================= */}

                    <div className="flex flex-col gap-6">

                        {/* Header */}

                        <div className="flex items-center gap-3">

                            <div className="flex items-center gap-2">

                                <div className="h-2.5 w-2.5 rounded-full bg-blue-400" />

                                <h2 className="text-white font-semibold text-lg">
                                    Your Profile
                                </h2>
                            </div>

                            <span className="rounded-full border border-blue-400/20 bg-blue-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-blue-200">
                                Best Results
                            </span>
                        </div>

                        {/* =========================================
                            Upload Resume
                        ========================================= */}

                        <div>

                            <p className="mb-3 text-sm font-medium text-blue-100">
                                Upload Resume
                            </p>

                            <label
                                onDragOver={(e) => {
                                    e.preventDefault()
                                    setDragActive(true)
                                }}
                                onDragLeave={() => {
                                    setDragActive(false)
                                }}
                                onDrop={(e) => {

                                    e.preventDefault()

                                    setDragActive(false)

                                    const file = e.dataTransfer.files[0]

                                    if (file) {

                                        resumeInputRef.current.files =
                                            e.dataTransfer.files

                                        handleFileChange(file)
                                    }
                                }}
                                className={`
                                    group flex cursor-pointer flex-col items-center justify-center

                                    rounded-2xl border border-dashed

                                    px-6 py-12

                                    text-center

                                    transition-all duration-300

                                    ${dragActive
                                        ? "border-cyan-400 bg-cyan-400/10 scale-[1.01]"
                                        : resumeName
                                            ? "border-green-400 bg-green-400/10"
                                            : "border-blue-300/20 bg-white/5 hover:border-cyan-400/40 hover:bg-white/10"
                                    }
                                `}
                            >

                                {/* Upload Icon */}

                                <div className={`
                                    mb-4 rounded-full p-4 border

                                    ${resumeName
                                        ? "border-green-400/30 bg-green-400/10"
                                        : "border-cyan-400/20 bg-cyan-400/10"
                                    }
                                `}>

                                    {resumeName ? (

                                        <svg
                                            className="h-8 w-8 text-green-300"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>

                                    ) : (

                                        <svg
                                            className="h-8 w-8 text-cyan-300"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={1.7}
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 16V4m0 0l-4 4m4-4l4 4M4 16.5v.75A2.75 2.75 0 006.75 20h10.5A2.75 2.75 0 0020 17.25v-.75"
                                            />
                                        </svg>
                                    )}
                                </div>

                                {/* Upload Text */}

                                <p className="text-base font-medium text-blue-50">

                                    {resumeName
                                        ? "Resume Uploaded Successfully"
                                        : "Click to upload or drag & drop"
                                    }
                                </p>

                                {/* File Name */}

                                <p className="mt-2 text-sm text-cyan-200 break-all">

                                    {resumeName || "PDF or DOCX (Max 5MB)"}
                                </p>

                                {/* Hidden Input */}

                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    className="hidden"
                                    ref={resumeInputRef}
                                    onChange={(e) => {
                                        handleFileChange(e.target.files[0])
                                    }}
                                />
                            </label>
                        </div>

                        {/* Divider */}

                        <div className="flex items-center gap-4">

                            <div className="h-px flex-1 bg-white/10" />

                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        {/* =========================================
                            Self Description
                        ========================================= */}

                        <div>

                            <label className="mb-3 block text-sm font-medium text-blue-100">
                                Quick Self Description
                            </label>

                            <textarea
                                rows={5}
                                value={selfDescription}
                                placeholder="Briefly describe your experience, technical skills, projects, strengths, and career goals..."
                                onChange={(e) => { setSelfDescription(e.target.value); setFormError(""); }}
                                className="
                                    w-full

                                    resize-none
                                    overflow-y-auto
                                    overscroll-contain
                                    minimal-scrollbar

                                    rounded-2xl
                                    border border-white/15

                                    bg-[#1e293b]/80

                                    px-5 py-4

                                    text-sm leading-7 text-blue-50

                                    placeholder:text-blue-200/35

                                    outline-none
                                    backdrop-blur-md

                                    transition-all duration-300

                                    focus:border-cyan-400/40
                                    focus:bg-[#243244]/90
                                    focus:ring-2
                                    focus:ring-cyan-400/20
                                "
                            />
                        </div>

                        {/* Quote Box */}

                        <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/10 px-4 py-4 text-sm text-cyan-100 text-center">
                            “Turn ambition into preparation and preparation into offers.”
                        </div>
                    </div>
                </div>

                {/* =========================================
                    Footer
                ========================================= */}

                <div className="flex flex-col gap-4 border-t border-white/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">

                    <p className="text-xs text-blue-200/40">
                        Built for modern interview preparation workflows.
                    </p>

                    <button
                        disabled={loading}
                        onClick={handleGeneration}
                        className={`
                            rounded-2xl

                            px-7 py-3

                            text-sm font-semibold text-white

                            shadow-lg

                            transition-all duration-300

                            active:scale-95

                            ${loading
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-linear-to-r from-cyan-500 to-blue-600 shadow-cyan-500/20 hover:scale-[1.02] hover:shadow-cyan-500/40"
                            }
                        `}
                    >

                        {loading
                            ? "Generating..."
                            : "Generate Interview Strategy"
                        }
                    </button>
                </div>
            </div>
        </main>
    )
}