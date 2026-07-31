import { useContext, useState } from "react";
import { useNavigate } from "react-router"
import { useAuth } from "../hooks/useAuth.jsx"
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { useGoogleLogin } from "@react-oauth/google"
import { googleLoginApi } from "../auth.api.js";
import { AuthContext } from "../context/auth.context.jsx";

const Auth = () => {
    const { handleLogin, handleRegister, loading } = useAuth();
    const navigate = useNavigate()
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [authMode, setAuthMode] = useState("login");
    const [error, setError] = useState("");
    // const [user, setUser] = useState({})

    const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

    const validateRegisterForm = () => {
        const trimmedUsername = username.trim();
        if (!trimmedUsername) return "Username is required.";
        if (trimmedUsername.length < 3) return "Username must be at least 3 characters.";
        if (!email.trim()) return "Email is required.";
        if (!isValidEmail(email)) return "Please enter a valid email address.";
        if (!password) return "Password is required.";
        if (password.length < 8) return "Password must be at least 8 characters.";
        return "";
    };

    const validateLoginForm = () => {
        if (!email.trim()) return "Email is required.";
        if (!isValidEmail(email)) return "Please enter a valid email address.";
        if (!password) return "Password is required.";
        return "";
    };

    async function handleAuth(e) {
        e.preventDefault();
        setError("");

        const validationError = authMode === "register" ? validateRegisterForm() : validateLoginForm();
        if (validationError) { setError(validationError); return; }

        if (authMode === "register") {
            try {
                await handleRegister(username.trim(), email.trim(), password);
                navigate("/prepME");
            } catch (err) {
                setError(err?.response?.data?.message || "Registration failed");
            }
        } else {
            try {
                await handleLogin({ email: email.trim(), password });
                navigate("/prepME");
            } catch (err) {
                setError(err?.response?.data?.message || "Login failed");
            }
        }
    }

    const { setUser } = useContext(AuthContext)

    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (tokenResponse) => {
            try { // sending tokencode to backend
                const response = await googleLoginApi(tokenResponse.code)
                console.log(response.data);
                console.log("Before navigate");
                setUser(response.data.user)
                navigate("/prepME");
                console.log("After navigate");
            } catch (error) {
                console.log(error);

            }
        },
        onError: () => console.log("Google login failed")
    })

    return (
        <>
            <style>{`
                @keyframes shimmerBlob {
                    0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.12; }
                    50%       { transform: scale(1.15) translate(10px, -10px); opacity: 0.18; }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .auth-card   { animation: fadeUp 0.5s ease both; }
                .blob-1      { animation: shimmerBlob 7s ease-in-out infinite; }
                .blob-2      { animation: shimmerBlob 9s ease-in-out 2s infinite; }
                .field-input {
                    width: 100%;
                    padding: 10px 14px;
                    font-size: 0.875rem;
                    border-radius: 10px;
                    border: 1px solid rgba(51,65,85,0.7);
                    background: rgba(15,23,42,0.7);
                    color: #e2e8f0;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    font-family: inherit;
                }
                .field-input::placeholder { color: rgba(100,116,139,0.8); }
                .field-input:focus {
                    border-color: rgba(6,182,212,0.6);
                    box-shadow: 0 0 0 3px rgba(6,182,212,0.12);
                }
                .grid-bg {
                    background-image:
                        linear-gradient(rgba(6,182,212,0.07) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(6,182,212,0.07) 1px, transparent 1px);
                    background-size: 48px 48px;
                }
            `}</style>

            <main
                className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden grid-bg"
                style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1627 50%, #0a1628 100%)", fontFamily: "'DM Sans','Segoe UI',sans-serif" }}
            >
                {/* Ambient blobs */}
                <div className="blob-1 absolute top-[-15%] left-[-10%] w-96 h-96 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, #06b6d4, transparent 70%)" }} />
                <div className="blob-2 absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, #3b82f6, transparent 70%)" }} />

                <div className="auth-card relative w-full max-w-md">

                    {/* Brand mark */}
                    <div className="flex flex-col items-center mb-8 gap-2">
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl relative"
                            style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.2),rgba(59,130,246,0.2))", border: "1px solid rgba(6,182,212,0.35)" }}
                        >
                            <span className="relative z-10">⚡</span>
                            <span className="absolute inset-0 rounded-2xl animate-ping opacity-15"
                                style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)", animationDuration: "2.5s" }} />
                        </div>
                        <span className="text-xs font-bold tracking-widest uppercase text-cyan-400">prep-ME</span>
                    </div>

                    {/* Card */}
                    <div
                        className="rounded-2xl p-8"
                        style={{ background: "rgba(13,22,39,0.85)", border: "1px solid rgba(51,65,85,0.6)", backdropFilter: "blur(16px)" }}
                    >
                        {/* Heading */}
                        <h2 className="text-xl font-bold text-slate-100 mb-1">
                            {authMode === "register" ? "Create an account" : "Welcome back"}
                        </h2>
                        <p className="text-xs text-slate-500 mb-6">
                            {authMode === "register"
                                ? "Sign up to start your interview prep journey."
                                : "Log in to continue your preparation."}
                        </p>

                        {/* Tab toggle */}
                        <div
                            className="flex gap-1 rounded-xl p-1 mb-6"
                            style={{ background: "rgba(15,23,42,0.8)", border: "1px solid rgba(51,65,85,0.5)" }}
                        >
                            {["login", "register"].map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => { setAuthMode(mode); setError(""); }}
                                    className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
                                    style={authMode === mode
                                        ? { background: "linear-gradient(135deg,#06b6d4,#3b82f6)", color: "#0a0f1e" }
                                        : { color: "rgba(100,116,139,0.9)" }
                                    }
                                >
                                    {mode === "login" ? "Log in" : "Sign up"}
                                </button>
                            ))}
                        </div>

                        {/* Error */}
                        {error && (
                            <div
                                className="mb-5 flex items-start gap-2 text-sm rounded-xl p-3"
                                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#fca5a5" }}
                            >
                                <span className="mt-0.5 shrink-0">⚠</span>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleAuth} className="flex flex-col gap-4">

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.8)" }}>
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                    className="field-input"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                />
                            </div>

                            {/* Username (register only) */}
                            {authMode === "register" && (
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.8)" }}>
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        placeholder="Enter your username"
                                        autoComplete="username"
                                        required
                                        className="field-input"
                                        value={username}
                                        onChange={(e) => { setUsername(e.target.value); setError(""); }}
                                    />
                                </div>
                            )}

                            {/* Password */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(148,163,184,0.8)" }}>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    autoComplete={authMode === "register" ? "new-password" : "current-password"}
                                    required
                                    className="field-input"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                                />
                                {/* forgot password */}
                                {authMode === "login" ? <span onClick={() => {
                                    console.log("forgot");
                                }} className="text-xs font-semibold tracking-wider text-slate-400">Forgot Password ? </span> : <span></span>}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-1 w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: "linear-gradient(135deg,#06b6d4,#3b82f6)", color: "#0a0f1e" }}
                            >
                                {loading
                                    ? (authMode === "login" ? "Logging in..." : "Signing up...")
                                    : (authMode === "login" ? "Log in" : "Sign up")}
                            </button>

                            {/* Auth options*/}

                        </form>
                        <div className="flex items-center gap-3 my-4">
                            <div className="flex-1 h-px bg-slate-700"></div>
                            <span className="text-xs font-semibold tracking-wider text-slate-400">OR CONTINUE WITH</span>
                            <div className="flex-1 h-px bg-slate-700"></div>
                        </div>
                        {/* Social auth options */}
                        <div className="flex gap-2.5 my-2.5">
                            <button
                                type="button"
                                onClick={() => googleLogin()}
                                className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                                style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(51,65,85,0.7)", color: "#e2e8f0" }}
                            >
                                <FcGoogle size={20} /> Google
                            </button>
                            <button
                                type="button"
                                onClick={() => console.log("github")}
                                className="flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                                style={{ background: "rgba(15,23,42,0.7)", border: "1px solid rgba(51,65,85,0.7)", color: "#e2e8f0" }}
                            >
                                <FaGithub size={20} /> GitHub
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export default Auth;