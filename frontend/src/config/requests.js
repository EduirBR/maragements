import axios from "axios";
import toast from "react-hot-toast";
import { URLBASE } from "./const";

const requests = axios.create({
    baseURL: `${URLBASE}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

requests.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

requests.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            const msg = error.response?.data?.message || "Sesión expirada";
            const isAuthRoute =
                error.config?.url?.includes("/auth/login") ||
                error.config?.url?.includes("/auth/register");
            if (!isAuthRoute) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("user");
                setTimeout(() => (window.location.href = "/login"), 1500);
            }
            toast.error(msg);
        }

        if (status === 429) {
            toast.error("Demasiadas solicitudes. Intenta de nuevo más tarde.");
        }

        return Promise.reject(error);
    },
);

export default requests;
