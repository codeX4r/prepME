import { Navigate } from "react-router"
import { useAuth } from "../hooks/useAuth.jsx"



export function Secured({ children }) {

    const { user, loading } = useAuth()

    if (loading) return null

    if (!user) { return (<Navigate to={'/auth'} />) }

    return children
}