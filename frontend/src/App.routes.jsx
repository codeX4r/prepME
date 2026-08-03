import { createBrowserRouter } from "react-router";
import { MainLayout } from "./layouts/MainLayout";
import Auth from "./features/auth/pages/Auth.jsx";
import { Secured } from "./features/auth/pages/Secured.jsx";
import { Home } from "./features/interview/pages/Home.jsx";
import InterviewReport from "./features/interview/pages/InterviewReport.jsx";
import { LandingPage } from "./features/interview/pages/landing.jsx";
import { VerifyEmailPage } from "./features/auth/pages/VerifyEmailPage.jsx";
import { ForgotPassword } from "./features/auth/pages/ForgotPassword.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/auth",
        element: <Auth />,
    },
    {
        path: "/forgot-password",
        element: <ForgotPassword />,
    },
    {
        element: (
            <Secured>
                <MainLayout />
            </Secured>
        ),
        children: [
            {
                path: "/prepME",
                element: <Home />,
            },
            {
                path: "/interview/:interviewId",
                element: <InterviewReport />,
            },
            {
                path: "/verify-email/:token",
                element: <VerifyEmailPage />
            }
        ],
    },
]);