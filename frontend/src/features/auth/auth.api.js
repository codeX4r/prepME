import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "",
    withCredentials: true
})

export async function register({ username, email, password }) {
    try {
        const response = await api.post("/api/auth/register", { username, email, password })
        return response.data
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", { email, password })
        return response.data
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function logout() {

    try {
        const response = await api.post("/api/auth/logout")
        return response.data

    } catch (err) {
        console.log(err);
        throw err
    }
}

export async function getme() {

    try {
        const response = await api.get("/api/auth/get-me")
        return response.data

    } catch (err) {
        console.log(err);
        throw err

    }
}

// posting Google Auth Code to server for access
export const googleLoginApi = (code) => {
    return api.post("/api/auth/google", { code })
}

api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            originalRequest.url !== "/api/auth/refresh-token"
        ) {

            originalRequest._retry = true;

            try {

                await api.post("/api/auth/refresh-token");

                const response = await api(originalRequest);

                return response;

            } catch (refreshError) {

                return Promise.reject(refreshError);
            }

        }

        return Promise.reject(error);

    }

);