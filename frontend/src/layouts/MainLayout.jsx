import { Outlet, useNavigate } from "react-router";
import { Header } from "../header/Header";
import { logout } from "../features/auth/auth.api";

export function MainLayout() {
    const navigate = useNavigate();

    async function handleLogout() {
        console.log(" 1 logout clicked")
        try {
            const res = await logout();
            console.log(" 2 API success", res);
            navigate("/auth", { replace: true });
            console.log("3 navigate called");

        } catch (err) {
            console.error(err);
        }
    }
    return (
        <>
            <Header onLogout={handleLogout} />
            <Outlet />
        </>
    );
}