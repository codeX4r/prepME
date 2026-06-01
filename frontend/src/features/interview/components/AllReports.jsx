import { useEffect } from "react"
import { useNavigate } from "react-router"
import { UseInterview } from "../hook/useInterview"

export const AllReports = () => {

    const { reports, loading, getReports } = UseInterview()
    const navigate = useNavigate()

    useEffect(() => {
        getReports()
    }, [])

    if (loading) {
        return <div className="p-4 text-sm text-slate-300">Loading reports…</div>
    }

    if (!reports?.length) {
        return <div className="p-4 text-sm text-slate-300">No interview reports found yet.</div>
    }

    // matchScore Ring component 
    function MatchRing({ score = 0 }) {
        const r = 22;
        const circ = 2 * Math.PI * r;
        const offset = circ - (score / 100) * circ;

        const color =
            score >= 75 ? "#06b6d4" :
                score >= 50 ? "#f59e0b" :
                    "#ef4444";

        return (
            <div className="shrink-0 flex flex-col items-center gap-1">
                <svg width="56" height="56" viewBox="0 0 56 56">
                    {/* Track */}
                    <circle
                        cx="28" cy="28" r={r}
                        fill="none"
                        stroke="rgba(51,65,85,0.5)"
                        strokeWidth="4"
                    />
                    {/* Progress */}
                    <circle
                        cx="28" cy="28" r={r}
                        fill="none"
                        stroke={color}
                        strokeWidth="4"
                        strokeDasharray={circ}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 28 28)"
                        style={{ transition: "stroke-dashoffset 0.6s ease" }}
                    />
                    {/* Score text */}
                    <text
                        x="28" y="33"
                        textAnchor="middle"
                        fill={color}
                        fontSize="13"
                        fontWeight="700"
                        fontFamily="'DM Mono', monospace"
                    >
                        {score}
                    </text>
                </svg>
                <span className="text-[10px] text-slate-600 tracking-wide">match</span>
            </div>
        );
    }

    return (
        <section className="space-y-4 p-4">
            <h2 className="text-lg font-semibold text-white text-center">Your Reports</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {reports.map((report) => {
                    const title = report.title
                    return (
                        <button
                            key={report._id}
                            type="button"
                            onClick={() => navigate(`/interview/${report._id}`)}
                            className="group text-left rounded-2xl border border-white/10 bg-slate-900/70 p-4 
             transition duration-200 hover:border-cyan-400/50 hover:bg-slate-800/80
             flex items-center gap-4"
                        >
                            {/* Left: text content */}
                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                <p className="font-semibold text-white text-sm leading-snug truncate">{report.title}</p>
                                <p className="text-xs text-slate-500">
                                    {new Date(report.createdAt).toLocaleString("en-IN", {
                                        timeZone: "Asia/Kolkata",
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                                <span className="mt-1 text-[11px] text-cyan-500/60 group-hover:text-cyan-400 transition-colors">
                                    Open report →
                                </span>
                            </div>

                            {/* Right: match score ring */}
                            <MatchRing score={report.matchScore} />
                        </button>
                    )
                })}
            </div>
        </section>
    )

}

