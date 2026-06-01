import { createBrowserRouter } from "react-router"
import Auth from "./features/auth/pages/Auth.jsx"
import { Secured } from "./features/auth/pages/Secured.jsx"
import { Home } from "./features/interview/pages/Home.jsx"
import InterviewReport from "./features/interview/pages/InterviewReport.jsx"
import { LandingPage } from "./features/interview/pages/landing.jsx"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: "/auth",
        element: <Auth />
    },
    {
        path: "/prepME",
        element: (
            <Secured>
                <Home />
            </Secured>
        )
    },
    {
        path: "/interview/:interviewId",
        element: (
            <Secured>
                <InterviewReport />
            </Secured>
        )
    }
])