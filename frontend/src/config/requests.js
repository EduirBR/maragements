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
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            toast.error("Sesión expirada. Redirigiendo al login...");
            setTimeout(() => (window.location.href = "/login"), 1500);
        }

        if (status === 429) {
            toast.error("Demasiadas solicitudes. Intenta de nuevo más tarde.");
        }

        return Promise.reject(error);
    },
);

export default requests;
