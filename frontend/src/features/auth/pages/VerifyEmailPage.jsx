// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router";
// import axios from "axios";

// export function VerifyEmailPage() {
//     const { token } = useParams();
//     const navigate = useNavigate();

//     const [loading, setLoading] = useState(true);
//     const [success, setSuccess] = useState(false);
//     const [message, setMessage] = useState("");

//     useEffect(() => {
//         const verifyEmail = async () => {
//             try {
//                 const response = await axios.get(
//                     `http://localhost:3000/api/email/verify-email/${token}`
//                 );

//                 setSuccess(true);
//                 setMessage(response.data.message);
//             } catch (error) {
//                 setSuccess(false);

//                 setMessage(
//                     error.response?.data?.message ||
//                     "Something went wrong."
//                 );
//             } finally {
//                 setLoading(false);
//             }
//         };

//         verifyEmail();
//     }, [token]);

//     if (loading) {
//         return (
//             <div className="flex h-screen items-center justify-center">
//                 <h2>Verifying your email...</h2>
//             </div>
//         );
//     }

//     if (success) {
//         return (
//             <div className="flex h-screen flex-col items-center justify-center gap-4">
//                 <h1>✅ Email Verified</h1>

//                 <p>{message}</p>

//                 <button
//                     onClick={() => navigate("/auth")}
//                 >
//                     Go to Login
//                 </button>
//             </div>
//         );
//     }

//     return (
//         <div className="flex h-screen flex-col items-center justify-center gap-4">
//             <h1>❌ Verification Failed</h1>

//             <p>{message}</p>

//             <button
//                 onClick={() => navigate("/auth")}
//             >
//                 Back to Register
//             </button>
//         </div>
//     );
// }


import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { FaCheck, FaTimes, FaArrowRight, FaSpinner } from "react-icons/fa";

export function VerifyEmailPage() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_CLIENT_URL}/api/email/verify-email/${token}`
                );

                setSuccess(true);
                setMessage(response.data.message);
            } catch (error) {
                setSuccess(false);

                setMessage(
                    error.response?.data?.message ||
                    "Something went wrong."
                );
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [token]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0b1120]">
                <div className="flex flex-col items-center gap-4">
                    <FaSpinner className="h-10 w-10 animate-spin text-sky-400" />
                    <h2 className="text-lg font-medium text-slate-200">
                        Verifying your email...
                    </h2>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0b1120] px-4">
                <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-[#0f1729] p-8 text-center shadow-2xl">
                    {/* Icon */}
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.4)]">
                        <FaCheck className="h-6 w-6 text-sky-400" />
                    </div>

                    {/* Heading */}
                    <h1 className="text-2xl font-semibold text-white">
                        Email Verified
                    </h1>

                    {/* Message */}
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                        {message}
                    </p>

                    {/* Status cards */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-lg border border-slate-800 bg-[#0b1120] px-4 py-3 text-left">
                            <p className="text-[11px] uppercase tracking-wide text-slate-500">
                                Status
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-200">
                                Verified
                            </p>
                        </div>
                        <div className="rounded-lg border border-slate-800 bg-[#0b1120] px-4 py-3 text-left">
                            <p className="text-[11px] uppercase tracking-wide text-slate-500">
                                Access
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-200">
                                Pro Ready
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <button
                        onClick={() => navigate("/auth")}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-sky-400"
                    >
                        Go to Login
                        <FaArrowRight className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen items-center justify-center bg-[#0b1120] px-4">
            <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-[#0f1729] p-8 text-center shadow-2xl">
                {/* Icon */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-red-400 shadow-[0_0_20px_rgba(248,113,113,0.4)]">
                    <FaTimes className="h-6 w-6 text-red-400" />
                </div>

                {/* Heading */}
                <h1 className="text-2xl font-semibold text-white">
                    Verification Failed
                </h1>

                {/* Message */}
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {message}
                </p>

                {/* CTA */}
                <button
                    onClick={() => navigate("/auth")}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-400"
                >
                    Back to Register
                    <FaArrowRight className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}