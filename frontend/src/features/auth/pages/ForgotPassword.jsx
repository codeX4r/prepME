import { useNavigate } from "react-router";
import { FaEnvelopeOpenText, FaArrowRight, FaShieldAlt, FaClock } from "react-icons/fa";

export function ForgotPassword() {
    const navigate = useNavigate();

    return (
        <div className="flex h-screen items-center justify-center bg-[#0b1120] px-4">
            <div className="w-full max-w-sm">
                {/* Main card */}
                <div className="rounded-2xl border border-slate-800 bg-[#0f1729] p-8 text-center shadow-2xl">
                    {/* Icon */}
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/70">
                        <FaEnvelopeOpenText className="h-6 w-6 text-sky-400" />
                    </div>

                    {/* Heading */}
                    <h1 className="text-2xl font-semibold text-white">
                        Link Sent!
                    </h1>

                    {/* Message */}
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                        Check your inbox for a password reset link. If you
                        don't see it, check your spam folder.
                    </p>

                    {/* CTA */}
                    <button
                        onClick={() => navigate("/auth")}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-400"
                    >
                        Back to Login
                    </button>
                </div>

                {/* Info cards */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-800 bg-[#0f1729] px-4 py-3 text-left">
                        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-slate-500">
                            <FaShieldAlt className="h-3 w-3 text-sky-400" />
                            Security
                        </div>
                        <p className="mt-1 text-sm font-medium text-slate-200">
                            One-Time Use Link
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-[#0f1729] px-4 py-3 text-left">
                        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-slate-500">
                            <FaClock className="h-3 w-3 text-sky-400" />
                            Expires
                        </div>
                        <p className="mt-1 text-sm font-medium text-slate-200">
                            In 15 Minutes
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}