import { useContext, useEffect } from "react";
import { AuthContext } from "../context/auth.context.jsx";
import { login, register, logout, getme } from "../auth.api.js"

export const useAuth = () => {

    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider")
    }

    const { user, setUser, loading, setLoading } = context


    const handleLogin = async function ({ email, password }) {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            throw err;
        }
    }


    const handleRegister = async function (username, email, password) {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data.user);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            throw err;
        }
    }

    const handleLogout = async function () {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            console.error("logout error:", err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {
                setLoading(true)
                const data = await getme()
                setUser(data?.user ?? null)
            } catch (err) {
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        getAndSetUser()
    }, [])

    return {
        user, loading, handleLogin, handleLogout, handleRegister
    }

}