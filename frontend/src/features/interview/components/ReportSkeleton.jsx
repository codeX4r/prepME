/* ─── Shimmer keyframe injected once ────────────────────────────────────── */
const shimmerStyle = `
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  .skeleton {
    background: linear-gradient(
      90deg,
      rgba(30,41,59,0.8)   0%,
      rgba(51,65,85,0.6)  40%,
      rgba(71,85,105,0.4) 50%,
      rgba(51,65,85,0.6)  60%,
      rgba(30,41,59,0.8) 100%
    );
    background-size: 600px 100%;
    animation: shimmer 1.6s infinite linear;
    border-radius: 6px;
  }
`;

/* ─── Primitive ──────────────────────────────────────────────────────────── */
function Bone({ className = "", style = {} }) {
    return <div className={`skeleton ${className}`} style={style} />;
}

/* ─── Left Sidebar skeleton ──────────────────────────────────────────────── */
function SidebarSkeleton() {
    return (
        <aside
            className="w-56 shrink-0 flex flex-col border-r"
            style={{ borderColor: "rgba(51,65,85,0.4)", background: "rgba(10,15,30,0.7)" }}
        >
            {/* Brand */}
            <div className="p-5 border-b flex items-center gap-2" style={{ borderColor: "rgba(51,65,85,0.4)" }}>
                <Bone className="w-2 h-2 rounded-full" />
                <Bone className="h-3 w-24" />
            </div>

            {/* Nav items */}
            <nav className="flex-1 p-4 space-y-2">
                {[true, false, false].map((active, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
                        style={{
                            background: active ? "rgba(6,182,212,0.08)" : "transparent",
                            border: active ? "1px solid rgba(6,182,212,0.2)" : "1px solid transparent",
                        }}
                    >
                        <Bone className="w-4 h-4 rounded" />
                        <Bone className="flex-1 h-3" />
                        <Bone className="w-5 h-4 rounded-full" />
                    </div>
                ))}
            </nav>

            {/* Match score ring */}
            <div className="p-4 border-t flex flex-col items-center gap-2" style={{ borderColor: "rgba(51,65,85,0.4)" }}>
                <Bone className="w-24 h-24 rounded-full" style={{ borderRadius: "9999px" }} />
                <Bone className="h-2.5 w-20" />
            </div>
        </aside>
    );
}

/* ─── Question card skeleton ─────────────────────────────────────────────── */
function QuestionCardSkeleton({ index }) {
    return (
        <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{
                background: "rgba(15,23,42,0.6)",
                border: "1px solid rgba(51,65,85,0.5)",
            }}
        >
            {/* Number badge */}
            <Bone
                className="shrink-0 w-6 h-6 rounded-md"
                style={{ animationDelay: `${index * 0.08}s` }}
            />

            {/* Text lines */}
            <div className="flex-1 space-y-2 pt-0.5">
                <Bone className="h-3.5 w-full" style={{ animationDelay: `${index * 0.08 + 0.05}s` }} />
                <Bone className="h-3.5 w-4/5" style={{ animationDelay: `${index * 0.08 + 0.1}s` }} />
                <Bone className="h-2.5 w-2/3 mt-1" style={{ animationDelay: `${index * 0.08 + 0.15}s`, opacity: 0.6 }} />
            </div>

            {/* Chevron */}
            <Bone className="shrink-0 w-4 h-4 rounded mt-0.5" style={{ animationDelay: `${index * 0.08 + 0.2}s` }} />
        </div>
    );
}

/* ─── Center panel skeleton ──────────────────────────────────────────────── */
function MainPanelSkeleton() {
    return (
        <main className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div
                className="p-5 border-b flex items-center gap-3"
                style={{ borderColor: "rgba(51,65,85,0.4)", background: "rgba(10,15,30,0.5)" }}
            >
                <div className="space-y-2">
                    <Bone className="h-4 w-44" />
                    <Bone className="h-2.5 w-64" style={{ opacity: 0.6 }} />
                </div>
            </div>

            {/* Question cards */}
            <div className="flex-1 p-5 space-y-3 overflow-hidden">
                {[0, 1, 2].map((i) => (
                    <QuestionCardSkeleton key={i} index={i} />
                ))}
            </div>
        </main>
    );
}

/* ─── Skill gap row skeleton ─────────────────────────────────────────────── */
function SkillGapRowSkeleton({ index }) {
    return (
        <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{
                background: "rgba(30,41,59,0.5)",
                border: "1px solid rgba(51,65,85,0.4)",
                animationDelay: `${index * 0.06}s`,
            }}
        >
            <Bone className="w-2 h-2 rounded-full shrink-0" style={{ animationDelay: `${index * 0.06}s` }} />
            <Bone className="flex-1 h-3" style={{ animationDelay: `${index * 0.06 + 0.05}s` }} />
            <Bone className="w-8 h-3 rounded" style={{ animationDelay: `${index * 0.06 + 0.1}s` }} />
        </div>
    );
}

/* ─── Right Sidebar skeleton ─────────────────────────────────────────────── */
function RightSidebarSkeleton() {
    return (
        <aside
            className="w-64 shrink-0 flex flex-col border-l"
            style={{ borderColor: "rgba(51,65,85,0.4)", background: "rgba(10,15,30,0.7)" }}
        >
            {/* Header */}
            <div className="p-5 border-b space-y-1.5" style={{ borderColor: "rgba(51,65,85,0.4)" }}>
                <Bone className="h-3 w-24" />
                <Bone className="h-2.5 w-32" style={{ opacity: 0.5 }} />
            </div>

            {/* Skill gap rows */}
            <div className="flex-1 p-4 space-y-2.5 overflow-hidden">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <SkillGapRowSkeleton key={i} index={i} />
                ))}
            </div>

            {/* Legend */}
            <div className="p-4 border-t space-y-2" style={{ borderColor: "rgba(51,65,85,0.4)" }}>
                <Bone className="h-2.5 w-16 mb-3" style={{ opacity: 0.5 }} />
                {[0, 1, 2].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                        <Bone className="w-1.5 h-1.5 rounded-full" />
                        <Bone className="h-2.5 w-12" />
                    </div>
                ))}
            </div>
        </aside>
    );
}

/* ─── Full Dashboard Skeleton ────────────────────────────────────────────── */
export function ReportSkeleton() {
    return (
        <>
            <style>{shimmerStyle}</style>
            <div
                className="min-h-screen flex flex-col"
                style={{
                    background: "linear-gradient(135deg, #0a0f1e 0%, #0d1627 50%, #0a1628 100%)",
                    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                }}
            >
                {/* Top nav bar */}
                <div
                    className="h-10 border-b flex items-center px-5 gap-3 shrink-0"
                    style={{ borderColor: "rgba(51,65,85,0.4)", background: "rgba(10,15,30,0.8)" }}
                >
                    <Bone className="h-2.5 w-20" />
                    <div className="flex-1" />
                    <Bone className="h-2.5 w-16" />
                    <Bone className="h-2.5 w-16" />
                </div>

                {/* Three-panel layout */}
                <div className="flex flex-1 overflow-hidden">
                    <SidebarSkeleton />
                    <MainPanelSkeleton />
                    <RightSidebarSkeleton />
                </div>
            </div>
        </>
    );
}