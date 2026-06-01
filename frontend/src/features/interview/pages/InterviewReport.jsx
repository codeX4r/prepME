import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { UseInterview } from "../hook/useInterview";
import { ReportSkeleton } from "../components/ReportSkeleton";

const severityConfig = {
    high: { color: "text-red-400", bg: "bg-red-400/10 border-red-400/30", dot: "bg-red-400" },
    medium: { color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/30", dot: "bg-amber-400" },
    low: { color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/30", dot: "bg-emerald-400" }
};

function ScoreRing({ score, label = "Match Score", subLabel = "Match", variant = "ring" }) {
    const pct = Math.max(0, Math.min(100, score || 0));
    const normalizedScore = pct;

    const ringColors = normalizedScore >= 80
        ? ["#10b981", "#059669"]
        : normalizedScore >= 50
            ? ["#f59e0b", "#f97316"]
            : ["#ef4444", "#f97316"];

    const linearClass = normalizedScore >= 80
        ? 'from-emerald-500 to-emerald-600'
        : normalizedScore >= 50
            ? 'from-amber-400 to-orange-500'
            : 'from-red-500 to-red-600';

    if (variant === "linear") {
        return (
            <div className="w-full bg-slate-800/20 border border-slate-700/30 rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs text-slate-400 tracking-widest uppercase">{label}</p>
                        <p className="text-sm font-semibold text-slate-100 mt-1">{pct}% {subLabel}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-100">{pct}%</span>
                </div>
                <div className="mt-4 h-3 rounded-full bg-slate-900 overflow-hidden">
                    <div className={`h-full rounded-full bg-linear-to-r ${linearClass} transition-all duration-500`} style={{ width: `${pct}%` }} />
                </div>
            </div>
        );
    }

    const r = 36;
    const circ = 2 * Math.PI * r;
    const offset = circ - (normalizedScore / 100) * circ;
    const gradId = `scoreGrad_${Math.round(normalizedScore)}_${label.replace(/\s+/g, "")}`;

    return (
        <div className="flex flex-row lg:flex-col items-center justify-center gap-3 lg:gap-1 w-full bg-slate-800/20 lg:bg-transparent p-3 lg:p-0 rounded-xl border border-slate-700/30 lg:border-none">
            <svg width="72" height="72" viewBox="0 0 96 96" className="lg:w-24 lg:h-24">
                <circle cx="48" cy="48" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
                <circle
                    cx="48" cy="48" r={r} fill="none"
                    stroke={`url(#${gradId})`} strokeWidth="8"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 48 48)"
                    style={{ transition: "stroke-dashoffset 500ms ease, stroke 300ms" }}
                />
                <defs>
                    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={ringColors[0]} />
                        <stop offset="100%" stopColor={ringColors[1]} />
                    </linearGradient>
                </defs>
                <text x="48" y="53" textAnchor="middle" fill="#e2e8f0" fontSize="18" fontWeight="700" fontFamily="'DM Mono', monospace">{pct}</text>
            </svg>
            <div className="flex flex-col lg:items-center">
                <span className="text-xs text-slate-400 tracking-widest uppercase text-center">{label}</span>
                <span className="text-lg font-bold text-slate-200 lg:hidden">{pct}% {subLabel}</span>
            </div>
        </div>
    );
}


function QuestionCard({ item, index, type }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`rounded-xl border transition-all duration-300 overflow-hidden ${open ? "border-cyan-500/40 bg-slate-800/80" : "border-slate-700/60 bg-slate-800/40 hover:border-slate-600/80"}`}>
            <button
                onClick={() => setOpen(!open)}
                className="w-full text-left p-4 flex items-start gap-3"
            >
                <span className="mt-0.5 shrink-0 w-6 h-6 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs flex items-center justify-center font-bold font-mono">
                    {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 leading-snug wrap-break-word">{item.question}</p>
                    {!open && <p className="text-xs text-slate-500 mt-1 truncate">{item.intention}</p>}
                </div>
                <span className={`shrink-0 ml-2 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
                    ▾
                </span>
            </button>
            {open && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-700/40 pt-3">
                    <div className="rounded-lg bg-blue-500/5 border border-blue-500/20 p-3">
                        <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">Intent</p>
                        <p className="text-xs text-slate-300 leading-relaxed wrap-break-word">{item.intention}</p>
                    </div>
                    <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
                        <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1"> Expected Answer :</p>
                        <p className="text-xs text-slate-300 leading-relaxed wrap-break-word">{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function RoadmapCard({ item, onToggle, isSaving, locked }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`relative rounded-xl border transition-all duration-300 overflow-hidden ${open ? "border-cyan-500/40 bg-slate-800/80" : "border-slate-700/60 bg-slate-800/40 hover:border-slate-600/80"}`}>
            <div onClick={() => setOpen(!open)} role="button" tabIndex={0} className="w-full text-left p-4 flex items-center gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-linear-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex flex-col items-center justify-center">
                    <span className="text-xs text-slate-400 leading-none">Day</span>
                    <span className="text-lg font-bold text-cyan-400 leading-none font-mono">{item.day}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-200 truncate">{item.focus}</p>
                    {!open && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.task}</p>}
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative group">
                        <button type="button" disabled={isSaving || locked || item.status === 'completed'} onClick={(e) => { e.stopPropagation(); onToggle && onToggle(); }} aria-disabled={isSaving || locked || item.status === 'completed'} aria-label={item.status === 'completed' ? 'Completed' : locked ? 'Locked - complete previous day first' : 'Toggle completion'} className={`w-8 h-8 rounded-md flex items-center justify-center border ${item.status === 'completed' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' : 'bg-transparent border-slate-700/30 text-slate-400'} ${locked || item.status === 'completed' ? 'opacity-60 cursor-not-allowed' : ''}`}>
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin border-slate-400" />
                            ) : locked ? (
                                <span className="text-xs">🔒</span>
                            ) : item.status === 'completed' ? '✓' : '○'}
                        </button>
                        {locked && (
                            <div className="absolute right-1 bottom-full mb-2 w-max bg-slate-800 text-xs text-slate-200 px-2 py-1 rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150">
                                Complete previous day first
                            </div>
                        )}
                    </div>
                    <span className={`shrink-0 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>▾</span>
                </div>
            </div>
            {open && (
                <div className="px-4 pb-4 border-t border-slate-700/40 pt-3">
                    <p className="text-xs text-slate-300 leading-relaxed wrap-break-word">{item.task}</p>
                </div>
            )}
        </div>
    );
}

export default function InterviewReport() {
    const { loading, report, getReportById, updateRoadmapProgress } = UseInterview();
    const { interviewId } = useParams();
    const [activeNav, setActiveNav] = useState("technical");
    const [savingDays, setSavingDays] = useState([])

    const handleToggleRoadmap = async (day, currentStatus, locked) => {
        if (!interviewId) return
        if (locked || currentStatus === 'completed') return
        try {
            setSavingDays(prev => [...prev, day])
            await updateRoadmapProgress(interviewId, day, { status: 'completed', completedAt: new Date().toISOString() })
        } catch (error) {
            console.error('Failed to update roadmap progress', error)
        }
        finally {
            setSavingDays(prev => prev.filter(d => String(d) !== String(day)))
        }
    }

    useEffect(() => {
        if (!interviewId) return;
        getReportById(interviewId);
    }, [interviewId]);

    if (loading) {
        return <ReportSkeleton />
    }

    if (!report) {
        return <div className="flex justify-center items-center h-screen text-slate-200">No interview report found</div>;
    }

    const data = report;

    const totalRoadmap = data.preparationPlan?.length || 0;
    const completedRoadmap = (data.preparationPlan || []).filter(p => p.status === 'completed').length || 0;
    const completionPercent = totalRoadmap ? Math.round((completedRoadmap / totalRoadmap) * 100) : 0;

    const NAV_ITEMS = [
        { id: "technical", label: "Technical", fullLabel: "Technical Questions", icon: "⌨️", count: data.technicalQuestion?.length || 0 },
        { id: "behavioral", label: "Behavioral", fullLabel: "Behavioral Questions", icon: "🧠", count: data.behaviourialQuestion?.length || 0 },
        { id: "roadmap", label: "Roadmap", fullLabel: "Road Map", icon: "🗺️", count: data.preparationPlan?.length || 0 }
    ];

    return (
        <div
            className="min-h-screen text-slate-200 font-sans flex flex-col"
            style={{
                background: "linear-gradient(135deg, #0a0f1e 0%, #0d1627 50%, #0a1628 100%)",
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif"
            }}
        >
            {/* Background Blur Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full opacity-8" style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }} />
            </div>

            {/* Mobile Header Banner */}
            <div className="lg:hidden w-full p-4 border-b border-slate-700/40 bg-slate-900/60 backdrop-blur-xl flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-xs font-bold tracking-widest uppercase text-cyan-400">prep-ME</span>
                </div>
            </div>

            {/* Main Layout Grid */}
            <div className="relative flex flex-col lg:flex-row flex-1 lg:h-screen lg:overflow-hidden z-10">

                {/* Left Navigation Sidebar */}
                <aside className="w-full lg:w-56 shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-700/40 bg-slate-900/60 backdrop-blur-xl sticky lg:relative -top-px lg:top-0 z-20">
                    <div className="hidden lg:block p-5 border-b border-slate-700/40">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                            <span className="text-xs font-bold tracking-widest uppercase text-cyan-400">prep-ME</span>
                        </div>
                    </div>

                    {/* Scrollable Navigation Items for Mobile viewports */}
                    <nav className="p-3 lg:p-4 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 lg:space-y-1-scrollbar-none shrink-0 minimal-scrollbar">
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveNav(item.id)}
                                className={`whitespace-nowrap text-left px-3 py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm flex items-center gap-2 lg:gap-3 transition-all duration-200 flex-1 lg:flex-none justify-center lg:justify-start ${activeNav === item.id
                                    ? "bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-medium"
                                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent"
                                    }`}
                            >
                                <span>{item.icon}</span>
                                <span className="hidden sm:inline lg:inline flex-1 font-medium">{item.label}</span>
                                <span className={`text-[10px] lg:text-xs rounded-full px-1.5 py-0.5 font-mono ${activeNav === item.id ? "bg-cyan-500/20 text-cyan-300" : "bg-slate-700/60 text-slate-400"}`}>
                                    {item.count}
                                </span>
                            </button>
                        ))}
                    </nav>

                    <div className="hidden lg:block p-4 border-t border-slate-700/40 mt-auto">
                        <ScoreRing score={data.matchScore || 0} />
                    </div>
                </aside>

                {/* Center Content Section */}
                <main className="flex-1 flex flex-col lg:overflow-hidden min-w-0">
                    <div className="p-4 lg:p-5 border-b border-slate-700/40 bg-slate-900/40 backdrop-blur-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h1 className="text-base lg:text-lg font-bold text-slate-100">
                                {activeNav === "technical" && "Technical Questions"}
                                {activeNav === "behavioral" && "Behavioral Questions"}
                                {activeNav === "roadmap" && "Preparation Road Map"}
                            </h1>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {activeNav === "technical" && "Click any question to reveal model answers"}
                                {activeNav === "behavioral" && "Practice these before your interview"}
                                {activeNav === "roadmap" && "Your 5-day structured study plan"}
                            </p>
                        </div>
                        {/* Render ScoreRing inline dynamically on mobile viewports */}
                        <div className="lg:hidden w-full sm:w-auto">
                            <ScoreRing score={data.matchScore || 0} />
                        </div>
                    </div>

                    <div className="flex-1  overflow-y-auto
                                overscroll-contain
                                minimal-scrollbar
 p-4 lg:p-5 space-y-3 scrollbar-thin">
                        {activeNav === "technical" && data.technicalQuestion?.map((q, i) => (
                            <QuestionCard key={i} item={q} index={i} type="technical" />
                        ))}
                        {activeNav === "behavioral" && data.behaviourialQuestion?.map((q, i) => (
                            <QuestionCard key={i} item={q} index={i} type="behavioral" />
                        ))}
                        {activeNav === "roadmap" && data.preparationPlan?.map((item, i) => {
                            const prev = (data.preparationPlan || []).find(p => Number(p.day) === Number(item.day) - 1)
                            const locked = item.day && Number(item.day) > 1 && prev && prev.status !== 'completed'
                            return (
                                <RoadmapCard
                                    key={i}
                                    item={item}
                                    onToggle={() => handleToggleRoadmap(item.day, item.status, locked)}
                                    isSaving={savingDays.some(d => String(d) === String(item.day))}
                                    locked={locked}
                                />
                            )
                        })}
                    </div>
                </main>

                {/* Right Skill Gaps Sidebar */}
                <aside className="w-full lg:w-64 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-700/40 bg-slate-900/60 backdrop-blur-xl flex flex-col lg:h-full">
                    <div className="p-4 lg:p-5 border-b border-slate-700/40">
                        <h2 className="text-xs font-bold tracking-widest uppercase text-slate-400">Skill Gaps</h2>
                        <p className="text-xs text-slate-600 mt-0.5">Areas to strengthen</p>

                        <div className="mt-3">
                            <ScoreRing score={completionPercent} label="Roadmap Completion" subLabel="Complete" variant="linear" />
                            <p className="text-xs text-slate-500 mt-2">{completedRoadmap} of {totalRoadmap} days completed</p>
                        </div>
                    </div>

                    <div className="max-h-60 lg:max-h-none lg:flex-1 overflow-y-auto p-4 space-y-2.5 minimal-scrollbar">
                        {data.skillGap?.map((gap, i) => {
                            const cfg = severityConfig[gap.severity] || severityConfig.low;
                            return (
                                <div
                                    key={i}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${cfg.bg} transition-all duration-200 hover:scale-[1.01]`}
                                >
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${cfg.dot}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-slate-200 truncate">{gap.skill}</p>
                                        {gap.reduced && (
                                            <span className="inline-flex items-center gap-1 mt-1 text-[5px] font-semibold uppercase tracking-wider text-emerald-200 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                                <span>✔</span> covered
                                            </span>
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${cfg.color}`}>
                                        {gap.severity}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="p-4 border-t border-slate-700/40 flex flex-wrap lg:flex-col gap-x-4 gap-y-1.5 bg-slate-900/40 lg:bg-transparent">
                        <p className="w-full text-xs text-slate-600 uppercase tracking-wider mb-0.5 lg:mb-2">Severity Legend</p>
                        {Object.entries(severityConfig).map(([key, cfg]) => (
                            <div key={key} className="flex items-center gap-2">
                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                <span className={`text-xs capitalize ${cfg.color}`}>{key}</span>
                            </div>
                        ))}
                    </div>
                </aside>

            </div>
        </div>
    );
}