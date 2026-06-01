function ErrorRipple() {
    return (
        <span
            className="absolute inset-0 rounded-2xl animate-ping opacity-15"
            style={{ background: "rgba(239,68,68,0.5)", animationDuration: "2s" }}
        />
    );
}

const DEFAULT_SUGGESTIONS = [
    "Check that your job description is at least 100 characters",
    "Ensure your resume or profile description is filled in",
    "Try refreshing the page and submitting again",
];

export default function ErrorScreen({
    code = "500",
    title = "Analysis failed",
    message = "Something went wrong while generating your interview strategy. This might be due to a temporary issue with our AI service.",
    suggestions = DEFAULT_SUGGESTIONS,
    onRetry = () => { },
    onBack = () => { },
}) {
    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{
                background: "linear-gradient(135deg, #0a0f1e 0%, #0d1627 50%, #0a1628 100%)",
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
            }}
        >
            {/* Ambient blobs — red tinted */}
            <div
                className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full opacity-8 pointer-events-none"
                style={{ background: "radial-gradient(circle, #ef4444, transparent 70%)" }}
            />
            <div
                className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full opacity-6 pointer-events-none"
                style={{ background: "radial-gradient(circle, #f97316, transparent 70%)" }}
            />

            {/* Grid overlay */}
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(239,68,68,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.3) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            <div className="relative flex flex-col items-center gap-8 px-8 max-w-md w-full">

                {/* Brand + error icon */}
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="relative w-20 h-20 rounded-2xl flex items-center justify-center"
                        style={{
                            background: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.3)",
                        }}
                    >
                        <ErrorRipple />
                        <span className="text-3xl relative z-10">⚠</span>
                    </div>
                    <span className="text-xs font-bold tracking-widest uppercase text-red-400">prep-ME</span>
                </div>

                {/* Error code badge */}
                <span
                    className="px-3 py-1 rounded-full text-xs font-mono font-bold text-red-400"
                    style={{
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.3)",
                    }}
                >
                    ERROR {code}
                </span>

                {/* Message card */}
                <div
                    className="w-full rounded-2xl p-5"
                    style={{
                        background: "rgba(15,23,42,0.85)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    <h2 className="text-lg font-bold text-slate-100 mb-2">{title}</h2>
                    <p className="text-sm text-slate-400 leading-relaxed mb-4">{message}</p>

                    <div className="border-t pt-4" style={{ borderColor: "rgba(51,65,85,0.5)" }}>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2.5">
                            Possible fixes
                        </p>
                        <ul className="space-y-2">
                            {suggestions.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-slate-400">
                                    <span
                                        className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-amber-400"
                                        style={{
                                            background: "rgba(245,158,11,0.1)",
                                            border: "1px solid rgba(245,158,11,0.3)",
                                            fontSize: "9px",
                                        }}
                                    >
                                        {i + 1}
                                    </span>
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 w-full">
                    <button
                        onClick={onBack}
                        className="flex-1 py-2.5 rounded-xl text-sm font-medium text-slate-400 transition-all duration-200 hover:text-slate-200"
                        style={{
                            background: "rgba(30,41,59,0.8)",
                            border: "1px solid rgba(51,65,85,0.6)",
                        }}
                    >
                        ← Go back
                    </button>
                    <button
                        onClick={onRetry}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold text-slate-900 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                        style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)" }}
                    >
                        ↺ Try again
                    </button>
                </div>

                <p className="text-xs text-slate-600 text-center">
                    If this keeps happening, try again in a few minutes.
                </p>
            </div>
        </div>
    );
}