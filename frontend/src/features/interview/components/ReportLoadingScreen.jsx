import { useState, useEffect } from "react";

function SpinnerArc() {
    return (
        <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="22" fill="none" stroke="rgba(51,65,85,0.5)" strokeWidth="3" />
            <circle
                cx="28" cy="28" r="22" fill="none"
                stroke="url(#spinGrad)" strokeWidth="3"
                strokeDasharray="100 38.5"
                strokeLinecap="round"
                transform="rotate(-90 28 28)"
                style={{ animation: "spin 1.2s linear infinite" }}
            />
            <defs>
                <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
            </defs>
            <style>{`@keyframes spin { from { transform: rotate(-90deg); transform-origin: 28px 28px; } to { transform: rotate(270deg); transform-origin: 28px 28px; } }`}</style>
        </svg>
    );
}

function PulseRing() {
    return (
        <span
            className="absolute inset-0 rounded-2xl animate-ping opacity-20"
            style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)", animationDuration: "2s" }}
        />
    );
}

function CheckIcon() {
    return (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function DotPulse() {
    return <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />;
}

function BarLoader() {
    return (
        <div className="flex gap-0.5 items-end h-3">
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="w-0.5 rounded-full bg-cyan-400"
                    style={{ animation: `barBounce 0.9s ease-in-out ${i * 0.15}s infinite alternate`, height: "6px" }}
                />
            ))}
            <style>{`@keyframes barBounce { from { height: 3px; opacity: 0.4; } to { height: 12px; opacity: 1; } }`}</style>
        </div>
    );
}

const STEPS = [
    { icon: "📄", label: "Parsing resume" },
    { icon: "🔍", label: "Scanning job description" },
    { icon: "⚖️", label: "Calculating match score" },
    { icon: "🧠", label: "Generating questions" },
    { icon: "🗺️", label: "Building road map" },
];

export function ReportLoadingScreen({
    message = "Analyzing your profile...",
    subtext = "Generating personalized interview strategy",
}) {
    const [activeStep, setActiveStep] = useState(0);
    const [completedSteps, setCompletedSteps] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCompletedSteps((prev) => [...prev, activeStep]);
            setActiveStep((prev) => (prev + 1) % STEPS.length);
        }, 1100);
        return () => clearInterval(interval);
    }, [activeStep]);

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{
                background: "linear-gradient(135deg, #0a0f1e 0%, #0d1627 50%, #0a1628 100%)",
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            }}
        >
            {/* Ambient blobs */}
            <div
                className="absolute top-[-15%] left-[-10%] w-96 h-96 rounded-full opacity-10 pointer-events-none"
                style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }}
            />
            <div
                className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full opacity-8 pointer-events-none"
                style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }}
            />

            {/* Grid overlay */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            <div className="relative flex flex-col items-center gap-10 px-8 max-w-md w-full">

                {/* Brand */}
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
                        style={{
                            background: "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.2))",
                            border: "1px solid rgba(6,182,212,0.3)",
                        }}
                    >
                        <PulseRing />
                        <span className="text-2xl relative z-10">⚡</span>
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase text-cyan-400">Prep-ME</span>
                </div>

                {/* Spinner + message */}
                <div className="flex flex-col items-center gap-3 text-center">
                    <SpinnerArc />
                    <p className="text-base font-semibold text-slate-200">{message}</p>
                    <p className="text-xs text-slate-500">{subtext}</p>
                </div>

                {/* Step tracker */}
                <div
                    className="w-full rounded-2xl p-4 space-y-2.5"
                    style={{
                        background: "rgba(15,23,42,0.8)",
                        border: "1px solid rgba(51,65,85,0.6)",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    {STEPS.map((step, i) => {
                        const isDone = completedSteps.includes(i);
                        const isActive = activeStep === i && !isDone;
                        return (
                            <div
                                key={i}
                                className="flex items-center gap-3 transition-all duration-500"
                                style={{ opacity: isDone || isActive ? 1 : 0.35 }}
                            >
                                <div
                                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isDone
                                        ? "bg-emerald-500/20 border border-emerald-500/50"
                                        : isActive
                                            ? "bg-cyan-500/20 border border-cyan-500/60"
                                            : "bg-slate-800 border border-slate-700"
                                        }`}
                                >
                                    {isDone ? <CheckIcon /> : isActive ? <DotPulse /> : null}
                                </div>
                                <span className="text-xs">{step.icon}</span>
                                <span
                                    className={`text-xs font-medium flex-1 ${isDone ? "text-emerald-400" : isActive ? "text-cyan-300" : "text-slate-500"
                                        }`}
                                >
                                    {step.label}
                                </span>
                                {isDone && <span className="text-xs text-emerald-500">✓</span>}
                                {isActive && <BarLoader />}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}