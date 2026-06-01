import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, visible];
}

function Counter({ to, suffix = "" }) {
    const [val, setVal] = useState(0);
    const [ref, visible] = useInView();
    useEffect(() => {
        if (!visible) return;
        let start = 0;
        const step = Math.ceil(to / 40);
        const t = setInterval(() => {
            start += step;
            if (start >= to) { setVal(to); clearInterval(t); }
            else setVal(start);
        }, 30);
        return () => clearInterval(t);
    }, [visible, to]);
    return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

function FeatureCard({ icon, title, desc, accentBg, accentBorder, delay, wide }) {
    const [ref, visible] = useInView();
    return (
        <div
            ref={ref}
            className={`rounded-2xl p-5 flex flex-col gap-4 transition-all duration-700 ${wide ? "col-span-2 sm:col-span-2" : "col-span-2 sm:col-span-1"}`}
            style={{
                background: "rgba(13,22,39,0.9)",
                border: "1px solid rgba(51,65,85,0.6)",
                backdropFilter: "blur(12px)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(28px)",
                transitionDelay: `${delay}ms`,
            }}
        >
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
            >
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-slate-100 mb-1.5 text-base" style={{ fontFamily: "'DM Mono', monospace" }}>{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function Testimonial({ quote, name, role, initials, delay }) {
    const [ref, visible] = useInView();
    return (
        <div
            ref={ref}
            className="rounded-2xl p-5 flex flex-col gap-4 transition-all duration-700"
            style={{
                background: "rgba(13,22,39,0.9)",
                border: "1px solid rgba(6,182,212,0.15)",
                borderLeft: "3px solid #06b6d4",
                backdropFilter: "blur(12px)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transitionDelay: `${delay}ms`,
            }}
        >
            <p className="text-sm text-slate-300 leading-relaxed italic">"{quote}"</p>
            <div className="flex items-center gap-3">
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-slate-900 shrink-0"
                    style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)" }}
                >
                    {initials}
                </div>
                <div>
                    <p className="text-sm font-semibold text-slate-200">{name}</p>
                    <p className="text-xs text-slate-500" style={{ fontFamily: "'DM Mono',monospace" }}>{role}</p>
                </div>
            </div>
        </div>
    );
}

function StepItem({ n, title, desc, icon, index, isLast }) {
    const [ref, vis] = useInView();
    return (
        <div
            ref={ref}
            className="flex gap-5 relative pb-8"
            style={{
                opacity: vis ? 1 : 0,
                transform: vis ? "none" : "translateX(-20px)",
                transition: `opacity .6s ease ${index * 120}ms, transform .6s ease ${index * 120}ms`,
            }}
        >
            {!isLast && (
                <div
                    className="absolute left-5.5p-11 bottom-0 w-px"
                    style={{ background: "linear-gradient(to bottom, rgba(6,182,212,.4), transparent)" }}
                />
            )}
            <div
                className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-xl relative z-10"
                style={{ background: "rgba(6,182,212,.1)", border: "1px solid rgba(6,182,212,.3)" }}
            >
                {icon}
            </div>
            <div className="pt-1.5">
                <p className="text-[11px] mb-1" style={{ fontFamily: "'DM Mono',monospace", color: "rgba(6,182,212,.7)", letterSpacing: ".1em" }}>{n}</p>
                <h3 className="text-base font-bold text-slate-100 mb-1.5">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
            </div>
        </div>
    );
}

function CtaBanner() {
    const [ref, vis] = useInView();
    const navigate = useNavigate();
    return (
        <section ref={ref} className="px-4 sm:px-6 pb-20 max-w-5xl mx-auto">
            <div
                className="rounded-3xl py-14 px-6 sm:px-12 text-center relative overflow-hidden transition-all duration-700"
                style={{
                    background: "rgba(13,22,39,.9)",
                    border: "1px solid rgba(6,182,212,.2)",
                    backdropFilter: "blur(16px)",
                    opacity: vis ? 1 : 0,
                    transform: vis ? "none" : "translateY(24px)",
                }}
            >
                <div
                    className="absolute -top-15 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle,rgba(6,182,212,.12),transparent 70%)" }}
                />
                <p className="text-[11px] mb-3.5" style={{ fontFamily: "'DM Mono',monospace", color: "#06b6d4", letterSpacing: ".12em", textTransform: "uppercase" }}>Ready to level up?</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 text-slate-100" style={{ letterSpacing: "-.02em" }}>Start your prep journey today</h2>
                <p className="text-base text-slate-500 mb-9 max-w-md mx-auto leading-relaxed">
                    Generate your strategy now and start your journey to a better offer.
                </p>
                <button
                    className="btn-primary text-base px-12 py-4"
                    onClick={() => navigate("/prepME")}
                >
                    Generate Strategy →
                </button>
            </div>
        </section>
    );
}

