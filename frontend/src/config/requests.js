import axios from "axios";
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

export default requests;