export function LandingPage() {
    const navigate = useNavigate();
    const [statsRef, statsVisible] = useInView();

    const features = [
        { icon: "⚡", title: "AI Strategy", desc: "Custom roadmaps generated from your specific target job description. Curated technical and behavioral questions matched to the role.", accentBg: "rgba(6,182,212,.15)", accentBorder: "rgba(6,182,212,.4)", delay: 0, wide: true },
        { icon: "🎯", title: "Skill Analysis", desc: "Identify and bridge your technical gaps before they cost you the offer.", accentBg: "rgba(59,130,246,.15)", accentBorder: "rgba(59,130,246,.4)", delay: 80, wide: false },
        { icon: "🧠", title: "Mock Interviews (soon)", desc: "Real-time feedback on your responses with AI-powered scoring.", accentBg: "rgba(139,92,246,.15)", accentBorder: "rgba(139,92,246,.4)", delay: 160, wide: false },
        { icon: "🗺️", title: "Road Map", desc: "Day-by-day study plans to close skill gaps in the shortest time possible.", accentBg: "rgba(6,182,212,.15)", accentBorder: "rgba(6,182,212,.4)", delay: 240, wide: false },
        { icon: "📊", title: "Match Score", desc: "See exactly how well your current profile matches your target job description.", accentBg: "rgba(245,158,11,.15)", accentBorder: "rgba(245,158,11,.4)", delay: 320, wide: false },
    ];

    const steps = [
        { n: "01", title: "Paste your job description", desc: "Drop in the full JD of the role you're targeting. Our AI reads every requirement.", icon: "📋" },
        { n: "02", title: "Upload your resume or describe yourself", desc: "Let us understand your current skills, projects, and experience level.", icon: "👤" },
        { n: "03", title: "Get your personalised strategy", desc: "Receive tailored questions, a skill gap report, and a day-by-day study plan — instantly.", icon: "⚡" },
    ];

    const testimonials = [
        { initials: "JS", name: "Jordan S.", role: "Senior Frontend Engineer", quote: "prep-ME helped me land a Senior position at a Tier 1 tech company. The skill gap analysis was spot on — it pinpointed exactly what I needed to study.", delay: 0 },
        { initials: "AK", name: "Anika K.", role: "Full-Stack Developer", quote: "The mock interview questions were shockingly accurate to what I was actually asked. I felt genuinely prepared walking into my Google loop.", delay: 100 },
        { initials: "RM", name: "Rahul M.", role: "Backend Engineer", quote: "Went from 0 to 3 offers in 6 weeks. The road map kept me focused and the daily tasks were perfectly sized to fit around my job.", delay: 200 },
        { initials: "SC", name: "Sara C.", role: "DevOps Engineer", quote: "I used 4 other prep tools before this. None of them gave me a personalised plan based on the actual JD. prep-ME is the only one that does.", delay: 300 },
    ];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700;800&display=swap');

                *, *::before, *::after { box-sizing: border-box; }

                body {
                    margin: 0; padding: 0;
                    background: #0a0f1e;
                    font-family: 'Sora', sans-serif;
                }

                @keyframes blobFloat {
                    0%,100% { transform: scale(1) translate(0,0); opacity:.12; }
                    50%     { transform: scale(1.12) translate(12px,-12px); opacity:.18; }
                }
                @keyframes blobFloat2 {
                    0%,100% { transform: scale(1) translate(0,0); opacity:.1; }
                    50%     { transform: scale(1.08) translate(-10px,8px); opacity:.16; }
                }
                @keyframes heroFadeUp {
                    from { opacity:0; transform:translateY(24px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                @keyframes pulseRing {
                    0%   { transform:scale(1); opacity:.4; }
                    100% { transform:scale(1.7); opacity:0; }
                }
                @keyframes gradShift {
                    0%,100% { background-position: 0% 50%; }
                    50%     { background-position: 100% 50%; }
                }
                @keyframes scanline {
                    0%   { top: -4px; }
                    100% { top: 100%; }
                }

                .blob-1 { animation: blobFloat  8s ease-in-out infinite; }
                .blob-2 { animation: blobFloat2 10s ease-in-out 1s infinite; }
                .blob-3 { animation: blobFloat  12s ease-in-out 3s infinite; }

                .hero-a { animation: heroFadeUp .7s ease both; }
                .hero-b { animation: heroFadeUp .7s ease .12s both; }
                .hero-c { animation: heroFadeUp .7s ease .24s both; }
                .hero-d { animation: heroFadeUp .7s ease .36s both; }
                .hero-e { animation: heroFadeUp .7s ease .48s both; }

                .btn-primary {
                    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
                    border-radius: 14px; border: none; cursor: pointer;
                    font-weight: 700; letter-spacing: .01em;
                    background: linear-gradient(135deg, #06b6d4, #3b82f6);
                    background-size: 200% 200%;
                    color: #0a0f1e;
                    transition: opacity .2s, transform .15s, box-shadow .2s;
                    font-family: 'Sora', sans-serif;
                    box-shadow: 0 0 28px rgba(6,182,212,.3);
                    animation: gradShift 4s ease infinite;
                    position: relative; overflow: hidden;
                }
                .btn-primary::after {
                    content: ''; position: absolute; top: -4px; left: 0; right: 0;
                    height: 3px; background: rgba(255,255,255,.35);
                    animation: scanline 2.5s linear infinite;
                }
                .btn-primary:hover  { opacity:.9; transform:translateY(-2px); box-shadow:0 0 44px rgba(6,182,212,.5); }
                .btn-primary:active { transform:scale(.97); }

                .btn-secondary {
                    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
                    border-radius: 14px; cursor: pointer;
                    font-weight: 600;
                    background: rgba(15,23,42,.7);
                    border: 1px solid rgba(51,65,85,.8);
                    color: #94a3b8;
                    transition: color .2s, border-color .2s, transform .15s;
                    font-family: 'Sora', sans-serif;
                }
                .btn-secondary:hover { color: #e2e8f0; border-color: rgba(6,182,212,.5); transform:translateY(-2px); }

                .grid-bg {
                    background-image:
                        linear-gradient(rgba(6,182,212,.055) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(6,182,212,.055) 1px, transparent 1px);
                    background-size: 48px 48px;
                }

                .nav-link {
                    font-size: .85rem; font-weight: 500; color: #64748b;
                    text-decoration: none; transition: color .2s;
                    font-family: 'Sora', sans-serif;
                }
                .nav-link:hover { color: #06b6d4; }

                .stat-card {
                    border-radius: 16px; padding: 24px; text-align: center;
                    background: rgba(13,22,39,.88);
                    border: 1px solid rgba(51,65,85,.6);
                    backdrop-filter: blur(12px);
                    transition: border-color .3s, transform .3s;
                }
                .stat-card:hover { border-color: rgba(6,182,212,.4); transform: translateY(-4px); }

                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: #0a0f1e; }
                ::-webkit-scrollbar-thumb { background: rgba(6,182,212,.25); border-radius: 99px; }
            `}</style>

            <div
                className="relative min-h-screen overflow-x-hidden text-slate-200"
                style={{ background: "linear-gradient(160deg,#0a0f1e 0%,#0d1627 60%,#0a1628 100%)" }}
            >
                {/* Blobs */}
                <div className="blob-1 fixed top-[-18%] left-[-12%] w-120 h-120 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,#06b6d4,transparent 70%)", zIndex: 0 }} />
                <div className="blob-2 fixed bottom-[-14%] right-[-12%] w-100 h-100 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,#3b82f6,transparent 70%)", zIndex: 0 }} />
                <div className="blob-3 fixed top-1/2 right-[6%] w-55 h-55 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,#8b5cf6,transparent 70%)", zIndex: 0 }} />

                {/* Grid */}
                <div className="grid-bg fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />

                {/* ── NAV ── */}
                <nav
                    className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 h-15"
                    style={{ background: "rgba(10,15,30,0.88)", borderBottom: "1px solid rgba(51,65,85,0.4)", backdropFilter: "blur(16px)" }}
                >
                    <div className="flex items-center gap-2.5">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                            style={{ background: "linear-gradient(135deg,rgba(6,182,212,.25),rgba(59,130,246,.25))", border: "1px solid rgba(6,182,212,.4)" }}
                        >⚡</div>
                        <span className="text-sm font-medium text-cyan-400" style={{ fontFamily: "'DM Mono',monospace", letterSpacing: ".08em" }}>prep-ME</span>
                    </div>

                    {/* Desktop links */}
                    <div className="hidden sm:flex items-center gap-7">
                        <a className="nav-link" href="#features">Features</a>
                        <a className="nav-link" href="#how">How it works</a>
                        <a className="nav-link" href="#testimonials">Reviews</a>
                    </div>
                    {/* 
                    <button className="btn-primary text-sm px-5 py-2.5" onClick={() => navigate("/auth")}>
                        Get started
                    </button> */}
                </nav>

                <div className="relative" style={{ zIndex: 1 }}>

                    {/* ── HERO ── */}
                    <section className="px-4 sm:px-6 pt-20 pb-16 max-w-2xl mx-auto text-center">
                        <div className="hero-a inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-7" style={{ background: "rgba(6,182,212,.08)", border: "1px solid rgba(6,182,212,.25)" }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" style={{ animation: "pulseRing 1.8s ease-out infinite" }} />
                            <span className="text-xs text-cyan-400" style={{ fontFamily: "'DM Mono',monospace", letterSpacing: ".06em" }}>AI-Powered Interview Prep</span>
                        </div>

                        <h1 className="hero-b font-extrabold leading-[1.1] mb-4 text-slate-100" style={{ fontSize: "clamp(2rem,5.5vw,3.5rem)", letterSpacing: "-.025em" }}>
                            Master Your Next<br />
                            <span style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                                Interview with prep-ME
                            </span>
                        </h1>

                        <p className="hero-c text-base text-slate-400 leading-relaxed mb-10 max-w-md mx-auto">
                            Personalized strategies, technical skill gap analysis, and mock interviews — all tailored to your exact target role.
                        </p>

                        <div className="hero-d flex flex-col sm:flex-row gap-3 justify-center items-center">
                            {/* <button className="btn-primary text-base px-8 py-4 w-full sm:w-auto" onClick={() => navigate("/auth")}>
                                Start Free Trial →
                            </button> */}
                            <button className="btn-secondary text-base px-8 py-4 w-full sm:w-auto">
                                ▶&nbsp; Watch Demo
                            </button>
                        </div>

                        <div className="hero-e mt-14">
                            <p className="text-[11px] mb-3.5 text-slate-600" style={{ fontFamily: "'DM Mono',monospace", letterSpacing: ".12em", textTransform: "uppercase" }}>Trusted by devs from</p>
                            <div className="flex justify-center flex-wrap gap-6 sm:gap-8">
                                {["CLAUDE", "GEMINI", "STRIPE", "OPENAI"].map(c => (
                                    <span key={c} className="text-xs font-bold text-slate-600" style={{ fontFamily: "'DM Mono',monospace", letterSpacing: ".1em" }}>{c}</span>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── STATS ── */}
                    <section ref={statsRef} className="px-4 sm:px-6 pb-20 max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { label: "Interviews Training", to: 10, suffix: "+" },
                                { label: "Skill gaps identified", to: 98, suffix: "%" },
                                { label: "Avg offer rate lift", to: 3.2, suffix: "×" },
                            ].map(({ label, to, suffix }, i) => (
                                <div
                                    className="stat-card"
                                    key={i}
                                    style={{
                                        opacity: statsVisible ? 1 : 0,
                                        transform: statsVisible ? "none" : "translateY(20px)",
                                        transition: `opacity .6s ease ${i * 80}ms, transform .6s ease ${i * 80}ms`,
                                    }}
                                >
                                    <p
                                        className="text-4xl font-extrabold mb-2"
                                        style={{ fontFamily: "'DM Mono',monospace", background: "linear-gradient(135deg,#06b6d4,#3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
                                    >
                                        <Counter to={to} suffix={suffix} />
                                    </p>
                                    <p className="text-xs text-slate-500 tracking-wide">{label}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── FEATURES ── */}
                    <section id="features" className="px-4 sm:px-6 pb-20 max-w-5xl mx-auto">
                        <div className="mb-10">
                            <p className="text-[11px] text-cyan-400 mb-2.5" style={{ fontFamily: "'DM Mono',monospace", letterSpacing: ".12em", textTransform: "uppercase" }}>Preparation Suite</p>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100" style={{ letterSpacing: "-.02em" }}>Everything you need to land the role</h2>
                        </div>

                        {/* Feature grid: wide card on top (full width), then 2-col grid below */}
                        <div className="flex flex-col gap-3">
                            {/* Wide top card */}
                            <FeatureCard {...features[0]} wide={false} />

                            {/* 2-col grid for rest */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {features.slice(1).map((f, i) => (
                                    <FeatureCard key={i} {...f} wide={false} />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ── HOW IT WORKS ── */}
                    <section id="how" className="px-4 sm:px-6 pb-20 max-w-xl mx-auto">
                        <div className="mb-10">
                            <p className="text-[11px] text-cyan-400 mb-2.5" style={{ fontFamily: "'DM Mono',monospace", letterSpacing: ".12em", textTransform: "uppercase" }}>Process</p>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100" style={{ letterSpacing: "-.02em" }}>Three steps to offer-ready</h2>
                        </div>
                        <div className="flex flex-col">
                            {steps.map((s, i) => (
                                <StepItem key={s.n} {...s} index={i} isLast={i === steps.length - 1} />
                            ))}
                        </div>
                    </section>

                    {/* ── TESTIMONIALS ── */}
                    <section id="testimonials" className="px-4 sm:px-6 pb-20 max-w-5xl mx-auto">
                        <div className="mb-10">
                            <p className="text-[11px] text-cyan-400 mb-2.5" style={{ fontFamily: "'DM Mono',monospace", letterSpacing: ".12em", textTransform: "uppercase" }}>Reviews</p>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100" style={{ letterSpacing: "-.02em" }}>What our users say</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {testimonials.map((t, i) => (
                                <Testimonial key={i} {...t} />
                            ))}
                        </div>
                    </section>

                    {/* ── CTA BANNER ── */}
                    <CtaBanner />

                    {/* ── FOOTER ── */}
                    <footer
                        className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-8 max-w-5xl mx-auto flex-wrap"
                        style={{ borderTop: "1px solid rgba(51,65,85,.4)" }}
                    >
                        <span className="text-sm font-medium text-cyan-400" style={{ fontFamily: "'DM Mono',monospace", letterSpacing: ".08em" }}>⚡ prep-ME</span>
                        <p className="text-xs text-slate-600" style={{ fontFamily: "'DM Mono',monospace" }}>Built for modern interview preparation workflows.</p>
                        <div className="flex gap-5">
                            {["Privacy", "Terms", "Contact"].map(l => (
                                <a key={l} href="#" className="nav-link text-xs">{l}</a>
                            ))}
                        </div>
                    </footer>

                </div>
            </div>
        </>
    );
}